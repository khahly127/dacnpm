export type UserRole = 'MANAGER' | 'ADMIN';

export interface LoginFormData {
  identifier: string; // Mã nhân viên hoặc Email
  password: string;
  role: UserRole;     // 'MANAGER': Quản lý | 'ADMIN': Quản trị viên
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}
