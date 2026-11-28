export type UserRole = 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface UserItem {
  id: string;              // ID duy nhất (ví dụ: '1')
  code: string;            // Mã hiển thị (ví dụ: '#NV-01')
  name: string;            // Họ và tên (ví dụ: 'Nguyễn Văn An')
  email: string;           // Email (ví dụ: 'admin@gmail.com')
  username: string;        // Username (ví dụ: '@tuanna')
  phone: string;           // Số điện thoại (ví dụ: '0903 ••• 188')
  role: UserRole;         // 'ADMIN' (Quản trị viên) hoặc 'MANAGER' (Quản lý)
  roleText: string;        // Nhãn hiển thị tiếng Việt
  status: UserStatus;     // 'ACTIVE' (Hoạt động) hoặc 'LOCKED' (Tạm khóa)
  isFixed?: boolean;       // Có phải tài khoản quản trị gốc cố định không
  createdAt?: string;      // Ngày tạo tài khoản
}

export interface UserFiltersState {
  searchQuery: string;
  roleFilter: 'ALL' | UserRole;
  statusFilter: 'ALL' | UserStatus;
  sortBy: 'NEWEST' | 'OLDEST' | 'NAME_ASC';
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
}
