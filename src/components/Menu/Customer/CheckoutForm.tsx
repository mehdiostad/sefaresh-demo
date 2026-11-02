"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ConfirmOrder from "./ConfirmOrder";
import { useSubmitOrder } from "@/hooks/useSubmitOrder";
import { useSelectionStore } from "@/stores/useSelectionStore";
import AuthGate from "./Auth/AuthGate";

interface CheckoutFormProps {
  username: string;
  items: OrderItem[];
  totalPrice: number;
  tax?: number;
  closeSheet: () => void;
  pointRate?: number;
  menuName: string;
  userAllItems: any[];
  isLoyaltyActive: boolean;
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const { data: session } = useSession();
  const { loading: submitLoading, submitOrder } = useSubmitOrder();
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);
  useEffect(() => {
    if (!session?.user?.id) return;
    setCouponLoading(true);
    fetch(`/api/coupons?customerId=${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCoupons(
          data.filter(
            (c: Coupon) =>
              c.status === "active" &&
              (c.expiresAt === null ||
                (c.expiresAt && new Date() < new Date(c.expiresAt)))
          )
        );
        setCouponLoading(false);
      })
      .catch(console.error);
  }, [session?.user?.id]);

  const handleConfirmOrder = async (formData: any, selectedCoupon?: any) => {
    if (!session || session.user.role !== "customer") return;
    const baseTotal =
      props.totalPrice + (props.tax ? props.tax * props.totalPrice : 0);

    let finalTotal = baseTotal;
    let appliedCouponId: string | undefined;

    if (selectedCoupon) {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: selectedCoupon.code,
          order: { items: props.items, totalPrice: baseTotal },
        }),
      });
      const data = await res.json();
      if (data.success) {
        finalTotal = data.order.totalPrice;
        appliedCouponId = selectedCoupon._id;
      }
    }
    let finalItems = [...props.items];
    if (formData.freeItem) {
      finalItems.push({
        id: formData.freeItem._id,
        name: formData.freeItem.itemName || formData.freeItem.name,
        qty: 1,
        price: 0,
        img: formData.freeItem.img,
        free: true,
      });
    }

    await submitOrder({
      username: props.username,
      total: finalTotal,
      baseTotal,
      items: finalItems,
      customer: {
        name: session.user.fullname,
        phone: session.user.phone,
        table: formData?.table,
      },
      note: formData?.note,
      appliedCouponId,
    });

    setOpen(false);
    useSelectionStore.getState().clearSelection();
    props.closeSheet();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ثبت سفارش</Button>
      </DialogTrigger>

      <AnimatePresence>
        <DialogContent dir="rtl" className="max-w-sm  overflow-auto rounded-xl font-yekan">
          <AuthGate>
            <ConfirmOrder
              {...props}
              session={session}
              onSubmit={handleConfirmOrder}
              loading={submitLoading}
              couponLoading={couponLoading}
              coupons={coupons}
              userAllItems={props.userAllItems}
              isLoyaltyActive={props.isLoyaltyActive}
            />
          </AuthGate>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
}
