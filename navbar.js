/**
 * navbar.js
 * Điều khiển hành vi navbar: menu mobile, hiệu ứng khi cuộn,
 * đánh dấu link đang active, cập nhật badge giỏ hàng.
 */

const NavbarController = (() => {
  function initScrollEffect(nav) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 12);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu(nav) {
    const toggle = nav.querySelector('[data-nav-toggle]');
    const menu = nav.querySelector('[data-nav-menu]');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  function markActiveLink(nav) {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('[data-nav-menu] a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === current) link.setAttribute('aria-current', 'page');
    });
  }

  function updateCartBadge() {
    const cart = Storage.get(Storage.KEYS.CART, []);
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count > 0 ? String(count) : '';
      el.classList.toggle('is-empty', count === 0);
    });
  }

  function updateFavoritesBadge() {
    const favs = Storage.get(Storage.KEYS.FAVORITES, []);
    document.querySelectorAll('[data-fav-count]').forEach((el) => {
      el.textContent = favs.length > 0 ? String(favs.length) : '';
      el.classList.toggle('is-empty', favs.length === 0);
    });
  }

  function init() {
    const nav = document.querySelector('[data-navbar]');
    if (!nav) return;
    initScrollEffect(nav);
    initMobileMenu(nav);
    markActiveLink(nav);
    updateCartBadge();
    updateFavoritesBadge();

    // Cho phép các module khác (cart.js, favorites.js) gọi lại khi dữ liệu đổi
    window.addEventListener('ccs:cart-updated', updateCartBadge);
    window.addEventListener('ccs:favorites-updated', updateFavoritesBadge);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', NavbarController.init);
