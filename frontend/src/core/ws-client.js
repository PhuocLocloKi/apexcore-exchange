/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIV: QUẢN LÝ LUỒNG DỮ LIỆU WEBSOCKET 50 CẶP COIN 60 FPS
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class SovereignWsClient {
  constructor(endpoint = 'ws://localhost:8080/ws/market') {
    this.endpoint = endpoint;
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 2000;
    this.subscribers = new Map();
    this.simulated = true; // Auto-fallback if local backend WS is closed
    this.simInterval = null;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.endpoint);
      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.simulated = false;
        if (this.simInterval) clearInterval(this.simInterval);
        console.log('[ApexCore WS] Quantum Telemetry Stream Connected.');
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.dispatch(payload);
        } catch (e) {
          console.error('[ApexCore WS] Parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.handleFallbackSimulation();
        this.attemptReconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      this.handleFallbackSimulation();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  handleFallbackSimulation() {
    if (this.simInterval) return;
    this.simulated = true;
    this.simInterval = setInterval(() => {
      const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'NVDAB'];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const delta = (Math.random() - 0.49) * 0.003;
      this.dispatch({
        type: 'ticker',
        symbol: sym,
        delta: delta,
        timestamp: Date.now()
      });
    }, 16); // 60 FPS update frequency
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic).add(callback);
    return () => this.subscribers.get(topic)?.delete(callback);
  }

  dispatch(data) {
    const topic = data.type || 'ticker';
    this.subscribers.get(topic)?.forEach(cb => cb(data));
    this.subscribers.get('*')?.forEach(cb => cb(data));
  }

  disconnect() {
    if (this.simInterval) clearInterval(this.simInterval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new SovereignWsClient();
