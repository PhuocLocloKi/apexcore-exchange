-- 004: Real-time Market OHLCV Candles
CREATE TABLE IF NOT EXISTS market_candles (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    resolution VARCHAR(5) NOT NULL, -- 1s, 1m, 5m, 15m, 1h, 1d
    open_price NUMERIC(36, 18) NOT NULL,
    high_price NUMERIC(36, 18) NOT NULL,
    low_price NUMERIC(36, 18) NOT NULL,
    close_price NUMERIC(36, 18) NOT NULL,
    volume NUMERIC(36, 18) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT unique_symbol_resolution_time UNIQUE (symbol, resolution, timestamp)
);

CREATE INDEX idx_candles_lookup ON market_candles(symbol, resolution, timestamp DESC);
