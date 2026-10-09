-- 001: Initialization of User accounts & Omni-Channel Authentication
-- Supports: Email/Password, Google OAuth, Apple ID, Biometric
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),           -- Nullable if signed up with Google/Apple
    google_id VARCHAR(100) UNIQUE,
    apple_id VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'BOT', 'MASTER_TRADER')),
    two_factor_secret VARCHAR(100),
    is_two_factor_enabled BOOLEAN DEFAULT FALSE,
    biometric_public_key TEXT,            -- For Secure Enclave / KeyStore challenge-response
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id);
