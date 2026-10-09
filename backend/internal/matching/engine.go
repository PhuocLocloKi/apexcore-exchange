package matching

import (
	"fmt"
	"time"
)

type TradeMatch struct {
	ID          string    `json:"id"`
	Symbol      string    `json:"symbol"`
	BuyerID     string    `json:"buyer_id"`
	SellerID    string    `json:"seller_id"`
	BuyOrderID  string    `json:"buy_order_id"`
	SellOrderID string    `json:"sell_order_id"`
	Price       float64   `json:"price"`
	Quantity    float64   `json:"quantity"`
	ExecutedAt  time.Time `json:"executed_at"`
}

type Engine struct {
	books map[string]*OrderBook
	exec  *ExecutionService
}

func NewEngine(exec *ExecutionService) *Engine {
	return &Engine{
		books: make(map[string]*OrderBook),
		exec:  exec,
	}
}

func (e *Engine) GetOrderBook(symbol string) *OrderBook {
	if book, ok := e.books[symbol]; ok {
		return book
	}
	book := NewOrderBook(symbol)
	e.books[symbol] = book
	return book
}

func (e *Engine) ProcessOrder(order *Order) []*TradeMatch {
	book := e.GetOrderBook(order.Symbol)
	matches := make([]*TradeMatch, 0)

	book.mu.Lock()
	defer book.mu.Unlock()

	if order.Side == Buy {
		// Match against asks (sellers)
		for len(book.Asks) > 0 && order.FilledQuantity < order.Quantity {
			bestAsk := book.Asks[0]
			if order.Type == Limit && bestAsk.Price > order.Price {
				break // No match possible
			}

			// Calculate fill amount
			askOrder := bestAsk.Orders[0]
			unfilledBuy := order.Quantity - order.FilledQuantity
			unfilledAsk := askOrder.Quantity - askOrder.FilledQuantity

			tradeQty := unfilledBuy
			if unfilledAsk < unfilledBuy {
				tradeQty = unfilledAsk
			}

			order.FilledQuantity += tradeQty
			askOrder.FilledQuantity += tradeQty
			bestAsk.Quantity -= tradeQty

			match := &TradeMatch{
				ID:          fmt.Sprintf("match_%d", time.Now().UnixNano()),
				Symbol:      order.Symbol,
				BuyerID:     order.UserID,
				SellerID:    askOrder.UserID,
				BuyOrderID:  order.ID,
				SellOrderID: askOrder.ID,
				Price:       bestAsk.Price,
				Quantity:    tradeQty,
				ExecutedAt:  time.Now(),
			}
			matches = append(matches, match)
			e.exec.ProcessTradeExecution(match)

			// Clean up filled ask order
			if askOrder.FilledQuantity >= askOrder.Quantity {
				bestAsk.Orders = bestAsk.Orders[1:]
				if len(bestAsk.Orders) == 0 {
					book.Asks = book.Asks[1:]
				}
			}
		}
	} else {
		// Match against bids (buyers)
		for len(book.Bids) > 0 && order.FilledQuantity < order.Quantity {
			bestBid := book.Bids[0]
			if order.Type == Limit && bestBid.Price < order.Price {
				break
			}

			bidOrder := bestBid.Orders[0]
			unfilledSell := order.Quantity - order.FilledQuantity
			unfilledBid := bidOrder.Quantity - bidOrder.FilledQuantity

			tradeQty := unfilledSell
			if unfilledBid < unfilledSell {
				tradeQty = unfilledBid
			}

			order.FilledQuantity += tradeQty
			bidOrder.FilledQuantity += tradeQty
			bestBid.Quantity -= tradeQty

			match := &TradeMatch{
				ID:          fmt.Sprintf("match_%d", time.Now().UnixNano()),
				Symbol:      order.Symbol,
				BuyerID:     bidOrder.UserID,
				SellerID:    order.UserID,
				BuyOrderID:  bidOrder.ID,
				SellOrderID: order.ID,
				Price:       bestBid.Price,
				Quantity:    tradeQty,
				ExecutedAt:  time.Now(),
			}
			matches = append(matches, match)
			e.exec.ProcessTradeExecution(match)

			if bidOrder.FilledQuantity >= bidOrder.Quantity {
				bestBid.Orders = bestBid.Orders[1:]
				if len(bestBid.Orders) == 0 {
					book.Bids = book.Bids[1:]
				}
			}
		}
	}

	// Insert remaining unfilled limit order to OrderBook
	if order.Type == Limit && order.FilledQuantity < order.Quantity {
		if order.Side == Buy {
			book.insertBid(order)
		} else {
			book.insertAsk(order)
		}
	}

	return matches
}
