/**
 * back-to-top.js
 * Hiện nút "lên đầu trang" khi cuộn quá 1 màn hình.
 */

const BackToTop = (() => {
  function init() {
    const btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;

    const toggleVisibility = () => {
      btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', BackToTop.init);
