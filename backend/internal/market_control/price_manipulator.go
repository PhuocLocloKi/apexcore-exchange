package market_control

import (
	"sync"
)

type PriceManipulator struct {
	mu            sync.RWMutex
	targetPrices map[string]float64
}

func NewPriceManipulator() *PriceManipulator {
	return &PriceManipulator{
		targetPrices: make(map[string]float64),
	}
}

func (p *PriceManipulator) SetTargetPrice(symbol string, price float64) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.targetPrices[symbol] = price
}

func (p *PriceManipulator) GetTargetPrice(symbol string) (float64, bool) {
	p.mu.RLock()
	defer p.mu.RUnlock()
	price, exists := p.targetPrices[symbol]
	return price, exists
}
