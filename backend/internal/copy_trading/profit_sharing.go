package copy_trading

import (
	"fmt"
	"time"
)

// ProfitSharingService automatically distributes commission to Master Traders
// when their followers earn profits from copied trades.
type ProfitSharingService struct {
	commissionRate float64 // Default: 10% of follower's profit goes to Master
}

func NewProfitSharingService(commissionRate float64) *ProfitSharingService {
	if commissionRate <= 0 || commissionRate > 1.0 {
		commissionRate = 0.10 // 10% default
	}
	return &ProfitSharingService{commissionRate: commissionRate}
}

// ProfitShareResult records the commission distribution for a single trade
type ProfitShareResult struct {
	MasterID      string    `json:"master_id"`
	FollowerID    string    `json:"follower_id"`
	Symbol        string    `json:"symbol"`
	FollowerPnL   float64   `json:"follower_pnl"`
	Commission    float64   `json:"commission"`
	Rate          float64   `json:"rate"`
	SettledAt     time.Time `json:"settled_at"`
}

// CalculateAndDistribute computes commission when a follower's copied trade closes
// Commission = FollowerProfit × CommissionRate (only charged on profit, never on loss)
func (s *ProfitSharingService) CalculateAndDistribute(
	masterID, followerID, symbol string,
	followerPnL float64,
) *ProfitShareResult {
	commission := 0.0
	if followerPnL > 0 {
		// Only charge commission on positive PnL
		commission = followerPnL * s.commissionRate
	}

	return &ProfitShareResult{
		MasterID:    masterID,
		FollowerID:  followerID,
		Symbol:      symbol,
		FollowerPnL: followerPnL,
		Commission:  commission,
		Rate:        s.commissionRate,
		SettledAt:   time.Now(),
	}
}

// SetCommissionRate allows admin to adjust the master trader commission %
func (s *ProfitSharingService) SetCommissionRate(rate float64) error {
	if rate < 0 || rate > 0.50 {
		return fmt.Errorf("commission rate must be between 0%% and 50%%")
	}
	s.commissionRate = rate
	return nil
}
