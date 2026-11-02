"use client";

import { useState } from "react";
import { toast } from "sonner";

interface SubmitOrderParams {
  username: string;
  items: OrderItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    table?: number;
  };
  note?: string;
  appliedCouponId?: string;
  baseTotal: number;
}

export function useSubmitOrder() {
  const [loading, setLoading] = useState(false);

  const submitOrder = async (params: SubmitOrderParams) => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("خطا در ثبت سفارش");

      toast.success("سفارش شما ثبت شد", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });

      return true;
    } catch (err: any) {
      toast.error(err.message, {
        style: { backgroundColor: "#ef4444", color: "white" },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitOrder,
  };
}
