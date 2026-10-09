package matching

import (
	"sort"
	"sync"
	"time"
)

type OrderSide string
type OrderType string

const (
	Buy  OrderSide = "BUY"
	Sell OrderSide = "SELL"

	Limit  OrderType = "LIMIT"
	Market OrderType = "MARKET"
)

type Order struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Symbol         string    `json:"symbol"`
	Side           OrderSide `json:"side"`
	Type           OrderType `json:"type"`
	Price          float64   `json:"price"`
	Quantity       float64   `json:"quantity"`
	FilledQuantity float64   `json:"filled_quantity"`
	CreatedAt      time.Time `json:"created_at"`
}

type PriceLevel struct {
	Price    float64  `json:"price"`
	Quantity float64  `json:"quantity"`
	Orders   []*Order `json:"-"`
}

type OrderBook struct {
	mu     sync.RWMutex
	Symbol string        `json:"symbol"`
	Bids   []*PriceLevel `json:"bids"` // Highest price first
	Asks   []*PriceLevel `json:"asks"` // Lowest price first
}

func NewOrderBook(symbol string) *OrderBook {
	return &OrderBook{
		Symbol: symbol,
		Bids:   make([]*PriceLevel, 0),
		Asks:   make([]*PriceLevel, 0),
	}
}

func (ob *OrderBook) AddOrder(order *Order) {
	ob.mu.Lock()
	defer ob.mu.Unlock()

	if order.Side == Buy {
		ob.insertBid(order)
	} else {
		ob.insertAsk(order)
	}
}

func (ob *OrderBook) insertBid(order *Order) {
	for _, level := range ob.Bids {
		if level.Price == order.Price {
			level.Orders = append(level.Orders, order)
			level.Quantity += (order.Quantity - order.FilledQuantity)
			return
		}
	}

	// New price level
	newLevel := &PriceLevel{
		Price:    order.Price,
		Quantity: order.Quantity - order.FilledQuantity,
		Orders:   []*Order{order},
	}
	ob.Bids = append(ob.Bids, newLevel)
	sort.Slice(ob.Bids, func(i, j int) bool {
		return ob.Bids[i].Price > ob.Bids[j].Price
	})
}

func (ob *OrderBook) insertAsk(order *Order) {
	for _, level := range ob.Asks {
		if level.Price == order.Price {
			level.Orders = append(level.Orders, order)
			level.Quantity += (order.Quantity - order.FilledQuantity)
			return
		}
	}

	newLevel := &PriceLevel{
		Price:    order.Price,
		Quantity: order.Quantity - order.FilledQuantity,
		Orders:   []*Order{order},
	}
	ob.Asks = append(ob.Asks, newLevel)
	sort.Slice(ob.Asks, func(i, j int) bool {
		return ob.Asks[i].Price < ob.Asks[j].Price
	})
}
