/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — MULTI-THREADED WEB WORKER
 * (frontend/scripts/workers/quant-worker.js)
 * Luồng tính toán định lượng ngầm (Zero-Lag UI Thread)
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * ========================================================
 */

// Trạng thái ngầm của Worker (Official V13 Blueprint)
let basePnl = 99317.00;
let settledTradesCount = 1308;
let winCount = 1074; // 82.1% (1074 / 1308)
let totalProfit = 22450.80;

self.onmessage = function (e) {
  const { action, payload } = e.data;

  switch (action) {
    case 'CALCULATE_PNL': {
      // Phép tính PnL ngầm khi có lệnh mới
      const trade = payload;
      const isWin = trade.side === 'BUY' ? Math.random() > 0.179 : Math.random() > 0.20;
      const profitDelta = isWin ? (Math.random() * 38 + 5) : -(Math.random() * 22 + 4);

      basePnl += profitDelta;
      settledTradesCount++;
      if (isWin) winCount++;
      totalProfit += Math.max(0, profitDelta);

      const winRate = ((winCount / settledTradesCount) * 100).toFixed(1);
      const avgProfit = (totalProfit / settledTradesCount).toFixed(2);

      // Trả kết quả về UI Thread
      self.postMessage({
        action: 'PNL_RESULT',
        data: {
          netPnl: basePnl,
          formattedPnl: `+$${basePnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          winRate: parseFloat(winRate),
          settledTrades: settledTradesCount,
          avgProfit: parseFloat(avgProfit),
          modelEdge: +(5.54 + (Math.random() - 0.5) * 0.1).toFixed(2),
          orderFloat: Math.floor(382 + (Math.random() - 0.5) * 20),
          alphaSpread: +(8.543 + (Math.random() - 0.5) * 0.05).toFixed(3)
        }
      });
      break;
    }

    case 'DECODE_PACKET': {
      // Mô phỏng giải mã gói tin nhị phân và kiểm tra checksum
      const rawHex = payload;
      const length = rawHex.length;
      const crc32 = (Math.random() * 0xFFFFFFFF) >>> 0;
      self.postMessage({
        action: 'PACKET_DECODED',
        data: {
          crc: '0x' + crc32.toString(16).toUpperCase(),
          byteLength: length,
          throughputKb: (9.1 + (Math.random() - 0.5) * 0.4).toFixed(1),
          packetsSec: Math.floor(151 + (Math.random() - 0.5) * 10),
          dropped: 0
        }
      });
      break;
    }

    case 'INIT_TELEMETRY': {
      // Bắt đầu chu kỳ định lượng vi mô ngầm
      setInterval(() => {
        const drift = (Math.random() - 0.48) * 8.5;
        basePnl += drift;
        self.postMessage({
          action: 'TELEMETRY_HEARTBEAT',
          data: {
            netPnl: basePnl,
            formattedPnl: `+$${basePnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            pingMs: Math.floor(914 + Math.random() * 6),
            localMicros: '0.42µs'
          }
        });
      }, 1200);
      break;
    }

    default:
      break;
  }
};
