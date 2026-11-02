"use client";

import {
  IconUserCircle,
  IconX,
  IconStar,
  IconGift,
  IconList,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CustomerOrders from "./CustomerOrders";
import AuthGate from "./Auth/AuthGate";

import CustomerPoints from "./CustomerPoints";
import CustomerCoupons from "./CustomerCoupons";
import { MenuItemProps } from "../MenuItem";

const tabData = [
  { value: "profile", label: "پروفایل", icon: IconUserCircle, locked: true },
  { value: "points", label: "امتیاز", icon: IconStar, locked: false },
  { value: "coupons", label: "کوپن‌ها", icon: IconGift, locked: false },
  { value: "orders", label: "سفارشات", icon: IconList, locked: false },
];

export default function CustomerAccount({
  iconColor,
  userData,
  menuItems,
}: {
  iconColor?: string;
  userData?: IDashboardUser;
  menuItems: MenuItemProps[];
}) {
  const [activeTab, setActiveTab] = useState("orders");
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTabClick = (tab: any) => {
    if (tab.locked) {
      toast("این بخش به زودی فعال می‌شود.", { style: { color: "black" } });
      return;
    }
    setActiveTab(tab.value);
  };
  useEffect(() => {
    if (
      status !== "authenticated" ||
      session?.user.role !== "customer" ||
      !open
    )
      return;

    setLoading(true);
    fetch(
      `/api/orders?phonenumber=${session.user.phone || ""}&includeUser=true`
    )
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [open, session, session?.user?.role, status]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div role="button" tabIndex={0} aria-label="حساب مشتری" className=" cursor-pointer">
          <IconUserCircle size={28} color={iconColor || "white"} strokeWidth={1.5}  />
        </div>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="pt-4 font-yekan p-4  focus:outline-none focus-visible:outline-none h-full bg-black/30 backdrop-blur-sm border-l border-white/20 flex flex-col"
        side="right"
      >
        <div className="text-white relative h-full flex flex-col">
          {(session?.user.role !== "customer" ||
            status === "unauthenticated") && (
            <SheetClose asChild>
              <button className="absolute top-0 left-0 z-50 rounded-full bg-red-600 flex items-center justify-center p-1 shadow-lg flex-shrink-0">
                <IconX size={14} color="white" />
              </button>
            </SheetClose>
          )}

          {status === "loading" ? (
            <>
              <div className="spinner"></div>
              <p className="text-white" dir="rtl">
                لطفا صبر کنید...
              </p>
            </>
          ) : (
            <AuthGate loading={loading}>
              <Tabs value={activeTab} className="w-full flex flex-col h-full">
                <div className="flex items-center gap-2 justify-between ">
                  {status === "authenticated" && (
                    <SheetClose asChild>
                      <button className="rounded-full bg-red-600 flex items-center justify-center p-1 shadow-lg flex-shrink-0">
                        <IconX size={14} color="white" />
                      </button>
                    </SheetClose>
                  )}
                  <div className="flex flex-1 w-full">
                    <TabsList className=" flex gap-1 border shadow-sm rounded-xl bg-white/10 h-12 text-white/70 ">
                      {tabData.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`flex flex-col items-center justify-center px-2  h-full ${
                            tab.locked ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleTabClick(tab)}
                        >
                          <tab.icon size={20} />
                          <span className="text-xs mt-1">{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-2">
                  <AnimatePresence mode="wait">
                    {activeTab === "orders" && (
                      <motion.div
                        dir="rtl"
                        key="orders"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4 h-full"
                      >
                        <CustomerOrders orders={orders || []} />
                      </motion.div>
                    )}

                    {activeTab === "points" && (
                      <motion.div
                        dir="rtl"
                        key="points"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4 h-full"
                      >
                        <CustomerPoints
                          userData={userData}
                          session={session}
                          rewards={
                            (userData?.loyalty?.rewards as IReward[]) || []
                          }
                        />
                      </motion.div>
                    )}
                    {activeTab === "coupons" && (
                      <motion.div
                        dir="rtl"
                        key="coupons"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4 h-full"
                      >
                        <CustomerCoupons
                          session={session}
                          userData={userData}
                          items={menuItems}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Tabs>
            </AuthGate>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
