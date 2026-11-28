"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { authService } from "@/services/authService";
import { ProfileModal } from "./ProfileModal";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth_state_changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth_state_changed", callback);
  };
}

export function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Đọc thông tin user thật từ phiên đăng nhập (Đã có cached reference chống loop)
  const currentUser = useSyncExternalStore(
    subscribe,
    () => authService.getCurrentUser(),
    () => null
  );

  // 2. Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 3. Hàm xử lý logic Đăng xuất
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsDropdownOpen(false);
      await authService.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Hàm lấy 2 chữ cái viết tắt đại diện cho Avatar (Ví dụ: "Nguyễn Văn An" -> "VA")
  const getAvatarInitials = (name?: string) => {
    if (!name) return "AT";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (
      words[words.length - 2][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-[#EFE9DF] px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-2xs">
      {/* Ô tìm kiếm chung */}
      <div className="relative w-80 sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
        <input
          type="text"
          placeholder="Tìm báo cáo, đơn hàng, hóa đơn..."
          className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
        />
      </div>

      {/* Khu vực thông báo & Tài khoản */}
      <div className="flex items-center gap-4">
        {/* Nút thông báo */}
        <button
          type="button"
          className="relative p-2 text-[#7C7267] hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-full transition-colors cursor-pointer"
          title="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8E2813] rounded-full ring-2 ring-white" />
        </button>

        {/* Khung chứa Avatar & Dropdown */}
        <div
          className="relative pl-3 border-l border-[#EFE9DF]"
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 -m-1.5 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer select-none"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {/* Avatar tròn với chữ cái viết tắt */}
            <div className="w-8 h-8 rounded-full bg-[#342A27] text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
              {getAvatarInitials(currentUser?.name)}
            </div>

            {/* Tên & Quyền động */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#26201E] leading-tight">
                {currentUser?.name || "Nguyễn Anh Tuấn"}
              </span>
              <span className="text-[10px] text-[#8A8175] font-medium">
                {currentUser?.role === "ADMIN" ? "Quản trị viên" : "Quản lý"}
              </span>
            </div>

            {/* Mũi tên xoay khi mở */}
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#8A8175] ml-0.5 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-[#8E2813]" : ""
              }`}
            />
          </button>

          {/* Menu Dropdown đổ xuống khi click */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2.5 w-52 bg-white rounded-xl shadow-lg border border-[#EAE3D6] py-1.5 z-50">
              {/* Thông tin user trong menu */}
              <div className="px-3.5 py-2 border-b border-[#F5EFE6] mb-1">
                <p className="text-xs font-bold text-[#26201E]">
                  {currentUser?.name || "Nguyễn Anh Tuấn"}
                </p>
                <p className="text-[11px] text-[#8A8175] truncate">
                  {currentUser?.email || "admin@casacozy.vn"}
                </p>
              </div>

              {/* Dòng 1: Thông tin tài khoản */}
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#3C342F] hover:bg-[#FAF7F2] hover:text-[#8E2813] transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-[#7C7267]" />
                <span>Thông tin tài khoản</span>
              </button>

              {/* Dòng 2: Đăng xuất */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#C23924] hover:bg-[#FDF2F0] transition-colors cursor-pointer text-left disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-[#C23924]" />
                <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thông Tin Tài Khoản & Đổi Mật Khẩu */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </header>
  );
}
