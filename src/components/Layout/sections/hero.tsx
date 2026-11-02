"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
const dashboardDark = "/dashboard-dark.jpg";
const dashboardLight = "/dashboard-light.jpg";

export const HeroSection = () => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2 " dir="rtl">
            <span className="ml-2 text-primary">
              <Badge>Demo</Badge>
            </span>
            <span> نسخهٔ دموی بازسازی‌شده </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold" dir="rtl">
            <h1 className="flex flex-col gap-4">
              تجربه میزبانی مدرن با
             <div className="flex gap-2 justify-center items-center">
               <span className="text-transparent  bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                سفارش آنلاین
              </span>
              {/* <span>
                تجربه کنید.
              </span> */}
             </div>
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground" dir="rtl">
            {`این نسخهٔ دموی بازسازی‌شدهٔ پلتفرم مدیریت کافه و منوی دیجیتال سفارش آنلاین است. سرویس اصلی دیگر فعال نیست. اطلاعات مشتریان، سفارش‌ها و گزارش‌ها نمونه‌اند و هیچ پیامک یا پرداخت واقعی انجام نمی‌شود.`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
         

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link
                href="/cafe_elm"
                target="_blank"
              >
                مشاهدهٔ منوی کافه علم
              </Link>
            </Button>
               <Button className="w-5/6 md:w-1/4 font-bold group/arrow" onClick={()=> router.push("/dashboard")}>
              ورود به داشبورد دمو
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={
              theme === "light"
                ? dashboardLight
                : dashboardDark
            }
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
