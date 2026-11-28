import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Casa Cozy Bistro - Quản Lý Nhà Hàng",
  description: "Hệ thống quản lý vận hành Casa Cozy Bistro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full bg-[#FAF7F2] text-[#26201E]">{children}</body>
    </html>
  );
}
