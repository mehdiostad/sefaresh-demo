"use client";

import LoyaltyCustomers from "@/components/Dashboard/Loyalty/LoyaltyCustomers/LoyaltyCustomers";
import LoyaltyRewards from "@/components/Dashboard/Loyalty/LoyaltyRewards/LoyaltyRewards";
import LoyaltyRules from "@/components/Dashboard/Loyalty/LoyaltyRules/LoyaltyRules";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardData } from "@/stores/useDashboardData";
import { motion } from "framer-motion";
import { Trophy, Users, Settings, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoyaltyPage() {
  const user = useDashboardData((state) => state.user);

  const steps = [
    {
      icon: <Settings className="h-6 w-6 text-indigo-500" />,
      title: "تنظیم قوانین",
      desc: "مشخص کنید هر چند تومان = ۱ امتیاز",
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "تعریف جوایز",
      desc: "تخفیف یا آیتم رایگان برای مشتریان تعریف کنید",
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "مدیریت مشتریان",
      desc: "امتیاز مشتریان را ببینید و وفاداری را بسنجید",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  useEffect(() => {
    const fetchUserLoyaltyStatus = async () => {
      const res = await fetch(`/api/loyalty/rules/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setIsActive(data.isActive);
      }
    };
    if (user?.id) fetchUserLoyaltyStatus();
  }, [user]);
  const toggleActive = async (checked: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/loyalty/rules/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      });
      if (res.ok) {
        setIsActive(checked);
        const revalidateRes = await fetch(`/api/revalidates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user?.username,
          }),
        });
        if (!revalidateRes.ok) {
          console.error("Failed to revalidate path");
        }
        toast.success(
          checked
            ? "سیستم امتیازدهی فعال شد ✅"
            : "سیستم امتیازدهی غیرفعال شد ❌",
        );
      } else {
        toast.error("خطا در تغییر وضعیت سیستم");
      }
    } catch (e) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          سیستم امتیاز و جوایز 🎯
        </h1>
        <p className="text-muted-foreground">
          مشتریان شما با هر خرید امتیاز می‌گیرند و با این امتیازها می‌توانند
          جوایز ویژه دریافت کنند. این یک بازی جذاب برای افزایش فروش شماست!
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="hover:shadow-md transition-shadow flex justify-center items-center">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                {s.icon}
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {isActive === null ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Switch
            dir="ltr"
            checked={isActive}
            onCheckedChange={toggleActive}
            disabled={loading}
          />
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <p
            className={`mt-2 text-sm font-medium ${
              isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isActive
              ? "سیستم امتیازدهی فعال است ✅"
              : "سیستم امتیازدهی غیرفعال است ❌"}
          </p>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="rules" className="w-full mt-6">
        <TabsList
          className={cn(
            "justify-center grid grid-cols-2 w-full",
            isActive && "grid-cols-3",
          )}
        >
          <TabsTrigger value="rules">قوانین</TabsTrigger>
          <TabsTrigger value="rewards">جوایز</TabsTrigger>
          {isActive && (
            <TabsTrigger value="customers">امتیازات مشتریان</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <LoyaltyRules
            isActive={isActive || false}
            userId={user?.id}
            loyalty={user?.loyalty}
          />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <LoyaltyRewards
            userId={user?.id}
            username={user?.username || ""}
            rewards={user?.loyalty.rewards || []}
            isLoyaltyActive={isActive || false}
          />
        </TabsContent>

        {isActive && (
          <TabsContent value="customers" className="mt-6">
            <LoyaltyCustomers userId={user?.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
