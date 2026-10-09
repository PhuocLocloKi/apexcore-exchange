package matching

import (
	"apexcore-exchange/backend/pkg/logger"
)

type ExecutionService struct {
	log *logger.Logger
}

func NewExecutionService(log *logger.Logger) *ExecutionService {
	return &ExecutionService{log: log}
}

func (s *ExecutionService) ProcessTradeExecution(match *TradeMatch) {
	s.log.Info("[MATCH EXECUTED] Symbol: %s | Price: %.2f | Qty: %.4f | Buyer: %s | Seller: %s",
		match.Symbol, match.Price, match.Quantity, match.BuyerID, match.SellerID)
}
