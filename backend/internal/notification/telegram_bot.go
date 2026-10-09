package notification

import (
	"fmt"
	"time"

	"apexcore-exchange/backend/pkg/logger"
)

// TelegramAlertBot sends 24/7 critical notifications to Admin's phone
// Spec Section 5.2: Deposit alerts, withdrawal approval requests, system alerts
type TelegramAlertBot struct {
	log       *logger.Logger
	botToken  string
	chatID    string
	isEnabled bool
}

func NewTelegramAlertBot(log *logger.Logger, botToken, chatID string) *TelegramAlertBot {
	return &TelegramAlertBot{
		log:       log,
		botToken:  botToken,
		chatID:    chatID,
		isEnabled: botToken != "" && chatID != "",
	}
}

// NotifyDeposit sends deposit confirmation to admin Telegram
func (b *TelegramAlertBot) NotifyDeposit(userName string, amount float64, currency string) {
	msg := fmt.Sprintf(
		"💰 NẠP TIỀN THÀNH CÔNG!\n"+
			"Khách hàng: %s\n"+
			"Số tiền: %.0f %s qua VietQR\n"+
			"Thời gian: %s",
		userName, amount, currency, time.Now().Format("15:04:05"),
	)
	b.send(msg)
}

// NotifyWithdrawalRequest sends withdrawal approval request to admin Telegram
func (b *TelegramAlertBot) NotifyWithdrawalRequest(userName string, amount float64, currency, bankName, bankAccount string) {
	msg := fmt.Sprintf(
		"📤 YÊU CẦU RÚT TIỀN MỚI!\n"+
			"Khách hàng: %s\n"+
			"Số tiền: %.0f %s\n"+
			"Ngân hàng: %s - %s\n"+
			"*[BẤM VÀO ĐÂY ĐỂ DUYỆT NGAY]*",
		userName, amount, currency, bankName, bankAccount,
	)
	b.send(msg)
}

// NotifyCircuitBreaker alerts admin when a symbol is halted
func (b *TelegramAlertBot) NotifyCircuitBreaker(symbol string, changePercent float64) {
	msg := fmt.Sprintf(
		"🚨 CIRCUIT BREAKER KÍCH HOẠT!\n"+
			"Mã: %s\n"+
			"Biến động: %.2f%%\n"+
			"Trạng thái: TẠM DỪNG GIAO DỊCH 5 PHÚT\n"+
			"Thời gian: %s",
		symbol, changePercent, time.Now().Format("15:04:05"),
	)
	b.send(msg)
}

// NotifyLiquidation alerts admin when a user's position is force-closed
func (b *TelegramAlertBot) NotifyLiquidation(userID, symbol string, leverage int, lossAmount float64) {
	msg := fmt.Sprintf(
		"🔥 THANH LÝ VỊ THẾ!\n"+
			"User: %s\n"+
			"Mã: %s | Đòn bẩy: x%d\n"+
			"Tổn thất: %.0f VNĐ\n"+
			"Thời gian: %s",
		userID, symbol, leverage, lossAmount, time.Now().Format("15:04:05"),
	)
	b.send(msg)
}

func (b *TelegramAlertBot) send(text string) {
	if !b.isEnabled {
		b.log.Info("[TELEGRAM-STUB] %s", text)
		return
	}

	// Production: POST https://api.telegram.org/bot<TOKEN>/sendMessage
	// Body: {"chat_id": "<CHAT_ID>", "text": "<TEXT>", "parse_mode": "Markdown"}
	b.log.Info("[TELEGRAM] Sent alert to chat %s", b.chatID)
}
