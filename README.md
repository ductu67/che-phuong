# Chè Phương - Vietnamese Sweet Soup Website 🍧

Một trang web giới thiệu Menu các món Chè và Đồ uống mang phong cách Chill, Minimalist (Tối giản), sử dụng tông màu Pastel nhẹ nhàng.

## 🌟 Tính năng nổi bật (Features)

*   **Giao diện Tối giản & Hiện đại:** Thiết kế tập trung vào trải nghiệm hình ảnh, sử dụng font chữ thanh mảnh và khoảng trắng hợp lý.
*   **Chế độ Tối (Dark Mode):** Hỗ trợ chuyển đổi mượt mà giữa giao diện Sáng (Tone kem/hồng pastel) và Tối (Tone đen/xám) qua nút bấm trực quan, ghi nhớ tùy chọn của người dùng.
*   **Hiệu ứng Ảnh động (Animations):** 
    *   Hiệu ứng cuộn trang (Scroll Reveal) mượt mà làm xuất hiện các thẻ menu.
    *   Hiệu ứng CSS Blob chuyển động mềm mại ở phần Hero Section.
    *   Hiệu ứng Hover (di chuột) nổi khối và đổi màu tương tác tốt.
*   **Responsive Design:** Tương thích và hiển thị đẹp mắt trên mọi thiết bị (Desktop, Mobile, Tablet).
*   **Hình ảnh AI (AI Generated Images):** Tích hợp các hình ảnh minh họa món chè theo đúng vibe "chill" và thống nhất ngôn ngữ thiết kế (Các ảnh đồ uống đang dùng placeholder chờ cập nhật).
*   **Tích hợp Bản đồ & Liên hệ nhanh:** 
    *   Click vào địa chỉ để mở Google Maps chỉ đường.
    *   Click vào Hotline để mở trình gọi điện trên điện thoại (sử dụng giao thức `tel:`).

## 🛠️ Công nghệ sử dụng (Tech Stack)

*   **HTML5:** Cấu trúc trang web theo ngữ nghĩa (Semantic HTML).
*   **CSS3 (Vanilla):**
    *   CSS Variables (Biến CSS) để quản lý Theme (Light/Dark mode) và màu sắc (Color Palette).
    *   CSS Flexbox & Grid để dàn bố cục Layout và Responsive.
    *   CSS Transitions & Animations để tạo chuyển động.
*   **JavaScript (ES6):**
    *   `IntersectionObserver API` để bắt sự kiện cuộn trang và kích hoạt Animation.
    *   `localStorage` để lưu trữ trạng thái Dark Mode của người dùng.
*   **Vite:** Trình đóng gói (Bundler) và Môi trường phát triển cục bộ siêu tốc.
*   **Phosphor Icons:** Thư viện Icon tối giản, hiện đại và đồng bộ.

## 🚀 Hướng dẫn cài đặt và chạy máy chủ ảo (Local Development)

Dự án này sử dụng Vite. Bạn cần cài đặt [Node.js](https://nodejs.org/) trước.

1. **Clone repository:**
   ```bash
   git clone https://github.com/ductu67/che-phuong.git
   cd che-phuong
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```
   *(Lệnh này sẽ cài đặt Vite dưới dạng devDependency)*

3. **Chạy server phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   *Mở trình duyệt và truy cập vào đường dẫn `http://localhost:5173/`*

4. **Đóng gói sản phẩm (Build for Production):**
   ```bash
   npm run build
   ```
   *(Các file tĩnh HTML, CSS, JS, Images đã tối ưu sẽ nằm trong thư mục `dist/`)*

## 📂 Kiến trúc Thư mục (Folder Structure)

```text
che-phuong/
├── public/                 # Thư mục chứa hình ảnh tĩnh (Images, AI Generated)
├── index.html              # Trang chủ HTML chính
├── style.css               # File CSS định dạng tổng thể
├── main.js                 # Script điều khiển logic (Dark mode, Scroll)
├── package.json            # Chứa thông tin cấu hình NPM và Scripts (Vite)
└── .gitignore              # Chỉ định các file/thư mục không đẩy lên Git
```

---
*Developed with ❤️ and AntiGravity AI Agent.*
