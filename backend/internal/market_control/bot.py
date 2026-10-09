# ========================================================
# APEXCORE SOVEREIGN AI MARKET MAKER BOT (PYTHON QUANT)
# File: backend/internal/market_control/bot.py
# Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
# ========================================================

import time
import math
import random

class SovereignMarketMaker:
    def __init__(self, symbol="BTC/USDT", base_price=85450.00):
        self.symbol = symbol
        self.current_price = base_price
        self.spread_bps = 5  # 5 bps spread (0.05%)
        self.is_active = True

    def calculate_optimal_quotes(self):
        """Tính toán bước giá tối ưu Bid / Ask giữ spread siêu hẹp"""
        half_spread = self.current_price * (self.spread_bps / 10000.0) / 2.0
        bid_price = round(self.current_price - half_spread, 2)
        ask_price = round(self.current_price + half_spread, 2)
        bid_vol = round(random.uniform(0.1, 1.5), 4)
        ask_vol = round(random.uniform(0.1, 1.5), 4)
        return {
            "symbol": self.symbol,
            "bid": bid_price,
            "ask": ask_price,
            "bid_vol": bid_vol,
            "ask_vol": ask_vol,
            "timestamp": int(time.time() * 1000)
        }

    def generate_natural_tick(self):
        """Mô phỏng bước giá Ornstein-Uhlenbeck giữ nến mượt mà"""
        # Mean-reverting drift
        drift = -0.05 * (self.current_price - 85450.00)
        shock = random.gauss(0, 4.0)
        self.current_price = round(self.current_price + drift + shock, 2)
        return self.current_price

if __name__ == "__main__":
    bot = SovereignMarketMaker()
    print("🐍 APEXCORE PYTHON QUANT MARKET MAKER ACTIVATED")
    print("👑 Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)")
    for _ in range(5):
        quotes = bot.calculate_optimal_quotes()
        print(f"[{quotes['symbol']}] Bid: {quotes['bid']} ({quotes['bid_vol']}) | Ask: {quotes['ask']} ({quotes['ask_vol']})")
        bot.generate_natural_tick()
        time.sleep(0.5)
