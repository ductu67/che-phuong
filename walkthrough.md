# Sổ tay Kỹ Thuật (Developer Walkthrough) - Chè Phương Website

Tài liệu này giải thích cách hoạt động cũng như hành trình Tái cấu trúc "Đại Tu" (Refactoring) của dự án. 

---

## 1. Hành Trình Tối Ưu Hóa (The Refactoring Journey)

Dự án ban đầu là một khối (Monolith) khổng lồ chứa hàng nghìn dòng mã HTML/CSS/JS. Việc tối ưu hóa trải qua các giai đoạn cực kỳ chuyên sâu nhằm đẩy dự án lên đẳng cấp doanh nghiệp:

1.  **Tách nhỏ Giao Diện (Vite HTML Partials):** File `index.html` được tách thành 12 Module (như `navbar.html`, `hero.html`...) nhờ một Plugin cực nhẹ do AntiGravity AI tự viết bằng regex trong `vite.config.js`. Hệ thống giữ trọn 100% sức mạnh SEO vì kết quả đầu ra là thuần HTML.
2.  **Chia rẽ Logic (JS Modules & TypeScript):** File `main.js` "mập mạp" đã trở thành điểm dẫn (Entry) cho 4 trụ cột `.ts` chính: `core`, `cart`, `ui`, `pwa`.
3.  **Triết Lý Single Source of Truth:** Code được gột sạch các khối dữ liệu "vứt lung tung". Toàn bộ tên món, giá, ảnh được tập trung tại `src/js/data.ts`. Ngay khi bấm một thẻ, mọi thông tin sẽ lấy từ kho này qua thuộc tính thông minh `data-id`.

---

## 2. Bí Ẩn Về Quản Lý Trạng Thái (State Management)

### Giỏ Hàng (`cart.ts`)
*   **Vòng đời mua sắm:** 
    1. Khi tải trang, tệp `main.ts` ưu tiên chạy trước để hiển thị số đếm giỏ hàng từ `localStorage`.
    2. File `cart.ts` được hoãn tải qua `requestIdleCallback` (Chờ trang nghỉ ngơi mới lú ra).
    3. Khi cần mua nhanh các cụm "Combo", trình quản lý Toppings sẽ tự động tàng hình, làm sạch mọi dữ liệu thừa thãi bị nhét ngầm.
*   **Hoạt Ảnh (Canvas Confetti):** Hàm DOM Ảo nặng nề trước đây đã chết! Hiện nay `confetti()` render cực nhẹ ở góc màn hình. Cùng với đó là API mới toanh của trình duyệt: `document.startViewTransition()` đóng/mở Box thần tốc.
*   **A11Y (Khả Năng Truy Cập):** Modals được giám sát bằng một bộ bắt sự kiện của phím tắt **Escape (Esc)**.

### Giao Diện Màu Sắc (Dark Mode)
*   Chống nháy hình (FOUC) 100% nhờ việc bơm thằng thẻ `script` chặn lên trên cùng của thẻ `<head>`.
*   `html.dark-mode` là thứ duy nhất ra lệnh chuyển đổi các "biến màu Vanilla CSS" `--bg-color` bên trong tệp `variables.css`. Hệ thống gọn nhẹ không vướng víu thư viện Tailwind/Bootstrap cồng kềnh.

---

## 3. Kiến trúc Đề Xuất (Roadmap Khởi Nghiệp Bậc Cao)

Các tính năng mũi nhọn doanh nghiệp đang chờ được lên kệ tiếp theo:

### Giai Đoạn A: Nguồn Dữ Liệu Rời (Headless CMS & Tracking)
- Tách `data.ts` thành dữ liệu lấy từ xa, kết nối với **Google Sheets API** / **Supabase**. Cửa hàng có thể điều chỉnh giá mà không cần Developer.
- Gắn **Meta Pixel/GTM** chạy ngầm dưới **Partytown Worker**, phân loại số lượng người bỏ giỏ, nhặt giỏ, tính toán Ads cực mạnh.

### Giai Đoạn B: Zalo Cuckoo/ Telegram Webhook
Thay vì lệnh copy mã đơn bế tắc, API sẽ truyền dữ liệu thanh toán đến Telegram hoặc tin nhắn tự động. Kịch bản:
- Anh Phương nhận Messenger báo `DING: Đơn mới! 2 Chè Sầu, 1 Chè Bưởi`. Khách khỏi cần soạn text.

### Giai Đoạn C: Chuyển Hệ Astro.js & Testing
- Nâng hệ sinh thái Tĩnh SSG siêu tối ưu (Astro framework) để kết tinh hoàn toàn tính năng Vite hiện tại. Tích hợp Playwright kiểm định mã nguồn E2E mỗi lần nâng cấp.
