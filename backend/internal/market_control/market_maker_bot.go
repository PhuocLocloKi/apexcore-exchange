package market_control

import (
	"sync"
)

type MarketMakerBot struct {
	mu        sync.RWMutex
	isRunning bool
	speed     int // orders per second
}

func NewMarketMakerBot() *MarketMakerBot {
	return &MarketMakerBot{
		isRunning: false,
		speed:     10,
	}
}

func (b *MarketMakerBot) Start() {
	b.mu.Lock()
	b.isRunning = true
	b.mu.Unlock()
}

func (b *MarketMakerBot) Stop() {
	b.mu.Lock()
	b.isRunning = false
	b.mu.Unlock()
}

func (b *MarketMakerBot) SetSpeed(ordersPerSecond int) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.speed = ordersPerSecond
}

func (b *MarketMakerBot) IsRunning() bool {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return b.isRunning
}
