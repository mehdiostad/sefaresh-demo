"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Info, Loader2 } from "lucide-react";

export default function LoyaltyRules({
  userId,
  loyalty,
  isActive,
}: {
  userId?: string;
  isActive: boolean;
  loyalty: any;
  refetchLoyalty?: () => void;
}) {
  const [pointRate, setPointRate] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loyalty?.pointRate) {
      setPointRate(loyalty.pointRate);
    }
  }, [loyalty]);

  const saveRule = async () => {
    if (Number(pointRate) < 1000) {
      toast.error(
        "حداقل مقدار باید ۱۰۰۰ تومان باشد (۱ امتیاز به ازای ۱۰۰۰ تومان)",
      );
      return;
    }
    if (Number(pointRate) > 100000) {
      toast.error(
        "حداکثر مقدار باید ۱۰۰هزار تومان باشد (۱ امتیاز به ازای ۱۰۰هزار تومان)",
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/loyalty/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pointRate }),
      });
      if (res.ok) {
        toast.success("قانون امتیازدهی ذخیره شد ✅");
      } else {
        toast.error("خطا در ذخیره قانون");
      }
    } catch (e) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md w-full flex flex-col gap-4" dir="rtl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            تنظیم قوانین امتیازدهی
          </CardTitle>
        </div>

        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          در این بخش مشخص می‌کنید که مشتریان شما به ازای هر مقدار خرید، چه تعداد
          امتیاز دریافت کنند. این امتیازها بعداً برای دریافت تخفیف یا آیتم
          رایگان استفاده می‌شوند.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">هر چند تومان = ۱ امتیاز</label>
          <Input
            value={pointRate}
            onChange={(e) => setPointRate(Number(e.target.value))}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            مثال: اگر مقدار <strong>10000</strong> وارد کنید، مشتری به ازای هر
            ۱۰هزار تومان خرید، ۱ امتیاز می‌گیرد.
          </p>
        </div>

        <Button
          onClick={saveRule}
          disabled={loading || !isActive}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال ذخیره...
            </span>
          ) : (
            "ذخیره قانون"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
