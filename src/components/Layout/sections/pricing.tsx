"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Router } from "lucide-react";
import { useRouter } from "next/navigation";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number | string;
  description: string;
  buttonText: string;
  benefitList: string[];
  duration?: string; // e.g., "per month", "per year"
}

const plans: PlanProps[] = [
  {
    title: "آزمایشی",
    popular: 0,
    price: "رایگان!",
    description:
      "برای یک ماه به طور کامل از منو استفاده کنید و بعدا اگر راضی بودید اشتراک تهیه کنید.",
    buttonText: "شروع آزمایش رایگان",
    duration: "یک ماه",
    benefitList: ["تمامی امکانات پلن طلایی، برای یک ماه!"],
  },
  // {

  //   popular: 1,

  //   description:

  //   benefitList: [

  //   ],
  // },
  {
    title: "نقره ای",
    popular: 0,
    price: "3 میلیون تومان",
    duration: "سه ماه",
    description:
      "با اشتراک نقره ای به امکانات پایه دسترسی داشته باشید و منوی خود را مدیریت کنید.",
    buttonText: "شروع اشتراک نقره ای",
    benefitList: [
      "نمایش نام و لوگو فروشگاه",
      "بی‌نهایت آیتم و دسته‌بندی برای افزودن",
      "نمایش قیمت هر آیتم",
      "نمایش با تم انتخابی شما",
      "نمایش عکس و توضیحات هر آیتم + قیمت محصول",
      "تغییر منو بدون تغییر QR Code",
      "طراحی اختصاصی شما QR code",
      "نمایش لیست همه آیتم‌های منو",
      "نمایش بازدید روزانه منو (نمودار)",
      "اضافه، ویرایش و حذف دسته‌بندی‌ها/آیتم‌ها",

      "حذف یا جابجایی دسته‌بندی‌ها یا آیتم‌ها",
      "امکان قیمت‌گذاری چندگانه",
      "جابجایی آیتم‌ها و دسته‌ها به‌صورت Drag & Drop",
    ],
  },
];

export const PricingSection = () => {
  const router = useRouter();
  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        قیمت ها
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4" dir="rtl">
        دسترسی نامحدود داشته باشید.
      </h2>

      <h3
        className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14"
        dir="rtl"
      >
        همین الان اشتراک تهیه کنید و به امکانات کامل پلتفرم دسترسی داشته باشید.
      </h3>

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4"
        dir="rtl"
      >
        {plans.map(
          ({
            title,
            popular,
            price,
            description,
            buttonText,
            benefitList,
            duration,
          }) => (
            <Card
              key={title}
              className={cn(
                "flex flex-col",
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
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
                  onClick={() => router.push("/login")}
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};
