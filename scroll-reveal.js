/**
 * scroll-reveal.js
 * Kích hoạt hiệu ứng xuất hiện khi cuộn tới phần tử có [data-reveal].
 * Hỗ trợ stagger qua [data-reveal-group] (tự gán --i cho từng con).
 */

const ScrollReveal = (() => {
  function init() {
    document.querySelectorAll('[data-reveal-group]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--i', i);
        if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
      });
    });

    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => observer.observe(el));
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ScrollReveal.init);
