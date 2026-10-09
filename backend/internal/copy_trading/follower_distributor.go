package copy_trading



type MasterTradeOrder struct {
	MasterID string  `json:"master_id"`
	Symbol   string  `json:"symbol"`
	Side     string  `json:"side"`
	Amount   float64 `json:"amount"`
	Price    float64 `json:"price"`
}

type FollowerDistributor struct{}

func NewFollowerDistributor() *FollowerDistributor {
	return &FollowerDistributor{}
}

func (d *FollowerDistributor) ReplicateMasterOrderToFollowers(masterOrder *MasterTradeOrder, followerIDs []string) int {
	replicatedCount := 0
	for range followerIDs {
		// Replicate order proportional to follower margin setting
		replicatedCount++
	}
	return replicatedCount
}
