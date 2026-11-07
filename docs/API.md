# API backend

## Cau hinh

Them bien sau vao `backend/.env`:

```env
JWT_SECRET=thay-bang-mot-chuoi-bi-mat-dai-va-ngau-nhien
```

Mat khau trong bang `nhanvien.mat_khau` phai duoc bam bang bcrypt. Tao nhan vien dau tien bang API quan tri hoac cap nhat hash truc tiep trong Supabase.

## Endpoint cong khai

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/menu` | Xem menu va trang thai mon |
| GET | `/api/tables/:id` | Xac thuc thong tin ban sau khi quet QR |
| POST | `/api/orders` | Dat mon: `{ ma_ban, items: [{ ma_mon, so_luong, ghi_chu? }] }` |
| GET | `/api/orders/table/:tableId` | Theo doi cac don cua ban |
| GET | `/api/orders/:id` | Xem chi tiet don |
| POST | `/api/auth/login` | Dang nhap quan ly/quan tri vien |

## Endpoint can Bearer token

| Role | Endpoint |
| --- | --- |
| QuanLy, QuanTriVien | `GET /api/orders/staff`, `PATCH /api/orders/:id/status`, `GET /api/tables`, `PATCH /api/tables/:id` |
| QuanTriVien | CRUD `/api/menu/categories`, CRUD `/api/menu/dishes`, `POST /api/tables`, CRUD `/api/employees` (tai khoan QuanLy), `GET /api/qr/:maBan` |

Cap nhat trang thai don chay qua `PATCH /api/orders/:id/status` voi body `{ "trang_thai": "Dang chuan bi" }`. Cac gia tri hop le: `Dang chuan bi`, `Dang phuc vu`, `Hoan tat`, `Da huy`.
