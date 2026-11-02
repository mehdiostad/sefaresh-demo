import React from "react";

interface CouponStatusBadgeProps {
  couponStatus: Coupon["status"];
}
const badgeStyle: Record<Coupon["status"], string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  used: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  reserved: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  expired: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabel: Record<Coupon["status"], string> = {
  active: "فعال",
  used: "استفاده‌شده",
  reserved: "منتظر تایید مدیر",
  expired: "منقضی‌شده",
};
const CouponStatusBadge = ({ couponStatus }: CouponStatusBadgeProps) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 justify-start rounded-full text-xs font-medium border ${badgeStyle[couponStatus]}`}
    >
      {statusLabel[couponStatus]}
    </div>
  );
};

export default CouponStatusBadge;
