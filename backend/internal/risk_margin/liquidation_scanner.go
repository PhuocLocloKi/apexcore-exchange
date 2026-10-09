package risk_margin

import (
	"sync"
	"time"

	"apexcore-exchange/backend/pkg/logger"
)

// LiquidationScanner continuously monitors open positions and force-closes
// any position whose margin balance has fallen below the maintenance threshold.
type LiquidationScanner struct {
	mu         sync.RWMutex
	log        *logger.Logger
	positions  map[string]*OpenPosition
	calculator *LeverageCalculator
	isRunning  bool
}

// OpenPosition represents a leveraged trade that may be liquidated
type OpenPosition struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	Symbol          string    `json:"symbol"`
	Side            string    `json:"side"` // LONG or SHORT
	EntryPrice      float64   `json:"entry_price"`
	Quantity        float64   `json:"quantity"`
	Leverage        int       `json:"leverage"`
	MarginDeposit   float64   `json:"margin_deposit"`
	LiquidationPx   float64   `json:"liquidation_price"`
	IsLiquidated    bool      `json:"is_liquidated"`
	CreatedAt       time.Time `json:"created_at"`
}

func NewLiquidationScanner(log *logger.Logger, calc *LeverageCalculator) *LiquidationScanner {
	return &LiquidationScanner{
		log:        log,
		positions:  make(map[string]*OpenPosition),
		calculator: calc,
	}
}

// RegisterPosition adds a new leveraged position to the scanner watchlist
func (s *LiquidationScanner) RegisterPosition(pos *OpenPosition) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.positions[pos.ID] = pos
	s.log.Info("[RISK] Registered position %s | %s %s x%d | Liq@%.2f",
		pos.ID, pos.Side, pos.Symbol, pos.Leverage, pos.LiquidationPx)
}

// ScanAtPrice checks all open positions against the current market price
// and liquidates any position that has breached its liquidation threshold.
func (s *LiquidationScanner) ScanAtPrice(symbol string, currentPrice float64) []*OpenPosition {
	s.mu.Lock()
	defer s.mu.Unlock()

	liquidated := make([]*OpenPosition, 0)
	for _, pos := range s.positions {
		if pos.Symbol != symbol || pos.IsLiquidated {
			continue
		}

		shouldLiquidate := false
		if pos.Side == "LONG" && currentPrice <= pos.LiquidationPx {
			shouldLiquidate = true
		}
		if pos.Side == "SHORT" && currentPrice >= pos.LiquidationPx {
			shouldLiquidate = true
		}

		if shouldLiquidate {
			pos.IsLiquidated = true
			liquidated = append(liquidated, pos)
			s.log.Info("[LIQUIDATION] 🔥 Position %s | User %s | %s %s x%d | Liq@%.2f | Market@%.2f",
				pos.ID, pos.UserID, pos.Side, pos.Symbol, pos.Leverage, pos.LiquidationPx, currentPrice)
		}
	}

	return liquidated
}

// Start begins the continuous scanning loop
func (s *LiquidationScanner) Start(interval time.Duration) {
	s.isRunning = true
	s.log.Info("[RISK] Liquidation scanner started (interval: %v)", interval)
}

// Stop halts the scanning loop
func (s *LiquidationScanner) Stop() {
	s.isRunning = false
	s.log.Info("[RISK] Liquidation scanner stopped")
}
