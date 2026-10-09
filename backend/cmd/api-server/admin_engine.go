package main

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

// Khóa bảo mật tối cao của Founder
const (
	MASTER_ADMIN_EMAIL = "nguyenphuocloc010306@gmail.com"
	MASTER_GOD_PASS    = "LocNguyen@ApexGod2026##"
	MASTER_BACKUP_PASS = "123456"
)

type MarketEngine struct {
	sync.RWMutex
	Prices      map[string]float64 `json:"prices"`
	IsBotActive bool               `json:"is_bot_active"`
	IsFrozen    bool               `json:"is_frozen"`
}

var Engine = &MarketEngine{
	Prices: map[string]float64{
		"BTC_USDT": 85450.90,
		"ETH_USDT": 2619.95,
		"BNB_USDT": 780.35,
		"SOL_USDT": 162.40,
		"AAPL_USD": 232.80,
		"XAU_USD":  2745.50,
		"FPT_VND":  132500,
	},
	IsBotActive: true,
	IsFrozen:    false,
}

type AdminCommand struct {
	Email    string  `json:"email"`
	Passcode string  `json:"passcode"`
	Symbol   string  `json:"symbol"`
	Action   string  `json:"action"` // "SET", "PUMP", "DUMP", "WICK_DOWN", "WICK_UP", "TOGGLE_BOT", "TOGGLE_FREEZE"
	Value    float64 `json:"value"`
}

// API Điều khiển giá dành cho Founder
func HandleAdminPriceControl(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodGet {
		Engine.RLock()
		defer Engine.RUnlock()
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "success",
			"prices":    Engine.Prices,
			"bot":       Engine.IsBotActive,
			"frozen":    Engine.IsFrozen,
			"timestamp": time.Now().Unix(),
		})
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var cmd AdminCommand
	if err := json.NewDecoder(r.Body).Decode(&cmd); err != nil {
		http.Error(w, `{"error":"Dữ liệu JSON không hợp lệ"}`, http.StatusBadRequest)
		return
	}

	// 1. Kiểm tra quyền sở hữu tuyệt đối
	if cmd.Email != MASTER_ADMIN_EMAIL || (cmd.Passcode != MASTER_GOD_PASS && cmd.Passcode != MASTER_BACKUP_PASS) {
		http.Error(w, `{"error":"TRUY CẬP BỊ TỪ CHỐI: BẠN KHÔNG PHẢI CHỦ SỞ HỮU"}`, http.StatusForbidden)
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
		if cmd.Value > 0 {
			Engine.Prices[cmd.Symbol] = cmd.Value
		}
	case "PUMP":
		Engine.Prices[cmd.Symbol] = curPrice * (1 + cmd.Value/100)
	case "DUMP":
		Engine.Prices[cmd.Symbol] = curPrice * (1 - cmd.Value/100)
	case "WICK_DOWN":
		// Quét râu sâu xuống rồi hồi lại
		Engine.Prices[cmd.Symbol] = curPrice * 0.94 // Giảm sốc 6%
		go func(sym string, oldP float64) {
			time.Sleep(2500 * time.Millisecond)
			Engine.Lock()
			Engine.Prices[sym] = oldP * 1.002 // Rút chân nến xanh
			Engine.Unlock()
		}(cmd.Symbol, curPrice)
	case "WICK_UP":
		// Quét râu giật lên cao rồi ép nến xuống
		Engine.Prices[cmd.Symbol] = curPrice * 1.06 // Tăng vọt 6%
		go func(sym string, oldP float64) {
			time.Sleep(2500 * time.Millisecond)
			Engine.Lock()
			Engine.Prices[sym] = oldP * 0.998 // Rút râu nến về
			Engine.Unlock()
		}(cmd.Symbol, curPrice)
	case "TOGGLE_BOT":
		Engine.IsBotActive = !Engine.IsBotActive
	case "TOGGLE_FREEZE":
		Engine.IsFrozen = !Engine.IsFrozen
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "success",
		"symbol":    cmd.Symbol,
		"new_price": Engine.Prices[cmd.Symbol],
		"bot":       Engine.IsBotActive,
		"frozen":    Engine.IsFrozen,
		"timestamp": time.Now().Unix(),
	})
}
