# 🍽️ Backend API - CasaCozy / Ứng Dụng Gọi Món Qua QR Code

Hệ thống Backend API cho ứng dụng gọi món ăn tại bàn thông qua quét mã QR Code, được xây dựng bằng **Node.js**, **Express**, **TypeScript** và cơ sở dữ liệu **Supabase**.

---

## 📌 1. Công nghệ sử dụng

* **Ngôn ngữ & Runtime:** Node.js (>= 18), TypeScript 5.3+
* **Framework:** Express.js (v5)
* **Cơ sở dữ liệu:** Supabase (PostgreSQL) qua `@supabase/supabase-js`
* **Xác thực & Bảo mật:** JSON Web Token (`jsonwebtoken`), `bcryptjs`, CORS middleware
* **Tiện ích:** `qrcode`, `dotenv`, `ts-node-dev` (hot reload môi trường development)

---

## 🏗️ 2. Kiến trúc hệ thống (Layered Architecture)

Dự án được tổ chức theo mô hình kiến trúc phân tầng 3 lớp chuẩn hóa:

```
Request  --->  Routes  --->  Controllers  --->  Services  --->  Models  --->  Supabase
                                 │                 │
                            (Nhận HTTP &     (Xử lý nghiệp vụ,
                            trả JSON)        validate dữ liệu)
```

### Cấu trúc thư mục:
```text
backend/
├── src/
│   ├── config/             # Cấu hình Supabase client
│   ├── controllers/        # Tiếp nhận request HTTP, gọi Service và trả JSON response
│   ├── middlewares/        # Xác thực Token (verifyToken) và phân quyền (checkRole)
│   ├── models/             # Tương tác trực tiếp với bảng trong Supabase (SQL/Query)
│   ├── routes/             # Định tuyến API endpoints
│   ├── services/           # Xử lý toàn bộ nghiệp vụ, logic tính toán và kiểm tra dữ liệu
│   ├── types/              # Khai báo TypeScript types & interfaces
│   ├── utils/              # Các hàm tiện ích (AppError, tạo mã QR...)
│   ├── app.ts              # Khởi tạo Express app, cấu hình middleware toàn cục
│   └── server.ts           # Điểm khởi chạy server và bắt lỗi cổng
├── .env                    # Biến môi trường (không commit lên git)
├── .env.example            # File mẫu biến môi trường
├── package.json
└── tsconfig.json
```

---

## 🚀 3. Các tính năng & Nghiệp vụ đã hoàn thiện

### 🔐 Xác thực & Phân quyền (Authentication & Authorization)
* Đăng nhập cấp mã JWT token có hiệu lực trong 8 giờ.
* Hỗ trợ 3 nhóm vai trò (Roles):
  * **Khách hàng (Không cần đăng nhập):** Xem thực đơn, đặt món theo bàn, tra cứu đơn theo bàn.
  * **`QuanLy`:** Xem và cập nhật trạng thái đơn hàng, trạng thái bàn ăn.
  * **`QuanTriVien` / `ADMIN`:** Toàn quyền quản trị thực đơn, bàn ăn, sinh mã QR và quản lý nhân viên.
* **Cơ chế xác thực linh hoạt cho Dev:** Hỗ trợ cả mật khẩu đã băm (Bcrypt `$2a$`, `$2b$`) và mật khẩu văn bản thường (plaintext như `12345678`) trên Supabase để thuận tiện phát triển cục bộ.

### 🪑 Quản lý Bàn ăn & Mã QR (Tables & QR Code)
* Lấy danh sách bàn kèm thông tin đơn hàng đang hoạt động (`Cho xac nhan`, `Dang chuan bi`, `Dang phuc vu`).
* Tạo bàn mới tự động sinh URL và lưu mã QR Code vào bảng `maqr`.
* Cập nhật thông tin bàn và **xóa bàn (`DELETE /api/tables/:id`)** an toàn (tự động xóa bản ghi QR liên quan).

### 📖 Quản lý Thực đơn (Categories & Dishes)
* Lấy toàn bộ thực đơn đã gom nhóm theo danh mục.
* CRUD danh mục món ăn (`nhommon`).
* CRUD món ăn (`monan`) có hỗ trợ cập nhật từng phần (`PATCH /api/menu/dishes/:id`).

### 🛒 Quản lý Đặt món & Đơn hàng (Orders)
* Đặt món theo bàn: Tự động kiểm tra món ăn có tồn tại và còn món hay không, tự động tính tổng tiền từ giá niêm yết trong cơ sở dữ liệu.
* Khi đặt món thành công: Tự động cập nhật trạng thái bàn sang `Dang phuc vu`.
* Khi đơn hàng chuyển sang `Hoan tat` hoặc `Da huy`: Tự động kiểm tra và hoàn trả trạng thái bàn về `Trong` nếu bàn không còn đơn nào khác đang phục vụ.
* Có cơ chế fallback `employeeId = 1` an toàn khi cập nhật trạng thái đơn hàng trong môi trường thử nghiệm.

### 👥 Quản lý Nhân sự (Employees)
* Danh sách nhân viên, tạo tài khoản quản lý với mật khẩu được mã hóa tự động bằng Bcrypt 12 vòng.
* Cập nhật thông tin nhân viên, chặn tự xóa tài khoản của chính mình khi đang đăng nhập.

---

## ⚙️ 4. Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Yêu cầu môi trường
* Đã cài đặt **Node.js** (khuyến nghị phiên bản 18 hoặc 20 LTS).
* Git.

### Bước 2: Cài đặt thư viện dependencies
Di chuyển vào thư mục `backend` và chạy lệnh:
```bash
cd backend
npm install
```

### Bước 3: Cấu hình biến môi trường (`.env`)
Tạo file `.env` tại thư mục `backend` bằng cách sao chép từ file mẫu `.env.example`:

```bash
cp .env.example .env
```
*(Trên Windows PowerShell có thể gõ: `copy .env.example .env`)*

Cập nhật các giá trị trong `.env`:
```env
PORT=5000
JWT_SECRET=casacozy_secret_key_2025
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

### Bước 4: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```

Khi khởi động thành công, terminal sẽ thông báo:
```text
Server dang chay tai http://localhost:5000
```

---

## 📡 5. Tóm tắt các Endpoints chính

| Phương thức | Endpoint | Yêu cầu xác thực / Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | Đăng nhập tài khoản nhân viên / quản trị |
| **GET** | `/api/menu` | Public | Lấy toàn bộ thực đơn theo nhóm |
| **POST** | `/api/orders` | Public | Đặt món tại bàn |
| **GET** | `/api/orders/table/:tableId` | Public | Lấy đơn hàng theo mã bàn |
| **GET** | `/api/tables` | Public | Xem danh sách bàn và đơn hiện tại |
| **POST** | `/api/tables` | Bearer Token (`QuanLy`, `QuanTriVien`, `ADMIN`) | Thêm bàn mới (tự sinh QR) |
| **PATCH** | `/api/tables/:id` | Bearer Token (`QuanLy`, `QuanTriVien`, `ADMIN`) | Cập nhật thông tin bàn |
| **DELETE** | `/api/tables/:id` | Bearer Token (`QuanLy`, `QuanTriVien`, `ADMIN`) | Xóa bàn ăn |
| **GET** | `/api/orders` | Bearer Token (`QuanLy`, `QuanTriVien`, `ADMIN`) | Danh sách tất cả đơn hàng |
| **PATCH** | `/api/orders/:id/status`| Bearer Token (`QuanLy`, `QuanTriVien`, `ADMIN`) | Cập nhật trạng thái đơn |
| **GET/POST/PATCH/DELETE** | `/api/menu/categories` | Bearer Token (`QuanTriVien`, `ADMIN`) | Quản lý nhóm món |
| **GET/POST/PATCH/DELETE** | `/api/menu/dishes` | Bearer Token (`QuanTriVien`, `ADMIN`) | Quản lý món ăn |
| **GET/POST/PATCH/DELETE** | `/api/employees` | Bearer Token (`QuanTriVien`, `ADMIN`) | Quản lý nhân viên |

> 📖 **Xem tài liệu chi tiết:** Để xem đầy đủ định dạng body JSON và mẫu response từng API, hãy xem file [docs/API.md](../docs/API.md).

---

## ⚠️ 6. Xử lý sự cố thường gặp (Troubleshooting)

1. **Lỗi `EADDRINUSE` (Cổng 5000 bị chiếm dụng):**
   * Do có một tiến trình Node hoặc cửa sổ terminal khác đang chạy ngầm trên cổng 5000.
   * Cách khắc phục trên Windows PowerShell:
     ```powershell
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
     ```
2. **Lỗi `Token khong hop le hoac da het han`:**
   * Hãy đăng nhập lại qua endpoint `/api/auth/login` để lấy token mới.
   * Thêm token vào Header request: `Authorization: Bearer <token_cua_ban>`.
3. **Lỗi kết nối Supabase:**
   * Kiểm tra lại đường dẫn `SUPABASE_URL` và `SUPABASE_KEY` trong file `.env`.
