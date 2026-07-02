/**
 * cart.js
 * Module nghiệp vụ giỏ hàng — tách biệt hoàn toàn khỏi UI (không thao tác DOM ở đây,
 * trừ việc phát custom event để các trang tự render UI theo ý mình).
 */

const CartService = (() => {
  function getAll() {
    return Storage.get(Storage.KEYS.CART, []);
  }

  function save(cart) {
    Storage.set(Storage.KEYS.CART, cart);
    window.dispatchEvent(new CustomEvent('ccs:cart-updated', { detail: { cart } }));
  }

  /** Thêm sản phẩm vào giỏ. Nếu đã tồn tại (cùng id + note) thì tăng số lượng. */
  function add(menuItem, qty = 1, note = '') {
    const cart = getAll();
    const existing = cart.find((it) => it.menuItemId === menuItem.id && it.note === note);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: Utils.generateId('cartitem'),
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        qty,
        note,
      });
    }
    save(cart);
    return cart;
  }

  function updateQty(cartItemId, qty) {
    const cart = getAll();
    const item = cart.find((it) => it.id === cartItemId);
    if (!item) return cart;
    item.qty = Utils.clamp(qty, 1, 99);
    save(cart);
    return cart;
  }

  function remove(cartItemId) {
    const cart = getAll().filter((it) => it.id !== cartItemId);
    save(cart);
    return cart;
  }

  function clear() {
    save([]);
  }

  function getCount() {
    return getAll().reduce((sum, it) => sum + it.qty, 0);
  }

  function getSubtotal() {
    return getAll().reduce((sum, it) => sum + it.qty * it.price, 0);
  }

  return { getAll, add, updateQty, remove, clear, getCount, getSubtotal };
})();
