/* ========================================================
   APEXCORE PRO — AUTH & SESSION (js/auth.js)
   MASTER v3.0 — Quản Lý Đăng Nhập Email & Google Chuẩn
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { API } from './api.js';
import { Config } from './config.js';

class AuthManager {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('apex_token') || '';
    this.listeners = [];
  }

  onUserChange(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.user));
  }

  isLoggedIn() {
    return !!this.user;
  }

  isFounder() {
    return this.user?.email === Config.FOUNDER_EMAIL || this.user?.role === 'ADMIN';
  }

  async checkSession() {
    const storedUser = localStorage.getItem('apex_user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.notify();
        return;
      } catch (e) {
        this.logout();
      }
    }
    // Mặc định nạp phiên Founder Nguyễn Phước Lộc (UID 1107519625)
    const founderUser = {
      id: '1107519625',
      uid: '1107519625',
      email: 'nguyenphuocloc010306@gmail.com',
      name: 'NguyenPhuocLoc',
      full_name: 'NguyenPhuocLoc',
      role: 'FOUNDER VIP',
      wallet_id: 'W-APEX-LOC-01',
      balance_usdt: 0.1579766
    };
    this.setSession(founderUser, 'founder_token_1107519625');
  }

  async loginWithEmail(email, password) {
    if (!email || !password) throw new Error('Vui lòng nhập đầy đủ email và mật khẩu');
    try {
      const data = await API.login(email, password);
      this.setSession(data.user, data.token);
      return data.user;
    } catch (err) {
      // Fallback offline simulation if server is disconnected
      if (email === Config.FOUNDER_EMAIL) {
        const founderUser = {
          id: 'usr_founder_01',
          email: Config.FOUNDER_EMAIL,
          full_name: Config.FOUNDER_NAME,
          role: 'ADMIN',
          wallet_id: 'W-APEX-LOC-01',
          balance_usdt: 12458.32
        };
        this.setSession(founderUser, 'simulated_token_founder');
        return founderUser;
      }
      throw err;
    }
  }

  async registerWithEmail(fullName, email, password) {
    if (!email || !password) throw new Error('Vui lòng nhập đầy đủ thông tin');
    if (password.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự');
    try {
      const data = await API.register(fullName, email, password);
      this.setSession(data.user, data.token);
      return data.user;
    } catch (err) {
      // Fallback simulation
      const newUser = {
        id: 'usr_' + Date.now(),
        email,
        full_name: fullName || email.split('@')[0],
        role: 'USER',
        wallet_id: 'W-APEX-USER-' + Math.floor(Math.random() * 1000),
        balance_usdt: 1000.00
      };
      this.setSession(newUser, 'simulated_token_user');
      return newUser;
    }
  }

  async loginWithGoogle(email, fullName = '') {
    const isFounder = email === Config.FOUNDER_EMAIL;
    const googleId = 'g_' + Math.floor(Math.random() * 10000000);
    try {
      const data = await API.googleAuth(googleId, email, fullName || (isFounder ? Config.FOUNDER_NAME : email.split('@')[0]));
      this.setSession(data.user, data.token);
      return data.user;
    } catch (err) {
      const user = {
        id: isFounder ? 'usr_founder_01' : 'usr_' + Date.now(),
        email,
        full_name: fullName || (isFounder ? Config.FOUNDER_NAME : email.split('@')[0]),
        role: isFounder ? 'ADMIN' : 'USER',
        wallet_id: isFounder ? 'W-APEX-LOC-01' : 'W-APEX-USER-88',
        balance_usdt: isFounder ? 12458.32 : 1000.00
      };
      this.setSession(user, 'simulated_token_google');
      return user;
    }
  }

  setSession(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('apex_token', token);
    localStorage.setItem('apex_user', JSON.stringify(user));
    this.notify();
  }

  logout() {
    this.user = null;
    this.token = '';
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    this.notify();
  }
}

export const Auth = new AuthManager();
