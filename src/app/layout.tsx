import type { Metadata, Viewport } from 'next';
import './globals.css';
import CustomCursor from '@/components/shared/CustomCursor';

export const metadata: Metadata = {
  title: 'Nguyen Duc Anh — Portfolio',
  description: 'Frontend & Fullstack Developer Portfolio inspired by Editorial Luxury aesthetics.',
};

export const viewport: Viewport = {
  themeColor: '#141414',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-[#141414] text-[#f5f5f5] antialiased selection:bg-[#f1f505] selection:text-black">
        {/* Film Grain Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {/* Global Custom Cursor for ALL Pages */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
