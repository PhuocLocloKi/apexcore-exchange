/* ========================================================
   APEXCORE PRO — API CLIENT (js/api.js)
   MASTER v3.0 — Xử Lý Gọi Mạng Tập Trung & Quản Lý Lỗi Chuẩn
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { Config } from './config.js';

class ApiClient {
  constructor() {
    this.baseUrl = Config.API_BASE;
  }

  getToken() {
    return localStorage.getItem('apex_token') || '';
  }

  getHeaders(isAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (isAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try { data = JSON.parse(text); } catch(e) { data = { status: text }; }
      }

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.error || 'Lỗi xử lý yêu cầu từ máy chủ';
        throw new Error(errMsg);
      }

      return data;
    } catch (err) {
      // Return structured fallback
      throw err;
    }
  }

  // Auth APIs
  async register(fullName, email, password) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password })
    });
  }

  async login(email, password) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async googleAuth(googleId, email, fullName) {
    return this.request('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify({ google_id: googleId, email, full_name: fullName })
    });
  }

  async getMe() {
    return this.request('/api/v1/auth/me');
  }

  // Market & Trading APIs
  async getSymbols() {
    return this.request('/api/v1/market/symbols');
  }

  async getTicker(symbol) {
    return this.request(`/api/v1/market/ticker/${symbol}`);
  }

  async getOrderbook(symbol) {
    return this.request(`/api/v1/market/orderbook/${symbol}`);
  }

  async getCandles(symbol, tf = '15m') {
    return this.request(`/api/v1/market/candles/${symbol}?tf=${tf}`);
  }

  async getTrades(symbol) {
    return this.request(`/api/v1/market/trades/${symbol}`);
  }

  async placeOrder(orderData) {
    return this.request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Admin APIs
  async getAdminUsers() {
    return this.request('/api/v1/admin/users');
  }

  async banUser(userId) {
    return this.request(`/api/v1/admin/users/${userId}/ban`, {
      method: 'POST'
    });
  }

  async setPrice(symbol, price) {
    return this.request('/api/v1/admin/price/set', {
      method: 'POST',
      body: JSON.stringify({ symbol, price })
    });
  }

  async toggleBot(running) {
    return this.request('/api/v1/admin/bot/toggle', {
      method: 'POST',
      body: JSON.stringify({ running })
    });
  }
}

export const API = new ApiClient();
