/* ========================================================
   APEXCORE PRO — MARKETS PAGE (js/pages/markets.js)
   MASTER v3.0 — Chợ Tổng Quan Chuẩn Binance Scanner
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { SYMBOLS, getLogo } from '../config.js';

export class MarketsPage {
  constructor(router) {
    this.router = router;
    this.currentFilter = 'all';
    this.searchQuery = '';
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
  }

  unmount() {}

  renderHTML() {
    const hotItems = [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]];
    const gainers = [...SYMBOLS].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
    const topVol = [SYMBOLS[1], SYMBOLS[0], SYMBOLS[3]];
    const newItems = [SYMBOLS[7], SYMBOLS[6], SYMBOLS[3]];

    return `
      <div class="markets-container">
        <!-- 4 Highlight Cards -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:16px;">
          <div class="card-panel" style="margin:0; padding:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="font-size:12px;">🔥 Thị Trường Nóng</strong>
              <span class="text-muted" style="font-size:10px;">24h</span>
            </div>
            ${hotItems.map(i => this.renderMiniRow(i)).join('')}
          </div>

          <div class="card-panel" style="margin:0; padding:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="font-size:12px;">🚀 Top Tăng Giá</strong>
              <span class="text-muted" style="font-size:10px;">24h</span>
            </div>
            ${gainers.map(i => this.renderMiniRow(i)).join('')}
          </div>

          <div class="card-panel" style="margin:0; padding:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="font-size:12px;">💎 Khối Lượng Cao</strong>
              <span class="text-muted" style="font-size:10px;">24h</span>
            </div>
            ${topVol.map(i => this.renderMiniRow(i)).join('')}
          </div>

          <div class="card-panel" style="margin:0; padding:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="font-size:12px;">🆕 Niêm Yết Mới</strong>
              <span class="text-muted" style="font-size:10px;">24h</span>
            </div>
            ${newItems.map(i => this.renderMiniRow(i)).join('')}
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="card-panel" style="padding:0; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border); flex-wrap:wrap; gap:10px;">
            <div style="display:flex; gap:6px;">
              <button class="mfilter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-cat="all">Tất Cả</button>
              <button class="mfilter-btn ${this.currentFilter === 'crypto' ? 'active' : ''}" data-cat="crypto">Crypto</button>
              <button class="mfilter-btn ${this.currentFilter === 'stocks' ? 'active' : ''}" data-cat="stocks">Cổ Phiếu (bStocks)</button>
              <button class="mfilter-btn ${this.currentFilter === 'forex' ? 'active' : ''}" data-cat="forex">Forex & Vàng</button>
            </div>

            <div style="display:flex; align-items:center; gap:6px; background:var(--input-bg); border:1px solid var(--border); border-radius:4px; padding:4px 10px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="markets-table-search" placeholder="Tìm kiếm mã, tên..." style="background:transparent; border:none; outline:none; color:var(--text); font-size:12px; width:180px;">
            </div>
          </div>

          <div id="markets-table-body-container">
            ${this.renderTableContent()}
          </div>
        </div>
      </div>
    `;
  }

  renderMiniRow(item) {
    const isUp = item.change24h >= 0;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; font-size:12px; cursor:pointer;" onclick="window.location.href='trade.html?symbol=${encodeURIComponent(item.symbol)}'">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="asset-vector-logo" style="width:16px; height:16px;">${getLogo(item.symbol)}</span>
          <strong>${item.symbol}</strong>
        </div>
        <div style="display:flex; gap:6px;">
          <span class="num-tabular">$${item.price.toLocaleString('en-US', { minimumFractionDigits: item.precision })}</span>
          <span class="num-tabular ${isUp ? 'text-up' : 'text-down'} font-bold">${isUp ? '+' : ''}${item.change24h}%</span>
        </div>
      </div>
    `;
  }

  renderTableContent() {
    let list = this.currentFilter === 'all' ? SYMBOLS : SYMBOLS.filter(s => s.category === this.currentFilter);
    if (this.searchQuery) {
      list = list.filter(s => s.symbol.toLowerCase().includes(this.searchQuery) || s.name.toLowerCase().includes(this.searchQuery));
    }

    if (list.length === 0) {
      return `<div style="padding:30px; text-align:center; color:var(--text-muted);">Không tìm thấy mã phù hợp với từ khóa "${this.searchQuery}"</div>`;
    }

    return `
      <table class="pro-data-table">
        <thead>
          <tr>
            <th>Mã Tài Sản</th>
            <th>Tên Đầy Đủ</th>
            <th class="text-right">Giá Mới Nhất</th>
            <th class="text-right">Biến Động 24h</th>
            <th class="text-right">Cao Nhất 24h</th>
            <th class="text-right">Thấp Nhất 24h</th>
            <th class="text-right">Khối Lượng 24h</th>
            <th class="text-center">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(item => {
            const isUp = item.change24h >= 0;
            return `
              <tr style="cursor:pointer;" onclick="window.location.href='trade.html?symbol=${encodeURIComponent(item.symbol)}'">
                <td>
                  <div class="table-asset-badge">
                    <span class="asset-vector-logo">${getLogo(item.symbol)}</span>
                    <div>
                      <strong>${item.symbol}</strong>
                      <span class="text-muted" style="font-size:11px;">/${item.quote}</span>
                    </div>
                  </div>
                </td>
                <td class="text-sub">${item.name}</td>
                <td class="text-right num-tabular font-bold">$${item.price.toLocaleString('en-US', { minimumFractionDigits: item.precision })}</td>
                <td class="text-right num-tabular ${isUp ? 'text-up' : 'text-down'} font-bold">${isUp ? '+' : ''}${item.change24h}%</td>
                <td class="text-right num-tabular text-sub">$${item.high24h.toLocaleString('en-US', { minimumFractionDigits: item.precision })}</td>
                <td class="text-right num-tabular text-sub">$${item.low24h.toLocaleString('en-US', { minimumFractionDigits: item.precision })}</td>
                <td class="text-right num-tabular text-sub">${item.volume24h}</td>
                <td class="text-center">
                  <button class="btn-trade-sm" onclick="event.stopPropagation(); window.location.href='trade.html?symbol=${encodeURIComponent(item.symbol)}'">Giao Dịch</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  initEvents() {
    document.querySelectorAll('.mfilter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mfilter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.getAttribute('data-cat') || 'all';
        this.updateTable();
      });
    });

    const searchInput = document.getElementById('markets-table-search');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.updateTable();
    });
  }

  updateTable() {
    const container = document.getElementById('markets-table-body-container');
    if (container) container.innerHTML = this.renderTableContent();
  }
}
