/**
 * toast.js
 * Hệ thống thông báo dạng toast, dùng chung cho mọi trang.
 * Cách dùng: ToastManager.show({ type: 'success', title: '...', message: '...' })
 */

const ToastManager = (() => {
  let region = null;

  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20 6 9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/></svg>',
  };

  function ensureRegion() {
    if (region) return region;
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
    return region;
  }

  function show({ type = 'default', title = '', message = '', duration = 3800 } = {}) {
    const el = ensureRegion();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.dataset.type = type;

    toast.innerHTML = `
      <span class="toast-icon" style="color: var(--color-${type === 'success' ? 'sage' : type === 'error' ? 'danger' : type === 'info' ? 'info' : 'gold'})">
        ${ICONS[type] || ICONS.default}
      </span>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${Utils.escapeHTML(title)}</div>` : ''}
        ${message ? `<div class="toast-msg">${Utils.escapeHTML(message)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Đóng thông báo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    `;

    const close = () => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 260);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    el.appendChild(toast);

    if (duration > 0) setTimeout(close, duration);
    return { close };
  }

  const success = (message, title = 'Thành công') => show({ type: 'success', title, message });
  const error = (message, title = 'Đã có lỗi') => show({ type: 'error', title, message });
  const info = (message, title = 'Thông báo') => show({ type: 'info', title, message });

  return { show, success, error, info };
})();
