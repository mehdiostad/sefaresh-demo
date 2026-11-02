"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconStar,
  IconGift,
  IconArrowDown,
  IconPlus,
  IconMinus,
  IconTruckLoading,
  IconCaretUpFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CustomerPoints({
  userData,
  rewards,
  session,
}: {
  userData: IDashboardUser | undefined;
  rewards?: IReward[];
  session: any;
}) {
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pointsByCafeData, setPointsByCafeData] = useState<any[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/loyalty/customer/${session.user.id}`);
        if (!res.ok) throw new Error("خطا در گرفتن امتیاز مشتری");

        const data = await res.json();
        const cafes = data.pointsByCafe || [];
        setPointsByCafeData(cafes);

        const redeemedIds: string[] = cafes
          .flatMap((p: any) => p.history || [])
          .filter((h: any) => h.type === "spent" && h.rewardId)
          .map((h: any) => h.rewardId.toString());

        setRedeemedRewards(redeemedIds);
      } catch (err) {
        console.error("Error fetching points:", err);
        toast.error("خطا در دریافت امتیاز");
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [session]);

  const cafePoints =
    pointsByCafeData.find(
      (p) => p.userId?.toString() === userData?.id?.toString()
    ) || {};
  const customerPoints = cafePoints.points || 0;
  const history = cafePoints.history || [];
  const menuName = userData?.menuName || "این مکان";

  const handleRedeem = async (rewardId: string) => {
    try {
      setLoadingId(rewardId);

      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: session?.user?.id,
          userId: userData?.id,
          rewardId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Redeem failed");
        return;
      }

      setPointsByCafeData((prev) =>
        prev.map((p) =>
          p.userId?.toString() === userData?.id?.toString()
            ? {
                ...p,
                points: data.newPoints,
                history: [
                  {
                    type: "spent",
                    points: -data.redemption.pointsUsed,
                    rewardTitle: data.redemption.rewardTitle,
                    rewardId: data.redemption.rewardId,
                    createdAt: new Date().toISOString(),
                  },
                  ...(p.history || []),
                ],
              }
            : p
        )
      );

      setRedeemedRewards((prev) => [...prev, rewardId]);

      toast.success(`🎉 تبریک! ${data.redemption.rewardTitle}  به کوپن های شما اضافه شد.`, {
        style: { backgroundColor: "green" },
      });
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور", {
        style: { backgroundColor: "red" },
      });
    } finally {
      setLoadingId(null);
    }
  };
  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        <p>در حال دریافت امتیازها...</p>
      </div>
    );

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 h-full"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl rounded-2xl p-5 flex items-center justify-between text-black",
          !userData?.loyalty.isActive &&
            "bg-gradient-to-br from-slate-400 to-gray-300"
        )}
      >
        <div>
          {userData?.loyalty.isActive ? (
            <>
              <p className="text-sm opacity-80">
                موجودی امتیاز شما در {menuName}
              </p>
              <motion.p
                key={customerPoints}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-extrabold"
              >
                {customerPoints.toLocaleString("fa-IR")}
              </motion.p>
            </>
          ) : (
            <p>سیستم امتیازدهی در {" " + menuName + " "} فعال نیست.</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="mx-2 bg-black rounded-full p-1 flex items-center justify-center shadow-xl"
        >
          <IconStar
            size={24}
            className={cn(
              "text-yellow-400",
              !userData?.loyalty.isActive && "text-white"
            )}
          />
        </motion.div>
      </motion.div>

      <div>
        <h3 className="text-white/90 font-semibold flex items-center gap-2 mb-2">
          <IconArrowDown size={18} />
          تاریخچه امتیازات شما در  {menuName}
        </h3>
        <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
          {history.length ? (
            history.map((h: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 rounded-lg p-2 flex justify-between items-center text-white/80"
              >
                <div className="flex items-center gap-2">
                  {h.type === "earned" ? (
                    <IconCaretUpFilled size={16} className="text-green-400" />
                  ) : (
                    <IconCaretDownFilled size={16} className="text-red-400" />
                  )}
                  <span className="text-sm">
                    {h.points > 0 ? (
                      <span className="text-green-400">+{h.points}</span>
                    ) : (
                      <span className="text-red-400">{h.points}</span>
                    )}{" "}
                    امتیاز
                    {h.rewardTitle && ` (${h.rewardTitle})`}
                  </span>
                </div>
                <span className="text-xs">
                  {new Date(h.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-white/60 text-sm">
              با ثبت{" "}
              <strong className="bg-gradient-to-r from-[#D247BF] to-primary  bg-clip-text">
                سفارش‌آنلاین
              </strong>{" "}
              امتیاز دریافت کنید و از جوایز مختلف بهره مند شوید.
            </p>
          )}
        </div>
      </div>

      {userData?.loyalty.isActive && (
        <div>
          <h3 className="text-white/90 font-semibold flex items-center gap-2 mb-2">
            <IconGift size={18} />
            جوایز قابل دریافت از {" " + menuName}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {rewards?.length ? (
              rewards.map((r) => {
                const progress = Math.min(
                  (customerPoints / r.requiredPoints) * 100,
                  100
                );
                const canRedeem = customerPoints >= r.requiredPoints;
                const alreadyRedeemed = redeemedRewards.includes(r._id);
                if (r.isActive)
                  return (
                    <motion.div
                      key={r._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 rounded-xl p-4 shadow-lg flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center text-white/90">
                        <span>{r.title}</span>
                        <span className="text-sm text-yellow-400">
                          {r.type === "discount"
                            ? `تخفیف ${r.value}%`
                            : "آیتم رایگان"}
                        </span>
                      </div>
                      {alreadyRedeemed ? (
                        <div className=" flex flex-col gap-2" dir="rtl">
                          <span className="text-green-400  font-semibold">
                            ✅ این جایزه به کوپن تبدیل شد
                          </span>
                          <span className="text-xs font-extralight">
                            میتوانید از بخش کوپن ها وضعیت این جایزه را ببینید!
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {r.expiresAt && (
                            <span>
                              انقضا:{" "}
                              {" " +
                                new Date(r?.expiresAt).toLocaleDateString(
                                  "fa-IR"
                                )}
                            </span>
                          )}
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">
                              نیاز به {r.requiredPoints.toLocaleString("fa-IR")}{" "}
                              امتیاز
                            </span>
                            <Button
                              size="sm"
                              variant={canRedeem ? "default" : "secondary"}
                              disabled={
                                !canRedeem || loadingId === r._id || !r.isActive
                              }
                              onClick={() => handleRedeem(r._id)}
                            >
                              {loadingId === r._id
                                ? "در حال تبدیل..."
                                : r.isActive
                                ? "تبدیل به کوپن"
                                : "غیر فعال است"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
              })
            ) : (
              <p className="text-white/60 text-sm">
                هنوز جایزه ای در {" " + menuName + " "} ثبت نشده :(
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
