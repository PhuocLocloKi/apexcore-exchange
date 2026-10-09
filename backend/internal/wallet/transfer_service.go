package wallet

import (
	"errors"
	"fmt"
	"time"
)

type TransferService struct {
	ledgerRepo LedgerRepository
}

func NewTransferService(repo LedgerRepository) *TransferService {
	return &TransferService{ledgerRepo: repo}
}

func (s *TransferService) InternalTransferP2P(senderID, receiverID, currency string, amount float64) error {
	senderAcc, err := s.ledgerRepo.GetAccount(senderID, currency)
	if err != nil {
		return err
	}

	if senderAcc.Balance < amount {
		return errors.New("insufficient balance for internal transfer")
	}

	receiverAcc, err := s.ledgerRepo.GetAccount(receiverID, currency)
	if err != nil {
		return err
	}

	// Update sender balance
	senderNewBalance := senderAcc.Balance - amount
	_ = s.ledgerRepo.UpdateBalance(senderAcc.ID, senderNewBalance, senderAcc.LockedBalance)

	// Update receiver balance
	receiverNewBalance := receiverAcc.Balance + amount
	_ = s.ledgerRepo.UpdateBalance(receiverAcc.ID, receiverNewBalance, receiverAcc.LockedBalance)

	txnID := fmt.Sprintf("p2p_%d", time.Now().UnixNano())

	// Debit entry for sender
	_ = s.ledgerRepo.RecordEntry(&LedgerEntry{
		ID:            fmt.Sprintf("debit_%d", time.Now().UnixNano()),
		TransactionID: txnID,
		AccountID:     senderAcc.ID,
		Type:          "DEBIT",
		Amount:        amount,
		BalanceAfter:  senderNewBalance,
		Description:   fmt.Sprintf("P2P Transfer to %s", receiverID),
		CreatedAt:     time.Now(),
	})

	// Credit entry for receiver
	_ = s.ledgerRepo.RecordEntry(&LedgerEntry{
		ID:            fmt.Sprintf("credit_%d", time.Now().UnixNano()),
		TransactionID: txnID,
		AccountID:     receiverAcc.ID,
		Type:          "CREDIT",
		Amount:        amount,
		BalanceAfter:  receiverNewBalance,
		Description:   fmt.Sprintf("P2P Transfer from %s", senderID),
		CreatedAt:     time.Now(),
	})

	return nil
}
