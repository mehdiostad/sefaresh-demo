"use client";


export type ColCustomer = {
  fullname: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  earnedPoints: number;
  redeemedPoints: number;
  netPoints: number;
  history: {
    type: "earned" | "spent";
    points: number;
    rewardTitle?: string;
    rewardId?: string;
    createdAt: string;
  }[];
};


import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const columns: ColumnDef<ColCustomer>[] = [
  {
    accessorKey: "fullname",
    header: "نام مشتری",
    cell: ({ row }) => row.original.fullname || "—",
  },
  {
    accessorKey: "phone",
    header: "شماره تماس",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "totalOrders",
    header: "تعداد سفارش‌ها",
    cell: ({ row }) => row.original.totalOrders.toLocaleString("fa-IR"),
  },
  {
    accessorKey: "totalSpent",
    header: "مجموع خرید (تومان)",
    cell: ({ row }) => row.original.totalSpent.toLocaleString("fa-IR"),
  },
  {
    accessorKey: "netPoints",
    header: "امتیاز فعلی",
    cell: ({ row }) => (
      <span
        className={`font-semibold ${
          row.original.netPoints >= 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {row.original.netPoints}
      </span>
    ),
  },
  {
    id: "actions",
    header: "جزئیات",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const customer = row.original;

      return (
        <>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            مشاهده
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  تاریخچه امتیازهای {customer.fullname || "بدون نام"}
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-80 overflow-y-auto space-y-3 mt-2">
                {customer.history.length ? (
                  customer.history.map((h, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center text-sm border-b pb-1 ${
                        h.type === "earned"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <div>
                        {h.type === "earned" ? "کسب امتیاز" : "خرج امتیاز"}
                        {h.rewardTitle && ` - ${h.rewardTitle}`}
                      </div>
                      <div className="font-semibold">
                        {h.points > 0 ? "+" : ""}
                        {h.points} امتیاز
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(h.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    سابقه‌ای یافت نشد.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

