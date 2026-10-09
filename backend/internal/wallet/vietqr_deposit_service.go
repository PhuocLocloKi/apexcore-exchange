package wallet

import (
	"fmt"
	"time"
)

type VietQRDepositService struct {
	ledgerRepo LedgerRepository
}

func NewVietQRDepositService(repo LedgerRepository) *VietQRDepositService {
	return &VietQRDepositService{ledgerRepo: repo}
}

type DepositQRResponse struct {
	TxnRef     string  `json:"txn_ref"`
	QRCodeURL  string  `json:"qr_code_url"`
	Amount     float64 `json:"amount"`
	Currency   string  `json:"currency"`
	BankName   string  `json:"bank_name"`
	AccountNo  string  `json:"account_no"`
	AccountName string `json:"account_name"`
}

func (s *VietQRDepositService) GenerateDepositQR(userID string, amount float64) (*DepositQRResponse, error) {
	txnRef := fmt.Sprintf("APEX%d", time.Now().UnixNano())
	qrURL := fmt.Sprintf("https://img.vietqr.io/image/970422-19035588888-quicklink.png?amount=%.0f&addInfo=%s", amount, txnRef)

	return &DepositQRResponse{
		TxnRef:      txnRef,
		QRCodeURL:   qrURL,
		Amount:      amount,
		Currency:    "VND",
		BankName:    "MBBank",
		AccountNo:   "19035588888",
		AccountName: "APEXCORE EXCHANGE CORP",
	}, nil
}

func (s *VietQRDepositService) ProcessBankWebhook(txnRef string, amount float64, userID string) error {
	acc, err := s.ledgerRepo.GetAccount(userID, "VND")
	if err != nil {
		return err
	}

	newBalance := acc.Balance + amount
	if err := s.ledgerRepo.UpdateBalance(acc.ID, newBalance, acc.LockedBalance); err != nil {
		return err
	}

	entry := &LedgerEntry{
		ID:            fmt.Sprintf("entry_%d", time.Now().UnixNano()),
		TransactionID: txnRef,
		AccountID:     acc.ID,
		Type:          "CREDIT",
		Amount:        amount,
		BalanceAfter:  newBalance,
		Description:   "VietQR Auto Deposit Success",
		CreatedAt:     time.Now(),
	}

	return s.ledgerRepo.RecordEntry(entry)
}
