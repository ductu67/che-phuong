# Chè Phương Website Walkthrough

## Cấu trúc dự án
1.  **`index.html`**: Trang chủ HTML5 ngữ nghĩa. Gồm thanh điều hướng, Header thư giãn, danh sách Menu 4 phần (Chè Hiện Đại, Chè Truyền Thống, Sữa Chua, Đồ Uống).
2.  **`style.css`**: Hệ thống UI/UX sử dụng biến CSS để quản lý Light/Dark Mode. CSS Animations tạo hiệu ứng cuộn mượt mà.
3.  **`main.js`**: JS để xử lý sự kiện Intersection Observer (cuộn trang), chuyển đổi Theme, và Smooth Scroll.

## 🚀 Tính Năng Bán Hàng & Chuyển Đổi

Để biến website từ một Menu đơn giản thành kênh bán hàng tương tác:

*   **Tính năng Đặt Hàng Zalo:** Mỗi món ăn đều đi kèm một nút **`Đặt hàng ngay`**. Nút này sử dụng đường dẫn `https://zalo.me/0973982604` kết hợp tham số `?text=` để tự động điền sẵn tên món mà khách muốn đặt ngay khi họ mở app Zalo (VD: "Mình muốn đặt món Chè Xoài Hồng Kông").
*   **Chứng thực khách hàng (Social Proof):** Thêm một section **"Khách Hàng Nói Gì"** ngay trên Footer. Khu vực này hiển thị 3 thẻ (cards) đánh giá chân thực từ khách hàng để tăng uy tín thương hiệu.
*   **Điểm chạm Footer:** 
    *   Địa chỉ vật lý được liên kết hóa thành **Google Maps link**.
    *   Số điện thoại được gắn link **tel:** để bấm gọi ngay trên di động.
    *   Bên cạnh nút Facebook, nút **Zalo xanh dương nổi bật** được thêm vào để rút ngắn hành trình liên hệ.

## Hình Ảnh AI và Trải Nghiệm Thị Giác
Dự án sử dụng hình ảnh tạo bằng AI mang đậm phong cách minimalist, pastel. Các khối hình CSS gradient (blob) được sử dụng để duy trì tính thẩm mỹ trong lúc chờ bổ sung hình ảnh thật từ quán.
