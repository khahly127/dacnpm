# API Backend

Base URL khi chay local: `http://localhost:3000`

## Cau hinh va xac thuc

Backend can cac bien trong `backend/.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
JWT_SECRET=mot-chuoi-bi-mat-dai-va-ngau-nhien
```

API can dang nhap dung header sau:

```http
Authorization: Bearer <token>
```

Co 3 actor:

| Actor | Dang nhap | Pham vi |
| --- | --- | --- |
| Khach hang | Khong | Xem menu, dat mon, theo doi don theo ban |
| QuanLy | Co | Xem/xu ly don va cap nhat trang thai ban |
| QuanTriVien | Co | Toan quyen cua QuanLy va quan ly mon, ban, QR, tai khoan QuanLy |

## API cong khai

### Dang nhap

`POST /api/auth/login`

```json
{
  "tai_khoan": "admin",
  "mat_khau": "mat-khau"
}
```

Tra ve JWT va thong tin tai khoan neu dang nhap thanh cong.

### Menu

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/menu` | Xem nhom mon va danh sach mon |

### Ban va QR

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/tables/:id` | Xem, dong thoi xac thuc, ban sau khi quet QR |

### Don hang

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| POST | `/api/orders` | Tao don hang moi |
| GET | `/api/orders/table/:tableId` | Xem don hang cua mot ban |
| GET | `/api/orders/:id` | Xem chi tiet mot don |

Body cua `POST /api/orders`:

```json
{
  "ma_ban": 1,
  "items": [
    { "ma_mon": 2, "so_luong": 2, "ghi_chu": "It cay" },
    { "ma_mon": 5, "so_luong": 1 }
  ]
}
```

Gia mon va tong tien duoc lay tu database khi tao don, khong lay tu client.

## API cho QuanLy va QuanTriVien

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/orders/staff?status=<trang_thai>` | Xem tat ca don; `status` la query tuy chon |
| PATCH | `/api/orders/:id/status` | Cap nhat trang thai don |
| GET | `/api/tables` | Xem danh sach ban |
| PATCH | `/api/tables/:id` | Cap nhat ten hoac trang thai ban |

Body cap nhat trang thai don:

```json
{ "trang_thai": "Dang chuan bi" }
```

Trang thai don hop le: `Dang chuan bi`, `Dang phuc vu`, `Hoan tat`, `Da huy`.

Body cap nhat ban:

```json
{ "trang_thai": "Dang phuc vu" }
```

## API chi cho QuanTriVien

### Nhom mon

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/menu/categories` | Danh sach nhom mon |
| POST | `/api/menu/categories` | Tao nhom mon |
| PATCH | `/api/menu/categories/:id` | Sua nhom mon |
| DELETE | `/api/menu/categories/:id` | Xoa nhom mon |

Body tao/sua nhom mon:

```json
{ "ten_nhom": "Mon chinh" }
```

### Mon an

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/menu/dishes` | Danh sach mon cho quan tri |
| POST | `/api/menu/dishes` | Tao mon an |
| PATCH | `/api/menu/dishes/:id` | Sua mon an |
| DELETE | `/api/menu/dishes/:id` | Xoa mon an |

Body tao/sua mon an:

```json
{
  "ma_nhom": 1,
  "ten_mon": "Com chien",
  "gia": 45000,
  "hinh_anh": "https://example.com/com-chien.jpg",
  "trang_thai": "Con mon"
}
```

### Ban va ma QR

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| POST | `/api/tables` | Tao ban moi |
| GET | `/api/qr/:maBan` | Tao/cap nhat QR cua ban va luu vao Supabase |

Body tao ban:

```json
{ "ten_ban": "Ban 01", "trang_thai": "Trong" }
```

### Tai khoan QuanLy

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/employees` | Danh sach tai khoan |
| POST | `/api/employees` | Tao tai khoan QuanLy |
| PATCH | `/api/employees/:id` | Sua tai khoan QuanLy, doi mat khau |
| DELETE | `/api/employees/:id` | Xoa tai khoan QuanLy |

Body tao tai khoan QuanLy:

```json
{
  "ho_ten": "Nguyen Van A",
  "tai_khoan": "quanly01",
  "mat_khau": "mat-khau-it-nhat-8-ky-tu",
  "vai_tro": "QuanLy"
}
```

`QuanTriVien` la tai khoan co san. API nay chi cho phep tao/sua tai khoan co vai tro `QuanLy`.

## Cau truc thu muc backend

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── .env
├── package.json
└── tsconfig.json
```

| Thu muc/file | Vai tro |
| --- | --- |
| `server.ts` | Doc bien moi truong va khoi dong Express server. |
| `app.ts` | Gan middleware, route va bo xu ly loi chung. |
| `config/` | Cau hinh ket noi dich vu ngoai, hien tai la Supabase. |
| `routes/` | Khai bao URL, HTTP method va middleware phan quyen. |
| `controllers/` | Nhan request, goi service/model, tra response JSON. |
| `services/` | Xu ly nghiep vu co nhieu buoc, vi du tao don va tinh tong tien. |
| `models/` | Truy van cac bang Supabase; khong xu ly HTTP. |
| `middlewares/` | Xac thuc JWT, kiem tra vai tro va xu ly loi tap trung. |
| `types/` | Kieu TypeScript dung chung, nhu role va request da dang nhap. |
| `utils/` | Ham dung chung, vi du `AppError` va ham tao QR. |

Luong mot request: `route` → `middleware` → `controller` → `service` (neu can) → `model` → Supabase → response JSON.
