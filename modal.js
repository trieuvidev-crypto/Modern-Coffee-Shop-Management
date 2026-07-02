/**
 * modal.js
 * Hệ thống modal dùng chung. Hỗ trợ cả modal có sẵn trong DOM (data-modal)
 * và modal tạo động bằng ModalManager.open({ title, content, actions }).
 * Có bẫy focus cơ bản + đóng bằng Esc / click overlay để đảm bảo accessibility.
 */

const ModalManager = (() => {
  let activeOverlay = null;
  let lastFocused = null;

  function trapFocus(e) {
    if (!activeOverlay || e.key !== 'Tab') return;
    const focusable = activeOverlay.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    trapFocus(e);
  }

  function close() {
    if (!activeOverlay) return;
    activeOverlay.classList.remove('is-open');
    const overlay = activeOverlay;
    activeOverlay = null;
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.remove();
      if (lastFocused) lastFocused.focus();
    }, 220);
  }

  /**
   * Mở modal động. actions: [{ label, className, onClick }]
   */
  function open({ title = '', content = '', actions = [], onClose = null } = {}) {
    lastFocused = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const actionsHTML = actions.map((a, i) =>
      `<button class="btn ${a.className || 'btn-outline'}" data-action-index="${i}">${Utils.escapeHTML(a.label)}</button>`
    ).join('');

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${Utils.escapeHTML(title)}</h3>
          <button class="modal-close" aria-label="Đóng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">${content}</div>
        ${actions.length ? `<div class="modal-footer flex gap-sm mt-md" style="justify-content:flex-end;">${actionsHTML}</div>` : ''}
      </div>
    `;

    overlay.querySelector('.modal-close').addEventListener('click', () => { close(); if (onClose) onClose(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { close(); if (onClose) onClose(); } });

    actions.forEach((a, i) => {
      const btn = overlay.querySelector(`[data-action-index="${i}"]`);
      btn.addEventListener('click', () => {
        if (a.onClick) a.onClick();
        if (a.closeOnClick !== false) close();
      });
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    activeOverlay = overlay;
    document.addEventListener('keydown', onKeydown);

    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      const firstFocusable = overlay.querySelector('input, button, [tabindex]');
      if (firstFocusable) firstFocusable.focus();
    });

    return { close };
  }

  /** Modal xác nhận nhanh (thay window.confirm) */
  function confirm({ title = 'Xác nhận', message = '', confirmLabel = 'Xác nhận', cancelLabel = 'Huỷ', danger = false } = {}) {
    return new Promise((resolve) => {
      open({
        title,
        content: `<p>${Utils.escapeHTML(message)}</p>`,
        actions: [
          { label: cancelLabel, className: 'btn-ghost', onClick: () => resolve(false) },
          { label: confirmLabel, className: danger ? 'btn-dark' : 'btn-primary', onClick: () => resolve(true) },
        ],
        onClose: () => resolve(false),
      });
    });
  }

  return { open, close, confirm };
})();
