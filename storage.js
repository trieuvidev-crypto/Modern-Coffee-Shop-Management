/**
 * storage.js
 * Lớp truy cập LocalStorage duy nhất của toàn hệ thống.
 * Mọi module khác (cart, menu, orders, auth...) PHẢI thao tác dữ liệu
 * thông qua đây, không được gọi localStorage trực tiếp.
 * Thiết kế theo dạng "Repository" để dễ dàng thay thế bằng API thật sau này.
 */

const STORAGE_PREFIX = 'ccs_'; // Coffee Corner System

const Storage = (() => {
  /**
   * Kiểm tra LocalStorage có khả dụng không (Safari private mode, quota...).
   */
  function isAvailable() {
    try {
      const test = '__ccs_test__';
      window.localStorage.setItem(test, '1');
      window.localStorage.removeItem(test);
      return true;
    } catch (err) {
      return false;
    }
  }

  const available = isAvailable();

  function key(name) {
    return `${STORAGE_PREFIX}${name}`;
  }

  /**
   * Đọc dữ liệu, trả về fallback nếu không tồn tại hoặc parse lỗi.
   */
  function get(name, fallback = null) {
    if (!available) return fallback;
    try {
      const raw = window.localStorage.getItem(key(name));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`[Storage] Lỗi đọc "${name}":`, err);
      return fallback;
    }
  }

  /**
   * Ghi dữ liệu. Trả về true/false cho biết có thành công không.
   */
  function set(name, value) {
    if (!available) return false;
    try {
      window.localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[Storage] Lỗi ghi "${name}":`, err);
      return false;
    }
  }

  function remove(name) {
    if (!available) return false;
    window.localStorage.removeItem(key(name));
    return true;
  }

  /**
   * Chỉ khởi tạo dữ liệu mặc định nếu key chưa tồn tại (seed 1 lần).
   */
  function seed(name, defaultValue) {
    if (get(name, undefined) === undefined || get(name, null) === null) {
      set(name, defaultValue);
    }
  }

  /** Thêm 1 item vào mảng lưu trong storage, tự sinh id nếu chưa có */
  function pushItem(name, item) {
    const list = get(name, []);
    list.push(item);
    set(name, list);
    return list;
  }

  /** Cập nhật 1 item theo id trong mảng */
  function updateItem(name, id, patch) {
    const list = get(name, []);
    const idx = list.findIndex((it) => it.id === id);
    if (idx === -1) return list;
    list[idx] = { ...list[idx], ...patch };
    set(name, list);
    return list;
  }

  /** Xoá 1 item theo id trong mảng */
  function removeItem(name, id) {
    const list = get(name, []);
    const filtered = list.filter((it) => it.id !== id);
    set(name, filtered);
    return filtered;
  }

  return { available, get, set, remove, seed, pushItem, updateItem, removeItem, KEYS: {
    THEME: 'theme',
    CART: 'cart',
    FAVORITES: 'favorites',
    MENU: 'menu_items',
    CATEGORIES: 'categories',
    ORDERS: 'orders',
    RESERVATIONS: 'reservations',
    REVIEWS: 'reviews',
    EMPLOYEES: 'employees',
    INVENTORY: 'inventory',
    PROMOTIONS: 'promotions',
    CURRENT_USER: 'current_user',
    USERS: 'users',
    SETTINGS: 'settings',
  }};
})();
