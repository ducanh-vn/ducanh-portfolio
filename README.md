# Nguyen Duc Anh — Fullstack Editorial Portfolio (Next.js 14 App Router)

Dự án Portfolio Fullstack chuyên nghiệp dành cho **Nguyễn Đức Anh**, phát triển trên nền tảng **Next.js 14 (App Router) + TypeScript + Tailwind CSS** và tích hợp sẵn trang **Admin CMS** trực quan để chỉnh sửa dữ liệu.

---

## 🌟 Tính năng nổi bật

### 1. Phía Người Dùng (Public Portfolio — `/`)
- **Preloader Power-Arc**: Trích xuất nguyên bản từ `q-hjv.com`, hoạt ảnh SVG nét vẽ theo % từ 0 đến 100%, kết thúc bằng tia sáng vàng neon `#f1f505`.
- **Con trỏ chuột tùy biến (Interactive Custom Cursor)**: Chấm tâm kết hợp vòng tròn đàn hồi, tự động biến hình thành huy hiệu `VIEW` khi rê chuột qua các dự án.
- **Hiệu ứng chuyển cảnh điện ảnh (Curtain Sweep Transition)**: Rèm tối màu với viền sáng neon quét qua màn hình khi chuyển giữa trang Home và About Me.
- **Off-Canvas Project Drawer**: Ngăn trượt danh sách các dự án tiêu biểu (`[ PROJECTS [ 04 ] ]`).
- **Modal chi tiết dự án tương phản kép (Dual-Contrast)**: Nửa trên nền tối sang trọng, nửa dưới nền giấy sáng (`#f4f4f4`) phân tích kiến trúc tính năng.
- **Dòng thời gian chuẩn xác**: Thiết kế timeline với chấm tròn phát sáng cách chữ 27px, không bao giờ bị đè chữ.

### 2. Phía Quản Trị (Admin CMS Studio — `/admin`)
- **Bảo mật**: Đăng nhập bằng mật khẩu quản trị (phiên làm việc mã hóa qua HTTP-only Cookie).
- **Tab 1: Hồ sơ & Giới thiệu**: Chỉnh sửa Họ tên, Chức danh, Bio, Tagline, Email, Địa chỉ, Link GitHub, LinkedIn, Avatar, link CV.
- **Tab 2: Dự án tiêu biểu**: Thêm dự án mới, sửa tên, mô tả, thẻ công nghệ, link Live Demo / GitHub, xóa dự án cũ.
- **Tab 3: Dòng thời gian**: Thêm / sửa / xóa các mốc học tập và làm việc.
- **Tab 4: Kỹ năng**: Thêm / xóa các thẻ kỹ năng công nghệ trong nháy mắt.
- **Lưu tức thì**: Cập nhật trực tiếp vào cơ sở dữ liệu `src/data/portfolio.json` và phản ánh ngay lên trang chủ mà không cần build lại code!

---

## 🔑 Tài khoản Admin mặc định
- **Đường dẫn đăng nhập:** `http://localhost:3000/admin`
- **Mật khẩu mặc định:** `ducanh2026` *(Có thể thay đổi trong file `.env.local`)*

---

## 💻 Cách khởi chạy và phát triển

```bash
# 1. Cài đặt thư viện (nếu clone máy mới)
npm install

# 2. Chạy môi trường phát triển (Development)
npm run dev

# 3. Mở trên trình duyệt
# Public Portfolio: http://localhost:3000
# Admin CMS:       http://localhost:3000/admin
```

---

## 🚀 Triển khai lên Vercel (1-Click)
1. Đẩy toàn bộ mã nguồn lên repository GitHub cá nhân: `ducanh-vn/portfolio`.
2. Truy cập [vercel.com](https://vercel.com) -> Bấm **Add New Project** -> Chọn repo `portfolio`.
3. Trong mục **Environment Variables**, thêm biến:
   - `ADMIN_PASSWORD`: `<mật_khẩu_bí_mật_của_bạn>`
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp phát tên miền `https://<tên-bạn>.vercel.app` tốc độ cao hoàn toàn miễn phí!
