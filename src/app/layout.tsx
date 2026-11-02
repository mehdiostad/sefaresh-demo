// src/app/layout.tsx
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
//@ts-ignore
import "./globals.css";
import { cn } from "@/lib/utils";
import DemoRuntime from "@/demo/Runtime";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "سفارش آنلاین | دموی بازسازی‌شده",
  description: "نسخهٔ دموی بازسازی‌شدهٔ سیستم مدیریت کافه و منوی دیجیتال؛ سرویس اصلی دیگر فعال نیست.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" className="font-yekan" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background font-yekan")}
      >
        <DemoRuntime>{children}</DemoRuntime>
      </body>
    </html>
  );
}
