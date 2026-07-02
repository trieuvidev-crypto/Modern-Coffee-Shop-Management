/**
 * utils.js
 * Các hàm tiện ích thuần (pure function), không phụ thuộc DOM cụ thể,
 * dùng lại ở nhiều module khác nhau.
 */

const Utils = (() => {
  /** Định dạng số tiền theo VND */
  function formatCurrency(amount) {
    const value = Number(amount) || 0;
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  }

  /** Định dạng ngày giờ ngắn gọn kiểu Việt Nam */
  function formatDate(isoString, opts = {}) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', ...opts,
    });
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  /** Debounce: trì hoãn thực thi hàm cho tới khi ngừng gọi trong `wait` ms */
  function debounce(fn, wait = 300) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  /** Sinh id duy nhất, không cần thư viện ngoài */
  function generateId(prefix = 'id') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function validatePhone(phone) {
    return /^(0|\+84)[0-9]{9,10}$/.test(String(phone).trim());
  }

  /**
   * Escape HTML để chống XSS khi render dữ liệu người dùng nhập
   * (review, tên khách, ghi chú đặt bàn...) ra DOM bằng innerHTML.
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }

  /** Cắt chuỗi ký tự an toàn, thêm "..." nếu vượt quá độ dài */
  function truncate(str, maxLen = 100) {
    const s = String(str ?? '');
    return s.length > maxLen ? `${s.slice(0, maxLen).trim()}…` : s;
  }

  /** Giới hạn giá trị trong khoảng [min, max] */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /** Chuyển chữ có dấu tiếng Việt thành không dấu để phục vụ search/slug */
  function stripDiacritics(str) {
    return String(str ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase();
  }

  /** Tạo slug từ chuỗi tiếng Việt */
  function slugify(str) {
    return stripDiacritics(str).trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /** Intersection Observer helper dùng cho scroll-reveal, lazy-load... */
  function onIntersect(selector, callback, options = { threshold: 0.15 }) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach((el) => observer.observe(el));
    return observer;
  }

  /** Đếm số tăng dần mượt mà cho Animated Statistics */
  function animateCount(el, target, duration = 1400) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function tick(now) {
      const progress = Utils.clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = start + (target - start) * eased;
      el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toLocaleString('vi-VN');
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add('is-counted');
      }
    }
    requestAnimationFrame(tick);
  }

  return {
    formatCurrency, formatDate, formatTime, debounce, generateId,
    validateEmail, validatePhone, escapeHTML, truncate, clamp,
    stripDiacritics, slugify, onIntersect, animateCount,
  };
})();
