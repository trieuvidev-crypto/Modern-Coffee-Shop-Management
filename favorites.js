/**
 * favorites.js
 * Module nghiệp vụ danh sách yêu thích, tách khỏi UI như cart.js.
 */

const FavoritesService = (() => {
  function getAll() {
    return Storage.get(Storage.KEYS.FAVORITES, []);
  }

  function save(list) {
    Storage.set(Storage.KEYS.FAVORITES, list);
    window.dispatchEvent(new CustomEvent('ccs:favorites-updated', { detail: { favorites: list } }));
  }

  function isFavorite(menuItemId) {
    return getAll().includes(menuItemId);
  }

  /** Bật/tắt yêu thích, trả về trạng thái mới (true = đã thêm) */
  function toggle(menuItemId) {
    const list = getAll();
    const idx = list.indexOf(menuItemId);
    if (idx === -1) {
      list.push(menuItemId);
      save(list);
      return true;
    }
    list.splice(idx, 1);
    save(list);
    return false;
  }

  return { getAll, isFavorite, toggle };
})();
