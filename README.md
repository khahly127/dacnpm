# 🍽️ CasaCozy - Hệ Thống Gọi Món Ăn Qua Mã QR

Dự án ứng dụng web cho phép khách hàng quét mã QR tại bàn để xem menu và gọi món trực tuyến, tích hợp cùng hệ thống quản lý đơn hàng và bàn ăn dành cho nhân viên phục vụ, quản lý và quản trị viên nhà hàng.

---

## 📂 1. Cấu trúc dự án

```text
dacnpm/
├── backend/                  # API Server (Node.js, Express, TypeScript, Supabase)
├── frontend/
│   ├── admin-web/            # Web quản trị dành cho Quản trị viên (Admin)
│   ├── manager-web/          # Web điều phối dành cho Quản lý / Bếp / Thu ngân
│   └── user-app/             # Web-app dành cho Khách hàng quét mã gọi món tại bàn
├── docs/                     # Tài liệu thiết kế & API (API.md, GIT_WORKFLOW.md, ...)
└── README.md
```

---

## ⚡ 2. Hướng dẫn khởi chạy nhanh

### Yêu cầu hệ thống:
* **Node.js** >= 18.x
* Trình quản lý gói **npm** (đi kèm khi cài đặt Node.js)

---

### Khởi chạy Backend API:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện cần thiết
npm install

# 3. Tạo file cấu hình môi trường từ file mẫu
# Trên Linux/macOS:
cp .env.example .env
# Trên Windows PowerShell:
copy .env.example .env

# 4. Điền thông tin kết nối Supabase và JWT_SECRET vào file .env vừa tạo

# 5. Khởi chạy server ở chế độ dev
npm run dev
```

* Backend API sẽ chạy mặc định tại: `http://localhost:5000`
* Xem tài liệu chi tiết về kiến trúc và các API tại: [backend/README.md](./backend/README.md) hoặc [docs/API.md](./docs/API.md).

---

### Khởi chạy Frontend:

Mỗi ứng dụng trong thư mục `frontend/` có thể được khởi chạy độc lập:

* **Ứng dụng gọi món cho khách:**
  ```bash
  cd frontend/user-app
  npm install
  npm run dev
  ```
* **Ứng dụng quản trị (Admin):**
  ```bash
  cd frontend/admin-web
  npm install
  npm run dev
  ```
* **Ứng dụng quản lý:**
  ```bash
  cd frontend/manager-web
  npm install
  npm run dev
  ```

---

## 🔄 3. Quy trình làm việc với Git

Để tránh xảy ra xung đột khi làm việc nhóm, vui lòng xem [Hướng dẫn Git cho dự án](./docs/GIT_WORKFLOW.md).

**Các bước cơ bản trước khi bắt đầu code:**
```bash
# Cất code tạm nếu có thay đổi chưa commit
git stash

# Kéo code mới nhất từ nhánh main
git pull origin main

# Lấy lại code đang làm dở
git stash pop
```
