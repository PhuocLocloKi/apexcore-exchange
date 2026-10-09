-- ========================================================
-- APEXCORE SOVEREIGN FINANCIAL SCHEMA (backend/database/schema.sql)
-- Chuẩn Kế Toán Kép Ngân Hàng ACID (ACID Banking Ledger)
-- Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
-- ========================================================

CREATE TABLE IF NOT EXISTS sovereign_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid BIGINT UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES sovereign_users(id),
    currency VARCHAR(20) NOT NULL,
    balance NUMERIC(36, 18) DEFAULT 0.000000000000000000 CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL,
    debit_amount NUMERIC(36, 18) NOT NULL,
    credit_amount NUMERIC(36, 18) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
