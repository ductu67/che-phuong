# Tiệm Chè Phương - Hệ Sinh Thái Kỹ Thuật Số Cao Cấp 🍧

Dự án này là phiên bản số hóa của "Tiệm Chè Phương", một tiệm chè/đồ uống mang phong cách vỉa hè nhưng được bọc dưới lớp vỏ Kiến Trúc Kỹ Thuật chuyên sâu cấp Doanh Nghiệp (Enterprise-level Architecture).

Bề ngoài, nó là một trang web giới thiệu kết hợp Giỏ hàng tĩnh (Static Cart Flow), với giao diện Tối giản (Minimalist), hệ thống màu Pastel thư giãn.
Bên trong, đây là một hệ sinh thái SIÊU TỐC ĐỘ, được kiểm soát chặt chẽ bằng nguyên lý (Single Page - Multiple Modules), tách biệt triệt để Logic và Giao diện.

---

## 🏗 Đặc Trưng Kiến Trúc Kỹ Thuật Hiện Tại (Core Architecture)

Khác với các Website thông thường tải hàng vạn dòng HTML/CSS vào 1 file, hệ thống Chè Phương sở hữu các đặc trưng hiếm thấy:

1. **Vite HTML Partials Injection:**
   - Hệ thống không dùng thư viện React/Vue nặng nề, mà tự rã file `index.html` khổng lồ thành 12 module tí hon (`src/html/navbar.html`, `src/html/hero.html`...).
   - Plugin nội bộ `htmlPartials()` tự động "hấp thụ" và ráp nối các mảnh HTML này ngay trước khi gửi cho Trình duyệt. **Hiệu suất SEO 100% vì nội dung mã hóa dưới dạng Thuần tĩnh (SSR - Server Side Rendered behavior).**
2. **Hệ Ngôn Ngữ Chặt Chẽ (TypeScript Ecosystem):**
   - Sự rườm rà của Vanilla JS đã bị "tiêu diệt". Mọi thứ chuyển qua `.ts` (TypeScript). 
   - Dữ liệu Database Cứng (Tên món, Giá, Phân loại) được rút hết vào `src/js/data.ts`. File này đóng vai trò là "Single Source of Truth", khiến việc sửa thông tin món trên Web không bao giờ chạm đến thẻ HTML.
3. **Phân Luồng Tải Ngầm (requestIdleCallback Lazy Loading):**
   - Trải nghiệm tốc độ tải lần đầu gần như là bằng con số KHÔNG. Tệp khởi động `main.ts` chỉ thực thi 2 lõi siêu nhẹ `core.ts` và `pwa.ts`.
   - Các logic biểu diễn hình múa may, tính toán số tiền trong giỏ hàng (`cart.ts` và `ui.ts`) bị hoãn tải cho đến khi Cỗ máy trình duyệt "được nghỉ ngơi" hoặc người dùng rê chuột qua.
4. **Hệ Thống Phối Thể Dark Mode chống chớp nháy (Zero-FOUC):**
   - Ánh chớp trắng chói mắt bị ngắt nhịp khi Load trang vào ban đêm. Đoạn Script tiêm ngay trên tót đỉnh `<head>` thiết đặt `html.dark-mode` ngay trong Mili-giây đầu tiên.
5. **Đồ Họa & Vi Hoạt Ảnh (Micro-Interactions):**
   - Thay vì lạm dụng Modal bằng HTML, chúng tôi bọc nó bằng API tương lai `document.startViewTransition()`. Khung popup hiện ra như trồi lên từ không gian 3 chiều.
   - Các Font chữ "Playfair" & "Quicksand" được giam lỏng hoàn toàn trong Local `npm` package (`@fontsource`), không lệ thuộc hay bị trễ mạng ping từ hệ thống Google Fonts. Pháo hoa Particle siêu xịn nén bằng module (`canvas-confetti`). 

---

## ⚙️ Hướng Dẫn Cài Đặt (Local Development)

Dự án yêu cầu máy tính cài đặt sẵn **Node.js (phiên bản 18 trở lên)**.

```bash
# 1. Clone Source Code về máy
git clone https://github.com/ductu67/che-phuong.git
cd che-phuong

# 2. Cài đặt các gói thư viện (NPM dependencies)
npm install

# 3. Chạy Server ở chế độ Phát Triển (Tự động tải lại trang khi lưu)
npm run dev

# 4. Biên dịch và nén Code siêu cấp (Tạo bản Production đẩy lên Vercel/Hosting)
npm run build

# 5. Xem trước bản Production sau khi nén
npm run preview
```

---

## 📂 Sơ Đồ Khối Nguồn (Folder Tree)

Dưới đây là một nửa kho tàng, cách các tệp được phân ngôi:

```text
che-phuong/
├── public/                # Băng chuyền Tài nguyên Tĩnh (Robot.txt, sitemap.xml, Ảnh AI)
├── scripts/               # Chứa các Node Engine Scripts tối ưu hình ảnh, migrate-to-ts
├── src/
│   ├── html/              # Khu vực Lưới UI (Chẻ HTML ra thành từng đốt nhỏ)
│   ├── js/                
│   │   ├── core.ts        # Tim mạch: Điều hướng Theme, Thanh cuộn, SEO JSON-LD injection.
│   │   ├── cart.ts        # Giao thương: Logic thêm/xóa Topping đồ uống, Tính tổng.
│   │   ├── ui.ts          # Thẩm mỹ viện: Sinh Bong bóng bay, Khai pháo tự động.
│   │   ├── pwa.ts         # Ngoại tuyến: Đăng ký Service Worker tải mọi thứ vào Offline.
│   │   └── data.ts        # Bộ Não: API Cứng chứa Danh sách hàng quán.
│   └── styles/            # Lò đào tạo CSS tách phân tách.
├── index.html             # Bản phác thảo kết tinh UI cho Vite nuốt.
├── main.ts                # Bộ điều hành trung tâm.
└── vite.config.js         # Nhà máy đóng gói, thanh lọc rác mã CSS (PurgeCSS, PWA, Partials).
```

---

## 🚀 Tính Năng Kinh Doanh Đang Hoạt Động (Business Features)

1. **Cỗ Máy Bán Hàng 1 Chạm:** Bất kỳ khách nào điền giỏ xong, Bảng Đơn Điện Tử sẽ soạn nguyên một kịch bản đơn hàng (Ví dụ: "Mình đặt 2 chè thập cẩm, 1 trà chanh quất, không lấy thạch") gài sát vào Clipboard rồi phóng thẳng qua Messenger hoặc Zalo App của Quán bằng 1 phím nhấn.
2. **Lưu Vết Cục Bộ (Cart Locality):** Khách lỡ tay tắt trang web? Vài tiếng sau Quay lại, mọi thứ trong Giỏ hàng vẫn lỳ lợm đứng yên chờ họ ở đó.
3. **Danh Sách Hạt Topping Rời:** Khách mua "Sữa Chua Chanh Leo", bảng tính giá lập tức sổ ra Topping tương ứng. Nhưng mua Combo đó bị chặn (tùy cài đặt `data.ts`).
4. **App Cấp 3 (PWA Offline):** Trên iOS Safari hoặc Android Chrome, Khách có thể Tải thẳng Tiệm chè ra ngoài màn hình chính. Nó biến thành 1 ỨNG DỤNG thuần chay, hoạt động kể cả khi điện thoại tắt 3G/Mạng. Giúp chủ quán tiết kiệm 50 triệu tiền thuê App Developer hằng năm.

---

## 🔮 Đề Xuất Phát Triển Bản 2.0 (Phase 2 Roadmap)
Những tối ưu kỹ thuật cuối cùng đã hoàn tất, dưới đây là đề xuất leo dần lên App Bán Hàng Số 1 Khu Vực Bắc Ninh:

1. **Tự Động Hóa Quét Khách:** Cắm Tracking Meta Pixel giấu kín trong Worker. Khi khách tắt Tab Giỏ hàng ở giây cuối do chần chừ, thuật toán sẽ theo dõi bắt lấy thiết bị và "Bắn quảng cáo dội bom" món ăn đó lên tường Facebook người ấy một tiếng sau.
2. **Cánh Cửa Không Biên Giới (i18n):** Phát triển một gạt nút chuyển "KOREA / ENGLISH / VN" tức thì, tận dụng tệp `data.ts` làm hệ Dictionary, để hút khách Cụm Công nghiệp.
3. **Mạng Báo Khách Kín (Telegram DING-Notify):** Chủ tiệm chỉ cần mở App Telegram, Cứ có người ấn "Tới Messenger" tại Web, một con Bot sẽ nhắn "CÓ KHÁCH CÓ KHÁCH" kèm theo Menu chờ sẵn bên Messenger. Tuyệt đối không trượt đơn nào dù đang bận tay bán hàng tại Sảnh.
4. **Admin Dashboard (CMS Web):** Tích hợp Google Sheets API hoặc Supabase làm Control Panel, giúp nhân viên dọn menu, đổi giá chỉ bằng việc sửa 1 tệp Excel ngoài trang chủ, 5 phút sau Giá trên Website tự đồng bộ hoá xuống!

---
*Mã nguồn chuẩn mực, tái thiết bởi tinh hoa kỹ thuật 2026.*
