type CouponType = "discount" | "freeItem";
type CouponSource = "loyalty" | "campaign";

interface Coupon {
  _id: string;
  code: string;
  customerId?: string;
  userId: string;
  rewardId?: string;
  source: CouponSource;
  type: CouponType;
  value: number | string;
  status: "active" | "reserved" | "used" | "expired";
  isActive: boolean;
  usedAt?: string;
  expiresAt?: string;
  createdAt: string;
}