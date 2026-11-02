"use client";

import { useEffect, useState } from "react";
import { DEMO_CHANGE_EVENT } from "@/demo/browser";
import { getPusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";
import separate from "@/utils/number";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns-jalali";

export default function OrdersLive({ ownerId }: { ownerId: string }) {
  const [orders, setOrders] = useState<OrderEvent[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?username=${ownerId}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data: OrderEvent[] = await res.json();
        setOrders(data.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
    window.addEventListener(DEMO_CHANGE_EVENT, fetchOrders); window.addEventListener("storage", fetchOrders);
    return () => { window.removeEventListener(DEMO_CHANGE_EVENT, fetchOrders); window.removeEventListener("storage", fetchOrders); };
  }, [ownerId]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channelName = `private-orders-${ownerId}`;
    const channel = pusher.subscribe(channelName);

    const handler = (data: OrderEvent) => {
      setOrders((prev) => [data, ...prev.filter(o => o._id !== data._id)].slice(0, 10));

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("سفارش جدید", {
            body: `${data.customer?.name || "مشتری"} | میز ${
              data.customer?.table || "-"
            }`,
          });
        }
      }

      new Audio("/audio/Ding.wav").play().catch(() => {});
      toast("سفارش جدید اضافه شد ✅");
    };

    channel.bind("new-order", handler);

    return () => {
      channel.unbind("new-order", handler);
      pusher.unsubscribe(channelName);
    };
  }, [ownerId]);

  return (
    <div>
      <div className="flex mb-2 justify-center items-center font-medium  sticky top-0 bg-card-foreground/70 text-card text-sm  py-4 px-2 backdrop-blur-lg  rounded-lg z-20 ">
        آخرین سفارشات آنلاین
      </div>
      <div className="flex flex-col gap-4">
        <ol className="flex flex-col gap-2">
          {orders.map((o) => (
            <li key={o.orderId} className="p-3 rounded-xl border">
              <div className="text-sm opacity-90 flex justify-between">
                <span>{o?.createdAt && format(o.createdAt, "Pp")}</span>
                <Badge variant={"destructive"}>سفارش جدید!</Badge>
              </div>
              <div className="font-medium">
                {o.customer?.name || "مشتری"} (میز {o.customer?.table || "-"})
              </div>
              {o.customer?.phone && (
                <div className="flex gap-2">
                  <span>شماره تماس:</span>
                  <span>{o.customer.phone}</span>
                </div>
              )}
              <div className="my-2 space-y-1">
                {o.items.map((i, idx) => (
                  <div key={`${i.name}-${idx}`}>
                    {i.name} به تعداد {separate(i.qty)} عدد
                  </div>
                ))}
                {o.note && (
                  <div>
                    <span>یادداشت مشتری: </span>
                    <span>{o.note}</span>
                  </div>
                )}
              </div>
              <div className="font-bold">{o.total.toLocaleString()} تومان</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
