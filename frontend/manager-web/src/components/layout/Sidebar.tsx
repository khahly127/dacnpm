'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Armchair,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'dashboard', name: 'Bảng điều khiển', href: '/', icon: LayoutDashboard },
  { id: 'orders', name: 'Đơn hàng', href: '/order', icon: ClipboardList },
  { id: 'tables', name: 'Bàn ăn', href: '/table', icon: Armchair },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-white border-r border-[#EFE9DF] flex flex-col justify-between shrink-0 select-none overflow-y-auto sticky top-0">
      <div>
        {/* Logo & Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-[#F5EFE6]">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs shrink-0 border border-[#EAE3D6] bg-white">
            <Image
              src="/images/logo.jpg"
              alt="Casa Cozy Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="text-sm font-black tracking-wider text-[#26201E] uppercase">
              CASA COZY
            </div>
            <div className="text-[10px] tracking-wider text-[#8A8175] font-semibold uppercase">
              Bistro Management
            </div>
          </div>
        </div>

        {/* Tiêu đề nhóm */}
        <div className="px-5 pt-5 pb-2 text-[11px] font-bold text-[#A89E92] tracking-wider uppercase">
          QUẢN TRỊ VẬN HÀNH
        </div>

        {/* Danh sách menu - Chỉ gồm Bảng điều khiển, Đơn hàng, Bàn ăn */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FBEFE9] text-[#8E2813] font-bold shadow-xs border-l-4 border-[#8E2813]'
                    : 'text-[#69635A] hover:bg-[#FAF7F2] hover:text-[#26201E]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#8E2813]' : 'text-[#69635A]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
