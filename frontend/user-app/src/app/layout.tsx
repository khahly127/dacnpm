import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TableSessionProvider } from '@/context/TableSessionContext';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: 'Casa Cozy - Bếp ấm & Bàn ăn | eMenu',
  description: 'Thực đơn điện tử gọi món tại bàn nhà hàng Casa Cozy Bistro',
  icons: {
    icon: '/images/logo.jpg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased overflow-hidden`}>
      <body className="h-full h-[100dvh] max-h-screen bg-[#EAE3D9] text-[#231F20] flex flex-col font-sans overflow-hidden select-none">
        <TableSessionProvider initialTable="05">
          <CartProvider>
            {children}
          </CartProvider>
        </TableSessionProvider>
      </body>
    </html>
  );
}
