"use client";
import { imageUrl } from "@/demo/seed";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Percent, Info, Clock, Star } from "lucide-react";
import Image from "next/image";
import { MenuItemProps } from "../MenuItem";
import { cn } from "@/lib/utils";

export default function CustomerCoupons({
  session,
  userData,
  items,
}: {
  session: any;
  userData: any;
  items?: MenuItemProps[];
}) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch(`/api/coupons?customerId=${session.user.id}`);
        if (!res.ok) throw new Error("خطا در دریافت کوپن‌ها");
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCoupons();
  }, [session.user.id]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        <p>در حال دریافت کوپن‌ها...</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col gap-6"
      dir="rtl"
    >
      {/* 🪄 Intro Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-400/5 border border-amber-500/20 backdrop-blur-sm text-amber-100 shadow-[0_0_15px_rgba(255,200,0,0.2)]"
      >
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-1 text-amber-300">
              سیستم امتیاز و کوپن 🎁
            </h3>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              با هر سفارش امتیاز بگیر و بعد از بخش امتیازات اون‌ها رو به کوپن
              تبدیل کن! کوپن‌ها توی سفارش بعدی قابل استفاده‌ان.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🎟️ No Coupons */}
      {coupons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-10 rounded-2xl bg-white/10 backdrop-blur-md text-gray-300 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
        >
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Gift className="w-12 h-12 text-amber-400 mb-2 drop-shadow-[0_0_8px_rgba(255,200,0,0.5)]" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white mb-1">
            هنوز کوپنی نداری!
          </h2>
          <p className="text-sm text-gray-400">
            با جمع کردن امتیاز، می‌تونی کوپن‌های تخفیف یا هدیه بگیری 😍
          </p>
        </motion.div>
      )}

      {/* 🎫 Coupons List */}
      <div className="grid gap-4">
        {coupons.map((coupon) => {
          const item = items?.find((i) => i._id === coupon.value);

          const badgeStyle: Record<Coupon["status"], string> = {
            active: "bg-green-500/20 text-green-400 border-green-500/30",
            used: "bg-gray-500/20 text-gray-300 border-gray-500/30",
            reserved: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            expired: "bg-red-500/20 text-red-400 border-red-500/30",
          };

          const statusLabel: Record<Coupon["status"], string> = {
            active: "فعال",
            used: "استفاده‌شده",
            reserved: "منتظر تایید مدیر",
            expired: "منقضی‌شده",
          };
          if (coupon.status !== "used" && coupon.expiresAt && new Date(coupon?.expiresAt) < new Date())
            coupon.status = "expired";

          return (
            <motion.div
              key={coupon._id}
              className={cn(
                "relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 border border-white/10 shadow-lg transition-all duration-500 z-20 will-change-transform",
                coupon.status === "reserved" && "border-blue-500"
              )}
            >
              {/* 🌈 External animated border for active coupons */}
              {coupon.status === "active" && (
                <div className="absolute -inset-[1px] rounded-2xl pointer-events-none overflow-hidden z-0">
                  <div className="absolute inset-0 rounded-2xl p-[2px] animate-spin-slow bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,purple,red)] will-change-transform"></div>
                  <div className="absolute inset-[3px] rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b]"></div>
                </div>
              )}

              {/* 🧱 Coupon Content */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-3 text-white w-full">
                  {/* 🌟 Rotating 3D Icon */}
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={
                      coupon.status === "active"
                        ? {
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                          }
                        : {}
                    }
                    className="p-3 bg-white/10 rounded-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10 perspective-[1000px]"
                  >
                    {coupon.type === "discount" ? (
                      <Percent
                        className={cn(
                          "w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]",
                          coupon.status === "used"
                            ? "text-gray-500"
                            : coupon.status === "reserved"
                            ? "text-blue-400"
                            : ""
                        )}
                      />
                    ) : (
                      <Gift className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]" />
                    )}
                  </motion.div>

                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg font-bold">
                      {coupon.type === "freeItem"
                        ? "آیتم هدیه از " + userData?.menuName
                        : "تخفیف ویژه از " + userData?.menuName}
                    </h3>

                    <p className="text-sm text-gray-300">
                      {coupon.type === "discount"
                        ? `تخفیف ${coupon.value}% روی سفارش بعدی!`
                        : `آیتم رایگان: ${item?.itemName}`}
                    </p>
                    <p className="text-sm text-gray-300">
                      کد: {" " + coupon.code + " "}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex justify-between items-center w-full gap-2 text-sm text-gray-300">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 justify-start rounded-full text-xs font-medium border ${
                      badgeStyle[coupon.status]
                    }`}
                  >
                    {statusLabel[coupon.status]}
                  </div>
                  {coupon.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        انقضا:{" "}
                        {new Date(coupon.expiresAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 🖼️ Free Item Preview */}
              {coupon.type === "freeItem" && item?.img && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 rounded-xl overflow-hidden border border-white/10 relative z-30"
                >
                  <div className="flex items-center gap-3 bg-white/5 p-3">
                    <Image
                      src={imageUrl(item.img, "items")}
                      alt={item.itemName}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-white">
                        {item.itemName}
                      </h4>
                      {item.desc && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
