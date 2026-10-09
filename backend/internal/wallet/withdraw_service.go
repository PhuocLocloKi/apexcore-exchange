package wallet

import (
	"errors"
	"fmt"
	"time"
)

type WithdrawService struct {
	ledgerRepo LedgerRepository
}

func NewWithdrawService(repo LedgerRepository) *WithdrawService {
	return &WithdrawService{ledgerRepo: repo}
}

type WithdrawalTicket struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Amount         float64   `json:"amount"`
	Currency       string    `json:"currency"`
	BankName       string    `json:"bank_name"`
	BankAccountNo  string    `json:"bank_account_no"`
	BankAccountName string   `json:"bank_account_name"`
	Status         string    `json:"status"` // PENDING_APPROVAL, APPROVED, PROCESSED, REJECTED
	CreatedAt      time.Time `json:"created_at"`
}

func (s *WithdrawService) RequestWithdrawal(userID, currency string, amount float64, bankName, accountNo, accountName string) (*WithdrawalTicket, error) {
	acc, err := s.ledgerRepo.GetAccount(userID, currency)
	if err != nil {
		return nil, err
	}

	if acc.Balance < amount {
		return nil, errors.New("insufficient balance for withdrawal")
	}

	// Lock the withdrawal balance
	newBalance := acc.Balance - amount
	newLocked := acc.LockedBalance + amount
	if err := s.ledgerRepo.UpdateBalance(acc.ID, newBalance, newLocked); err != nil {
		return nil, err
	}

	ticket := &WithdrawalTicket{
		ID:              fmt.Sprintf("wd_%d", time.Now().UnixNano()),
		UserID:          userID,
		Amount:          amount,
		Currency:        currency,
		BankName:        bankName,
		BankAccountNo:   accountNo,
		BankAccountName: accountName,
		Status:          "PENDING_APPROVAL",
		CreatedAt:       time.Now(),
	}

	return ticket, nil
}
