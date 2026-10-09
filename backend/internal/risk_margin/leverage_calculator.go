package risk_margin

import (
	"errors"
	"math"
)

// LeverageCalculator computes margin requirements for x1 - x100 leverage
type LeverageCalculator struct{}

func NewLeverageCalculator() *LeverageCalculator {
	return &LeverageCalculator{}
}

// MarginRequirement represents the margin needed for a leveraged position
type MarginRequirement struct {
	Leverage        int     `json:"leverage"`         // x1 to x100
	PositionSize    float64 `json:"position_size"`    // Total notional value
	InitialMargin   float64 `json:"initial_margin"`   // Required upfront deposit
	MaintenanceRate float64 `json:"maintenance_rate"`  // % below which liquidation triggers
	LiquidationPx   float64 `json:"liquidation_price"` // Price at which position is force-closed
}

// CalcInitialMargin computes how much collateral is needed to open a position
// Formula: InitialMargin = PositionSize / Leverage
func (c *LeverageCalculator) CalcInitialMargin(entryPrice float64, quantity float64, leverage int) (*MarginRequirement, error) {
	if leverage < 1 || leverage > 100 {
		return nil, errors.New("leverage must be between x1 and x100")
	}

	positionSize := entryPrice * quantity
	initialMargin := positionSize / float64(leverage)
	maintenanceRate := calcMaintenanceRate(leverage)

	// Liquidation price for LONG position:
	// LiqPrice = EntryPrice × (1 - 1/Leverage + MaintenanceRate)
	liqPriceLong := entryPrice * (1.0 - 1.0/float64(leverage) + maintenanceRate)

	return &MarginRequirement{
		Leverage:        leverage,
		PositionSize:    round8(positionSize),
		InitialMargin:   round8(initialMargin),
		MaintenanceRate: maintenanceRate,
		LiquidationPx:   round8(liqPriceLong),
	}, nil
}

// calcMaintenanceRate returns the maintenance margin rate based on leverage tier
func calcMaintenanceRate(leverage int) float64 {
	switch {
	case leverage <= 5:
		return 0.02  // 2%
	case leverage <= 20:
		return 0.025 // 2.5%
	case leverage <= 50:
		return 0.03  // 3%
	default:
		return 0.05  // 5% for x51-x100
	}
}

func round8(v float64) float64 {
	return math.Round(v*1e8) / 1e8
}
