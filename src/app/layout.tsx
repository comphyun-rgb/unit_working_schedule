import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyData Work Sync",
  description: "마이데이터유닛 일일 근무현황 관리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <header className="w-full bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="w-full px-4 md:px-12 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="font-bold text-lg md:text-xl tracking-tight text-blue-600 shrink-0">
              MyData Work Sync
            </Link>
            <nav className="flex gap-4 shrink-0">
              <Link href="/" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">일정 등록</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">대시보드</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full p-4 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
