# Backend API

Backend của dự án web-app gọi món ăn qua QR code, được xây dựng bằng Node.js, TypeScript và Express.

## Mục tiêu

- Cung cấp API cho frontend
- Kết nối và truy vấn dữ liệu từ Supabase
- Xử lý logic nghiệp vụ cho các chức năng đặt món / quản lý dữ liệu

## Công nghệ sử dụng

- Node.js
- Express.js
- TypeScript
- Supabase
- dotenv

## Cấu trúc thư mục

```bash
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Yêu cầu

- Node.js >= 18
- npm hoặc yarn
- Tài khoản Supabase đã được cấu hình

## Cài đặt

```bash
cd backend
npm install
```

## Cấu hình môi trường

Tạo file `.env` trong thư mục `backend` với nội dung như sau:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
PORT=3000
```

## Chạy server

```bash
npm run dev
```

Server sẽ chạy mặc định tại:

```bash
http://localhost:3000
```

## API mẫu

### Root

```http
GET /
```

Trả về thông báo trạng thái server đang hoạt động.

### Test database connection

```http
GET /test-db
```

Dùng để kiểm tra kết nối tới bảng `Ban` trong Supabase.

## Ghi chú

- Nhiều module như `routes`, `controllers`, `models` vẫn đang được phát triển theo cấu trúc chuẩn.
- Nếu cần thêm route mới, hãy tạo trong `src/routes` và kết nối với controller tương ứng.
