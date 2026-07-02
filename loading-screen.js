/**
 * loading-screen.js
 * Hiển thị màn hình loading thương hiệu khi trang vừa tải,
 * ẩn mượt khi window "load" xong (hoặc timeout an toàn tối đa 1.8s
 * để tránh treo màn hình nếu tài nguyên tải chậm).
 */

const LoadingScreen = (() => {
  function hide() {
    const el = document.querySelector('[data-loading-screen]');
    if (!el) return;
    el.classList.add('is-hidden');
    setTimeout(() => el.remove(), 500);
    document.body.classList.remove('is-loading-lock');
  }

  function init() {
    const el = document.querySelector('[data-loading-screen]');
    if (!el) return;
    document.body.classList.add('is-loading-lock');

    const safetyTimer = setTimeout(hide, 1800);
    window.addEventListener('load', () => {
      clearTimeout(safetyTimer);
      setTimeout(hide, 260);
    });
  }

  return { init, hide };
})();

LoadingScreen.init();
