'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, UserRole } from '@/types/auth';
import { authService } from '@/services/authService';

export function useLoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: '',
    password: '',
    role: 'ADMIN', // Mặc định chọn Quản trị viên như bản vẽ
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [language, setLanguage] = useState<'VIE' | 'ENG'>('VIE');

  const setRole = useCallback((role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrorMessage('');
  }, []);

  const handleChange = useCallback(
    (field: keyof LoginFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errorMessage) setErrorMessage('');
    },
    [errorMessage]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login(formData);
      if (res.success) {
        // Đăng nhập thành công -> chuyển về trang chủ Dashboard
        router.push('/');
      } else {
        setErrorMessage(res.message || 'Đăng nhập không thành công.');
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi kết nối, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setRole,
    handleChange,
    showPassword,
    setShowPassword,
    loading,
    errorMessage,
    language,
    setLanguage,
    handleSubmit,
  };
}