package wallet

import (
	"fmt"
	"time"
)

type Account struct {
	ID            string  `json:"id"`
	UserID        string  `json:"user_id"`
	Currency      string  `json:"currency"`
	Balance       float64 `json:"balance"`
	LockedBalance float64 `json:"locked_balance"`
}

type LedgerEntry struct {
	ID            string    `json:"id"`
	TransactionID string    `json:"transaction_id"`
	AccountID     string    `json:"account_id"`
	Type          string    `json:"type"` // DEBIT or CREDIT
	Amount        float64   `json:"amount"`
	BalanceAfter  float64   `json:"balance_after"`
	Description   string    `json:"description"`
	CreatedAt     time.Time `json:"created_at"`
}

type LedgerRepository interface {
	GetAccount(userID, currency string) (*Account, error)
	UpdateBalance(accountID string, newBalance, newLocked float64) error
	RecordEntry(entry *LedgerEntry) error
}

type MemoryLedgerRepo struct {
	accounts map[string]*Account
	entries  []*LedgerEntry
}

func NewLedgerRepository() LedgerRepository {
	return &MemoryLedgerRepo{
		accounts: make(map[string]*Account),
		entries:  make([]*LedgerEntry, 0),
	}
}

func (r *MemoryLedgerRepo) GetAccount(userID, currency string) (*Account, error) {
	key := fmt.Sprintf("%s_%s", userID, currency)
	acc, ok := r.accounts[key]
	if !ok {
		acc = &Account{
			ID:            "acc_" + key,
			UserID:        userID,
			Currency:      currency,
			Balance:       10000.00, // Default demo balance
			LockedBalance: 0.0,
		}
		r.accounts[key] = acc
	}
	return acc, nil
}

func (r *MemoryLedgerRepo) UpdateBalance(accountID string, newBalance, newLocked float64) error {
	for _, acc := range r.accounts {
		if acc.ID == accountID {
			acc.Balance = newBalance
			acc.LockedBalance = newLocked
			return nil
		}
	}
	return nil
}

func (r *MemoryLedgerRepo) RecordEntry(entry *LedgerEntry) error {
	r.entries = append(r.entries, entry)
	return nil
}
