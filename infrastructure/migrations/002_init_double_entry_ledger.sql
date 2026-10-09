-- 002: Zero-Loss Financial Ledger & Double-Entry Bookkeeping
-- NO-FLOAT DECIMAL: Strict NUMERIC(20, 8) with Check Constraints

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'VND',
    available_balance NUMERIC(20, 8) DEFAULT 0.00000000, -- Tiền tự do
    locked_balance NUMERIC(20, 8) DEFAULT 0.00000000,    -- Tiền đang treo lệnh/rút
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_currency UNIQUE (user_id, currency),
    CONSTRAINT chk_positive_available CHECK (available_balance >= 0),
    CONSTRAINT chk_positive_locked CHECK (locked_balance >= 0)
);

-- 3. BẢNG NHẬT KÝ SỔ CÁI BẤT BIẾN (AUDIT LEDGER)
CREATE TABLE IF NOT EXISTS ledger_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tx_type VARCHAR(30) NOT NULL,          -- 'DEPOSIT_VIETQR', 'WITHDRAW', 'TRADE_FEE', 'TRANSFER_P2P'
    amount NUMERIC(20, 8) NOT NULL,
    debit_account VARCHAR(50) NOT NULL,
    credit_account VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED', -- 'PENDING', 'COMPLETED', 'REJECTED'
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking VietQR Deposits
CREATE TABLE IF NOT EXISTS vietqr_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    txn_memo VARCHAR(50) UNIQUE NOT NULL, -- e.g. APEX 8839
    amount NUMERIC(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'VND',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'EXPIRED')),
    bank_account_no VARCHAR(50),
    bank_name VARCHAR(50),
    signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Withdrawal Tickets (Requires 2FA & Admin 1-touch approval)
CREATE TABLE IF NOT EXISTS withdrawal_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'VND',
    bank_name VARCHAR(100) NOT NULL,
    bank_account_no VARCHAR(50) NOT NULL,
    bank_account_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PROCESSED')),
    idempotency_key VARCHAR(100) UNIQUE,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_idempotency ON ledger_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_vietqr_memo ON vietqr_deposits(txn_memo);
