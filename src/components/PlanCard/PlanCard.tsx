"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

type Plan = "silver" | "gold";

const planPrices = {
  silver: 3000000, // toman
  gold: 7000000,
};

export default function PlanCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (plan: Plan) => {
    setLoading(true);

    try {
      const res = await fetch("/api/zibal/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan,
          amount: planPrices[plan],
          orderId: `${plan}-${Date.now()}`,
          description: `خرید پلن ${plan}`,
          callbackUrl: `${window.location.origin}/dashboard/payment/callback?plan=${plan}`,
        }),
      });

      const data = await res.json();

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert("خطا در دریافت لینک پرداخت");
        console.error(data.error);
      }
    } catch (err) {
      alert("خطای غیرمنتظره در خرید");
    } finally {
      setLoading(false);
    }
  };
  enum PopularPlan {
    NO = 0,
    YES = 1,
  }
  interface PlanProps {
    title: string;
    plan: Plan;
    popular: PopularPlan;
    price: number | string;
    description: string;
    buttonText: string;
    benefitList: string[];
    duration?: string; // e.g., "per month", "per year"
  }

  const plans: PlanProps[] = [
    // {

    //   plan: "gold",
    //   popular: 1,

    //   description:

    //   benefitList: [

    //   ],
    // },
    {
      title: "نقره ای",
      plan: "silver",
      popular: 0,
      price: "3 ملیون تومان",
      duration: "سه ماه",
      description:
        "با اشتراک نقره ای به امکانات پایه دسترسی داشته باشید و منوی خود را مدیریت کنید.",
      buttonText: "شروع اشتراک نقره ای",
      benefitList: [
        "نمایش نام و لوگو فروشگاه",
        "نمایش قیمت هر آیتم",
        "نمایش با تم انتخابی شما",
        "نمایش عکس و توضیحات هر آیتم + قیمت محصول",
        "تغییر منو بدون تغییر QR Code",
        "امکان محاسبه بازدید روزانه بازدیدکننده‌ها",
        "دریافت رایگان QR code",
        "نمایش لیست همه آیتم‌های منو",
        "نمایش بازدید روزانه منو (نمودار)",
        "نمایش آیتم‌های پرفروش",
        "بی‌نهایت آیتم و دسته‌بندی برای افزودن",
        "اضافه، ویرایش و حذف دسته‌بندی‌ها/آیتم‌ها",
        "امکان تغییر قیمت به‌صورت دسته‌جمعی",
        "حذف یا جابجایی دسته‌بندی‌ها یا آیتم‌ها",
        "امکان قیمت‌گذاری چندگانه",
        "جابجایی آیتم‌ها و دسته‌ها به‌صورت Drag & Drop",
      ],
    },
  ];
  return (
    <div className="border p-4 rounded mx-auto w-full ">
      <div className="flex gap-8 justify-center ">
        {plans.map(
          ({
            title,
            popular,
            price,
            description,
            buttonText,
            benefitList,
            duration,
            plan,
          }) => (
            <Card
              key={title}
              className={cn(
                "flex flex-col",
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary "
                  : "",
              )}
              dir="rtl"
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div dir="rtl">
                  <span className="text-3xl font-bold">{price}</span>
                  <span className="text-muted-foreground"> /{duration}</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex ">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                  onClick={() => handlePurchase(plan)}
                >
                  {loading ? "در حال انتقال..." : buttonText}
                </Button>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
