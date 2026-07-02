/**
 * home.js
 * Logic riêng cho index.html: render danh sách "Best Seller" từ dữ liệu LocalStorage,
 * kích hoạt animated statistics khi cuộn tới, gắn sự kiện thêm giỏ hàng / yêu thích.
 */

const HomePage = (() => {
  const ICON_STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  const ICON_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';

  function renderStars(rating) {
    return `${ICON_STAR}<span>${rating.toFixed(1)}</span>`;
  }

  function menuCardTemplate(item) {
    const isFav = FavoritesService.isFavorite(item.id);
    const badges = item.tags.includes('best-seller')
      ? '<span class="badge badge-gold">Bán chạy</span>'
      : item.tags.includes('new')
        ? '<span class="badge badge-sage">Mới</span>'
        : '';

    return `
      <article class="card card--hover menu-card" data-reveal>
        <div class="menu-card-media">
          <img src="${item.image}" alt="${Utils.escapeHTML(item.name)}" loading="lazy" width="400" height="300">
          <div class="menu-card-badges">${badges}</div>
          <button class="menu-card-fav" data-fav-btn="${item.id}" aria-pressed="${isFav}" aria-label="Thêm vào yêu thích">
            ${ICON_HEART}
          </button>
        </div>
        <div class="menu-card-body">
          <div class="flex justify-between items-center">
            <h4>${Utils.escapeHTML(item.name)}</h4>
          </div>
          <div class="menu-card-rating">${renderStars(item.rating)}<span>(${item.reviewCount})</span></div>
          <p class="menu-card-desc">${Utils.escapeHTML(Utils.truncate(item.description, 78))}</p>
          ${item.roast ? `<div class="roast-line" data-roast="${item.roast}" style="margin-top:2px;"></div>` : ''}
          <div class="menu-card-footer">
            <span class="menu-card-price">${Utils.formatCurrency(item.price)}</span>
            <button class="menu-card-add" data-add-btn="${item.id}" aria-label="Thêm ${Utils.escapeHTML(item.name)} vào giỏ hàng">
              ${ICON_PLUS}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const mount = document.querySelector('[data-featured-menu]');
    if (!mount) return;

    const allItems = Storage.get(Storage.KEYS.MENU, []);
    const featured = allItems.filter((it) => it.tags.includes('best-seller')).slice(0, 6);
    const list = featured.length ? featured : allItems.slice(0, 6);

    if (!list.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <p>Chưa có sản phẩm nào trong thực đơn.</p>
        </div>`;
      return;
    }

    mount.innerHTML = list.map(menuCardTemplate).join('');
    bindCardEvents(mount, list);
  }

  function bindCardEvents(mount, items) {
    mount.querySelectorAll('[data-add-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = items.find((it) => it.id === btn.dataset.addBtn);
        if (!item) return;
        CartService.add(item, 1);
        ToastManager.success(`Đã thêm "${item.name}" vào giỏ hàng.`, 'Thêm thành công');
      });
    });

    mount.querySelectorAll('[data-fav-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isNowFav = FavoritesService.toggle(btn.dataset.favBtn);
        btn.setAttribute('aria-pressed', String(isNowFav));
        ToastManager.info(isNowFav ? 'Đã thêm vào yêu thích.' : 'Đã bỏ khỏi yêu thích.');
      });
    });
  }

  function initAnimatedStats() {
    const statsEls = document.querySelectorAll('[data-stat-target]');
    if (!statsEls.length) return;
    Utils.onIntersect('.stats-band', () => {
      statsEls.forEach((el) => {
        const target = Number(el.dataset.statTarget);
        Utils.animateCount(el, target);
      });
    }, { threshold: 0.4 });
  }

  function init() {
    renderFeatured();
    initAnimatedStats();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', HomePage.init);
