// ========================================================
// APEXCORE REAL-TIME WEBSOCKET STREAM (backend/ws/stream.go)
// Cổng WebSocket Hub phân phối triệu kết nối đồng thời siêu nhẹ
// Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
// ========================================================

package ws

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

// Gói tin truyền tin thời gian thực
type MarketEvent struct {
	Type      string      `json:"type"` // "TICKER", "DEPTH_L2", "TRADE"
	Symbol    string      `json:"symbol"`
	Data      interface{} `json:"data"`
	Timestamp int64       `json:"timestamp"`
}

type ClientConnection struct {
	ID       string
	SendChan chan []byte
}

type StreamHub struct {
	sync.RWMutex
	Clients    map[string]*ClientConnection
	Broadcast  chan []byte
	Register   chan *ClientConnection
	Unregister chan *ClientConnection
}

var Hub = &StreamHub{
	Clients:    make(map[string]*ClientConnection),
	Broadcast:  make(chan []byte, 1024),
	Register:   make(chan *ClientConnection, 256),
	Unregister: make(chan *ClientConnection, 256),
}

func (h *StreamHub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Lock()
			h.Clients[client.ID] = client
			h.Unlock()

		case client := <-h.Unregister:
			h.Lock()
			if _, ok := h.Clients[client.ID]; ok {
				delete(h.Clients, client.ID)
				close(client.SendChan)
			}
			h.Unlock()

		case message := <-h.Broadcast:
			h.RLock()
			for _, client := range h.Clients {
				select {
				case client.SendChan <- message:
				default:
					// Kênh nghẽn, tự động dọn dẹp để bảo vệ RAM server
				}
			}
			h.RUnlock()
		}
	}
}

// Phát tán biến động giá toàn thị trường
func BroadcastTicker(symbol string, price float64, change24h string) {
	evt := MarketEvent{
		Type:   "TICKER",
		Symbol: symbol,
		Data: map[string]interface{}{
			"price":      price,
			"change_24h": change24h,
		},
		Timestamp: time.Now().UnixMilli(),
	}
	bytes, err := json.Marshal(evt)
	if err == nil {
		select {
		case Hub.Broadcast <- bytes:
		default:
		}
	}
}

// Handler HTTP SSE / WS Fallback
func ServeSSEStream(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	client := &ClientConnection{
		ID:       time.Now().Format("20060102150405.000000"),
		SendChan: make(chan []byte, 128),
	}
	Hub.Register <- client
	defer func() {
		Hub.Unregister <- client
	}()

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	for {
		select {
		case <-r.Context().Done():
			return
		case msg := <-client.SendChan:
			w.Write([]byte("data: "))
			w.Write(msg)
			w.Write([]byte("\n\n"))
			flusher.Flush()
		}
	}
}
