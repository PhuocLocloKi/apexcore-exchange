-- 003: Orders and In-Memory Match Records
-- NO-FLOAT DECIMAL: NUMERIC(20, 8)

-- 4. BẢNG SỔ LỆNH GIAO DỊCH
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,             -- 'BUY', 'SELL'
    order_type VARCHAR(20) NOT NULL,       -- 'MARKET', 'LIMIT', 'STOP_LOSS'
    price NUMERIC(20, 8) NOT NULL,
    quantity NUMERIC(20, 8) NOT NULL,
    filled_quantity NUMERIC(20, 8) DEFAULT 0.00000000,
    status VARCHAR(20) DEFAULT 'OPEN',     -- 'OPEN', 'FILLED', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    buy_order_id UUID NOT NULL REFERENCES orders(id),
    sell_order_id UUID NOT NULL REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    price NUMERIC(20, 8) NOT NULL,
    quantity NUMERIC(20, 8) NOT NULL,
    fee NUMERIC(20, 8) DEFAULT 0.00000000,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Symbols (Tick size, Lot size, Circuit Breaker)
CREATE TABLE IF NOT EXISTS market_symbols (
    symbol VARCHAR(20) PRIMARY KEY,
    base_asset VARCHAR(10) NOT NULL,
    quote_asset VARCHAR(10) NOT NULL,
    reference_price NUMERIC(20, 8) NOT NULL,
    ceiling_price NUMERIC(20, 8) NOT NULL,
    floor_price NUMERIC(20, 8) NOT NULL,
    tick_size NUMERIC(20, 8) NOT NULL,
    lot_size NUMERIC(20, 8) NOT NULL,
    is_halted BOOLEAN DEFAULT FALSE,
    halted_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_symbol_status ON orders(symbol, status);
CREATE INDEX IF NOT EXISTS idx_trades_symbol_time ON trades(symbol, executed_at DESC);
