package matching

import (
	"sync"
	"time"

	"apexcore-exchange/backend/pkg/logger"
)

// CircuitBreaker implements automatic market halt when price moves ±10% in 60s
// Spec Section 3.3: Protects against flash crashes and panic sell-offs
type CircuitBreaker struct {
	mu             sync.RWMutex
	log            *logger.Logger
	threshold      float64       // 0.10 = ±10%
	windowDuration time.Duration // 60 seconds
	haltDuration   time.Duration // 5 minutes
	priceSnapshots map[string]*priceWindow
	haltedSymbols  map[string]time.Time
}

type priceWindow struct {
	firstPrice float64
	firstTime  time.Time
}

func NewCircuitBreaker(log *logger.Logger) *CircuitBreaker {
	return &CircuitBreaker{
		log:            log,
		threshold:      0.10,
		windowDuration: 60 * time.Second,
		haltDuration:   5 * time.Minute,
		priceSnapshots: make(map[string]*priceWindow),
		haltedSymbols:  make(map[string]time.Time),
	}
}

// CheckPrice evaluates whether a trade price should trigger a circuit breaker
// Returns true if the symbol is now HALTED
func (cb *CircuitBreaker) CheckPrice(symbol string, tradePrice float64) bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	// Check if already halted
	if haltUntil, ok := cb.haltedSymbols[symbol]; ok {
		if time.Now().Before(haltUntil) {
			return true // Still halted
		}
		// Halt expired, resume trading
		delete(cb.haltedSymbols, symbol)
		cb.log.Info("[CIRCUIT BREAKER] ✅ %s trading resumed", symbol)
	}

	now := time.Now()
	snap, exists := cb.priceSnapshots[symbol]

	if !exists || now.Sub(snap.firstTime) > cb.windowDuration {
		// Start new window
		cb.priceSnapshots[symbol] = &priceWindow{
			firstPrice: tradePrice,
			firstTime:  now,
		}
		return false
	}

	// Calculate % change within window
	changePercent := (tradePrice - snap.firstPrice) / snap.firstPrice
	if changePercent < 0 {
		changePercent = -changePercent
	}

	if changePercent >= cb.threshold {
		// TRIGGER HALT!
		cb.haltedSymbols[symbol] = now.Add(cb.haltDuration)
		cb.log.Info("[CIRCUIT BREAKER] 🚨 %s HALTED! Price moved %.2f%% in %v (%.2f → %.2f)",
			symbol, changePercent*100, now.Sub(snap.firstTime), snap.firstPrice, tradePrice)

		// Reset window for after resumption
		delete(cb.priceSnapshots, symbol)
		return true
	}

	return false
}

// IsHalted checks if a symbol is currently in HALTED state
func (cb *CircuitBreaker) IsHalted(symbol string) bool {
	cb.mu.RLock()
	defer cb.mu.RUnlock()

	haltUntil, ok := cb.haltedSymbols[symbol]
	if !ok {
		return false
	}
	return time.Now().Before(haltUntil)
}
