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
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight text-blue-600">
              MyData Work Sync
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">일정 등록</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">대시보드</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
