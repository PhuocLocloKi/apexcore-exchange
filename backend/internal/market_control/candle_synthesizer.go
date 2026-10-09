package market_control

import (
	"time"
)

type Candle struct {
	Symbol     string    `json:"symbol"`
	Resolution string    `json:"resolution"`
	Open       float64   `json:"open"`
	High       float64   `json:"high"`
	Low        float64   `json:"low"`
	Close      float64   `json:"close"`
	Volume     float64   `json:"volume"`
	Timestamp  time.Time `json:"timestamp"`
}

type CandleSynthesizer struct {
	manipulator *PriceManipulator
}

func NewCandleSynthesizer(manipulator *PriceManipulator) *CandleSynthesizer {
	return &CandleSynthesizer{manipulator: manipulator}
}

func (cs *CandleSynthesizer) GenerateNextCandle(symbol string, lastPrice float64) *Candle {
	targetPrice, exists := cs.manipulator.GetTargetPrice(symbol)
	closePrice := lastPrice

	if exists && targetPrice > 0 {
		closePrice = targetPrice
	} else {
		// Small realistic tick vibration
		closePrice = lastPrice * (1.0 + (float64(time.Now().UnixNano()%21-10) / 1000.0))
	}

	high := lastPrice
	if closePrice > high {
		high = closePrice
	}
	high += (closePrice * 0.002)

	low := lastPrice
	if closePrice < low {
		low = closePrice
	}
	low -= (closePrice * 0.002)

	return &Candle{
		Symbol:     symbol,
		Resolution: "1s",
		Open:       lastPrice,
		High:       high,
		Low:        low,
		Close:      closePrice,
		Volume:     15.42,
		Timestamp:  time.Now(),
	}
}
