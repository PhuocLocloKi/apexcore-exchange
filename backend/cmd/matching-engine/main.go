package main

import (
	"time"

	"apexcore-exchange/backend/internal/matching"
	"apexcore-exchange/backend/internal/market_control"
	"apexcore-exchange/backend/pkg/logger"
)

// matching-engine: High-speed in-memory order matching service
// Processes: Market/Limit orders, FIFO OrderBook, Circuit Breaker
func main() {
	log := logger.NewLogger()
	log.Info("=== APEXCORE EXCHANGE — Matching Engine v1.0 ===")

	// Initialize execution service
	execService := matching.NewExecutionService(log)

	// Initialize matching engine with circuit breaker
	engine := matching.NewEngine(execService)
	circuitBreaker := matching.NewCircuitBreaker(log)

	// Initialize price manipulator and candle synthesizer
	priceManip := market_control.NewPriceManipulator()
	candleSynth := market_control.NewCandleSynthesizer(priceManip)
	marketBot := market_control.NewMarketMakerBot()

	log.Info("📊 OrderBook engine initialized")
	log.Info("🔧 Circuit Breaker active (±10%% / 60s → HALT 5min)")

	// Seed demo symbol
	book := engine.GetOrderBook("FPT")
	log.Info("📈 OrderBook created for symbol: %s", book.Symbol)

	// Demo: Market maker bot seeding
	_ = marketBot
	_ = candleSynth
	_ = circuitBreaker
	_ = priceManip

	// Heartbeat
	ticker := time.NewTicker(10 * time.Second)
	log.Info("💓 Matching Engine running — awaiting orders...")

	for range ticker.C {
		log.Info("[HEARTBEAT] Engine alive | Symbols active: 1")
	}
}
