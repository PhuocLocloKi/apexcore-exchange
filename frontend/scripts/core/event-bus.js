/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — CENTRAL EVENT BUS
 * (frontend/scripts/core/event-bus.js)
 * Trạm trung chuyển dữ liệu chống xung đột (Zero-Duplication Event Bus)
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * ========================================================
 */

(function () {
  'use strict';

  // Chống redeclare nếu đã nạp trước đó
  if (window.ApexEventBus) {
    return;
  }

  class SovereignEventBus {
    constructor() {
      this.listeners = new Map();
      this.history = [];
      this.maxHistory = 100;
    }

    /**
     * Đăng ký lắng nghe sự kiện
     * @param {string} eventName Tên sự kiện
     * @param {Function} callback Hàm phản hồi
     * @returns {Function} Hàm hủy đăng ký
     */
    on(eventName, callback) {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
      this.listeners.get(eventName).add(callback);
      return () => this.off(eventName, callback);
    }

    /**
     * Hủy đăng ký lắng nghe
     * @param {string} eventName
     * @param {Function} callback
     */
    off(eventName, callback) {
      if (this.listeners.has(eventName)) {
        this.listeners.get(eventName).delete(callback);
      }
    }

    /**
     * Phát tán sự kiện tới toàn bộ phân khu
     * @param {string} eventName
     * @param {any} data
     */
    emit(eventName, data) {
      const payload = {
        event: eventName,
        data: data,
        time: performance.now()
      };

      if (this.listeners.has(eventName)) {
        this.listeners.get(eventName).forEach(cb => {
          try {
            cb(data);
          } catch (err) {
            console.error(`[EventBus] Lỗi xử lý ${eventName}:`, err);
          }
        });
      }
    }

    /**
     * Lắng nghe 1 lần duy nhất
     * @param {string} eventName
     * @param {Function} callback
     */
    once(eventName, callback) {
      const handler = (data) => {
        this.off(eventName, handler);
        callback(data);
      };
      this.on(eventName, handler);
    }
  }

  // Khai báo duy nhất trên Window
  window.ApexEventBus = new SovereignEventBus();

  // Định nghĩa danh mục sự kiện chuẩn
  window.ApexEvents = Object.freeze({
    TRADE_EXECUTED: 'TRADE_EXECUTED',
    PRICE_TICK: 'PRICE_TICK',
    TELEMETRY_UPDATED: 'TELEMETRY_UPDATED',
    MODE_CHANGED: 'MODE_CHANGED',         // 'GOD' | 'ECO'
    HOTKEY_ACTION: 'HOTKEY_ACTION',       // 'B', 'S', 'Space', 'Esc'
    HAPTIC_AUDIO: 'HAPTIC_AUDIO',         // 'CLICK', 'CHIME'
    WORKER_PNL_UPDATE: 'WORKER_PNL_UPDATE'
  });
})();
