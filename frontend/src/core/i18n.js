/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIV: BỘ QUẢN LÝ ĐA NGÔN NGỮ QUỐC TẾ (VI, EN, ZH, JA)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

import viTranslations from '../locales/vi.json' with { type: 'json' } catch { viTranslations: null };

export class I18nManager {
  constructor(defaultLocale = 'vi') {
    this.currentLocale = localStorage.getItem('apex_locale') || defaultLocale;
    this.locales = {
      vi: null,
      en: null,
      zh: null,
      ja: null
    };
    this.listeners = new Set();
  }

  async loadLocale(locale) {
    if (this.locales[locale]) return this.locales[locale];
    try {
      const response = await fetch(`./src/locales/${locale}.json`);
      if (response.ok) {
        this.locales[locale] = await response.json();
        return this.locales[locale];
      }
    } catch (e) {
      console.warn(`[i18n] Fallback to inline translations for ${locale}:`, e);
    }
    return null;
  }

  async setLocale(locale) {
    if (!['vi', 'en', 'zh', 'ja'].includes(locale)) return;
    this.currentLocale = locale;
    localStorage.setItem('apex_locale', locale);
    await this.loadLocale(locale);
    this.notify();
  }

  t(key, fallback = '') {
    const dict = this.locales[this.currentLocale] || {};
    return dict[key] || fallback || key;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.currentLocale));
  }
}

export const i18n = new I18nManager();
