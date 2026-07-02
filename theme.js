/**
 * theme.js
 * Quản lý chuyển đổi Dark/Light mode.
 * Ưu tiên: preference đã lưu > prefers-color-scheme hệ thống > light (mặc định).
 */

const ThemeManager = (() => {
  const ATTR = 'data-theme';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getCurrent() {
    return document.documentElement.getAttribute(ATTR) || 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute(ATTR, theme);
    updateToggleIcons(theme);
    updateMetaThemeColor(theme);
  }

  function updateMetaThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#2B1B14' : '#F7F1E6');
  }

  function updateToggleIcons(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    });
  }

  function toggle() {
    const next = getCurrent() === 'dark' ? 'light' : 'dark';
    apply(next);
    Storage.set(Storage.KEYS.THEME, next);
  }

  function init() {
    const saved = Storage.get(Storage.KEYS.THEME, null);
    const theme = saved || getSystemPreference();
    apply(theme);

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggle);
    });

    // Đồng bộ nếu hệ thống đổi theme mà user chưa từng chọn thủ công
    if (!saved && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!Storage.get(Storage.KEYS.THEME, null)) {
          apply(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  return { init, toggle, getCurrent, apply };
})();

document.addEventListener('DOMContentLoaded', ThemeManager.init);
