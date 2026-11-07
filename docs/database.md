# 📊 Tài Liệu Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

Hệ thống quản lý gọi món ăn qua QR code sử dụng **Supabase (PostgreSQL)** làm hệ quản trị cơ sở dữ liệu quan hệ. Dưới đây là cấu trúc chi tiết của từng bảng, các khóa chính (PK), khóa ngoại (FK) và các mối quan hệ trong hệ thống.

---

## 1. Sơ đồ Quan hệ Tổng quan (Relational Schema)
* **`Ban` (1) ──< (1)** `MaQR` (Quan hệ 1-1 qua `ma_ban`)
* **`Ban` (1) ──< (n)** `DonHang` (Một bàn có nhiều lượt gọi đơn hàng)
* **`NhanVien` (1) ──< (n)** `DonHang` (Nhân viên quản lý/xử lý đơn hàng)
* **`NhomMon` (1) ──< (n)** `MonAn` (Một nhóm món chứa nhiều món ăn)
* **`DonHang` (1) ──< (n)** `ChiTietDonHang` (Một đơn hàng gồm nhiều chi tiết món)
* **`MonAn` (1) ──< (n)** `ChiTietDonHang` (Một món ăn xuất hiện trong nhiều chi tiết đơn)

---

## 2. Chi tiết Cấu trúc các Bảng

### 2.1. Bảng `ban` (Quản lý Bàn ăn)
Lưu trữ thông tin các bàn ăn trong nhà hàng.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_ban` | `SERIAL` | **PRIMARY KEY** | Mã định danh bàn ăn |
| `ten_ban` | `VARCHAR(50)` | `NOT NULL` | Tên hoặc số hiệu bàn (VD: Bàn 01) |
| `trang_thai` | `VARCHAR(50)` | `NOT NULL` | Trạng thái bàn (VD: Trống, Đang phục vụ) |

---

### 2.2. Bảng `maqr` (Quản lý Mã QR của bàn)
Lưu trữ thông tin liên kết mã QR tương ứng với từng bàn ăn.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `qr_id` | `SERIAL` | **PRIMARY KEY** | Mã định danh bản ghi QR |
| `ma_ban` | `INT` | **FOREIGN KEY**, `UNIQUE`, `NOT NULL` | Khóa ngoại trỏ tới bảng `ban` |
| `image_url` | `TEXT` | - | Lưu chuỗi Base64 hoặc đường dẫn ảnh QR |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Thời điểm tạo mã QR |

---

### 2.3. Bảng `nhanvien` (Quản lý Nhân viên & Quản lý)
Lưu trữ tài khoản đăng nhập và phân quyền hệ thống.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_nv` | `SERIAL` | **PRIMARY KEY** | Mã định danh nhân viên |
| `ho_ten` | `VARCHAR(100)` | `NOT NULL` | Họ và tên nhân viên |
| `tai_khoan` | `VARCHAR(50)` | **UNIQUE**, `NOT NULL` | Tên đăng nhập hệ thống |
| `mat_khau` | `VARCHAR(255)` | `NOT NULL` | Mật khẩu tài khoản |
| `vai_tro` | `VARCHAR(50)` | `NOT NULL` | Vai trò (VD: QuanLy, NhanVien) |

---

### 2.4. Bảng `nhommon` (Danh mục Nhóm món ăn)
Phân loại các nhóm món ăn trong thực đơn.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_nhom` | `SERIAL` | **PRIMARY KEY** | Mã định danh nhóm món |
| `ten_nhom` | `VARCHAR(100)` | `NOT NULL` | Tên nhóm (VD: Khai vị, Món chính, Đồ uống) |

---

### 2.5. Bảng `monan` (Quản lý Thực đơn Món ăn)
Lưu trữ thông tin chi tiết các món ăn phục vụ khách hàng.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_mon` | `SERIAL` | **PRIMARY KEY** | Mã định danh món ăn |
| `ma_nhom` | `INT` | **FOREIGN KEY**, `NOT NULL` | Khóa ngoại trỏ tới bảng `nhommon` |
| `ten_mon` | `VARCHAR(100)` | `NOT NULL` | Tên món ăn |
| `gia` | `NUMERIC(10,2)` | `NOT NULL` | Giá bán hiện hành |
| `hinh_anh` | `VARCHAR(255)` | - | Đường dẫn hình ảnh món ăn |
| `trang_thai` | `VARCHAR(50)` | `NOT NULL` | Trạng thái (VD: Còn món, Hết món) |

---

### 2.6. Bảng `donhang` (Quản lý Đơn hàng / Order)
Lưu trữ thông tin các phiếu gọi món của khách tại bàn.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_don` | `SERIAL` | **PRIMARY KEY** | Mã định danh đơn hàng |
| `ma_ban` | `INT` | **FOREIGN KEY**, `NOT NULL` | Khóa ngoại trỏ tới bảng `ban` |
| `ma_nv` | `INT` | **FOREIGN KEY**, `NULL` | Nhân viên xác nhận/xử lý (có thể Null khi khách tự gọi) |
| `thoi_gian_tao` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Thời điểm tạo đơn hàng |
| `tong_tien` | `NUMERIC(12,2)` | `DEFAULT 0` | Tổng giá trị đơn hàng |
| `trang_thai` | `VARCHAR(50)` | `NOT NULL` | Trạng thái đơn (VD: Chờ xác nhận, Đang phục vụ, Đã hoàn tất) |

---

### 2.7. Bảng `chitietdonhang` (Chi tiết các món trong đơn hàng)
Lưu trữ danh sách chi tiết các món ăn và số lượng trong mỗi đơn hàng.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `ma_ct` | `SERIAL` | **PRIMARY KEY** | Mã định danh chi tiết đơn |
| `ma_don` | `INT` | **FOREIGN KEY**, `NOT NULL` | Khóa ngoại trỏ tới bảng `donhang` |
| `ma_mon` | `INT` | **FOREIGN KEY**, `NOT NULL` | Khóa ngoại trỏ tới bảng `monan` |
| `so_luong` | `INT` | `NOT NULL`, `CHECK (so_luong > 0)` | Số lượng món ăn được đặt |
| `don_gia` | `NUMERIC(10,2)` | `NOT NULL` | Giá món ăn tại thời điểm đặt |
| `ghi_chu` | `VARCHAR(255)` | - | Ghi chú riêng cho món (VD: Ít cay, không hành) |

---

## 3. Câu lệnh SQL Khởi tạo Cơ sở dữ liệu (PostgreSQL)

```sql
-- 1. Bảng Bàn ăn
CREATE TABLE IF NOT EXISTS ban (
    ma_ban SERIAL PRIMARY KEY,
    ten_ban VARCHAR(50) NOT NULL,
    trang_thai VARCHAR(50) NOT NULL DEFAULT 'Trống'
);

-- 2. Bảng Mã QR
CREATE TABLE IF NOT EXISTS maqr (
    qr_id SERIAL PRIMARY KEY,
    ma_ban INT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qr_ban FOREIGN KEY (ma_ban) REFERENCES ban(ma_ban) ON DELETE CASCADE
);

-- 3. Bảng Nhân viên / Quản lý
CREATE TABLE IF NOT EXISTS nhanvien (
    ma_nv SERIAL PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    tai_khoan VARCHAR(50) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(50) NOT NULL
);

-- 4. Bảng Nhóm món (Danh mục)
CREATE TABLE IF NOT EXISTS nhommon (
    ma_nhom SERIAL PRIMARY KEY,
    ten_nhom VARCHAR(100) NOT NULL
);

-- 5. Bảng Món ăn
CREATE TABLE IF NOT EXISTS monan (
    ma_mon SERIAL PRIMARY KEY,
    ma_nhom INT NOT NULL,
    ten_mon VARCHAR(100) NOT NULL,
    gia NUMERIC(10, 2) NOT NULL,
    hinh_anh VARCHAR(255),
    trang_thai VARCHAR(50) NOT NULL,
    CONSTRAINT fk_mon_nhom FOREIGN KEY (ma_nhom) REFERENCES nhommon(ma_nhom) ON DELETE CASCADE
);

-- 6. Bảng Đơn hàng
CREATE TABLE IF NOT EXISTS donhang (
    ma_don SERIAL PRIMARY KEY,
    ma_ban INT NOT NULL,
    ma_nv INT NULL,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tong_tien NUMERIC(12, 2) DEFAULT 0,
    trang_thai VARCHAR(50) NOT NULL,
    CONSTRAINT fk_don_ban FOREIGN KEY (ma_ban) REFERENCES ban(ma_ban),
    CONSTRAINT fk_don_nv FOREIGN KEY (ma_nv) REFERENCES nhanvien(ma_nv)
);

-- 7. Bảng Chi tiết đơn hàng
CREATE TABLE IF NOT EXISTS chitietdonhang (
    ma_ct SERIAL PRIMARY KEY,
    ma_don INT NOT NULL,
    ma_mon INT NOT NULL,
    so_luong INT NOT NULL CHECK (so_luong > 0),
    don_gia NUMERIC(10, 2) NOT NULL,
    ghi_chu VARCHAR(255),
    CONSTRAINT fk_ct_don FOREIGN KEY (ma_don) REFERENCES donhang(ma_don) ON DELETE CASCADE,
    CONSTRAINT fk_ct_mon FOREIGN KEY (ma_mon) REFERENCES monan(ma_mon)
);