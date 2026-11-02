"use client";
import { useEffect } from "react";
import { resetDemo } from "@/demo/browser";
export default function ResetDemoPage() {
  useEffect(() => { resetDemo(); }, []);
  return <p className="p-8 font-yekan" dir="rtl">در حال بازنشانی داده‌های نمونهٔ این مرورگر...</p>;
}
