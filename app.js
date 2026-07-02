/**
 * app.js
 * Điểm khởi tạo chung cho mọi trang: seed dữ liệu mặc định vào LocalStorage
 * lần đầu tiên (idempotent — không ghi đè nếu đã tồn tại), cập nhật năm ở footer.
 * Nạp SAU CÙNG khi các file data (*-data.js) và storage.js đã được nạp.
 */

(function bootstrap() {
  if (!Storage.available) {
    console.warn('[App] LocalStorage không khả dụng. Dữ liệu sẽ không được lưu giữa các phiên.');
  }

  // Seed dữ liệu thực đơn / danh mục nếu chưa có
  if (typeof MENU_CATEGORIES_SEED !== 'undefined') {
    Storage.seed(Storage.KEYS.CATEGORIES, MENU_CATEGORIES_SEED);
  }
  if (typeof MENU_ITEMS_SEED !== 'undefined') {
    Storage.seed(Storage.KEYS.MENU, MENU_ITEMS_SEED);
  }

  Storage.seed(Storage.KEYS.CART, []);
  Storage.seed(Storage.KEYS.FAVORITES, []);
  Storage.seed(Storage.KEYS.ORDERS, []);
  Storage.seed(Storage.KEYS.RESERVATIONS, []);
  Storage.seed(Storage.KEYS.REVIEWS, []);
})();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
});
