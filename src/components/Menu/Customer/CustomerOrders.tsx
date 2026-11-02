"use client";
import { imageUrl } from "@/demo/seed";
import { StatusBadge } from "@/components/Dashboard/Orders/OrdersLive/OrdersTable";
import Image from "next/image";
import Link from "next/link";
import separate from "@/utils/number";
import {
  IconCalendar,
  IconPhone,
  IconStar,
  IconTable,
  IconUser,
} from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CustomerOrders({ orders }: { orders: OrderEvent[] }) {
  return (
    <div className="flex flex-col gap-4">
      {orders.length === 0 ? (
        <div>
          <p className="font-bold"> تا به حال سفارشی ثبت نکرده اید!</p>
          <p className="font-thin text-sm">
            با کلیک بر روی آیتم دلخواه، آن را یادداشت کنید و از طریق دفترچه
            یادداشت تان (آیکن بالا سمت چپ) برای ثبت سفارش اقدام فرمایید.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="border flex px-2 flex-col border-white/10 bg-gradient-to-br from-slate-700 to-gray-900 text-white shadow-lg rounded-2xl"
          >
            {/* Header */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/${order.username}`} target="_blank">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full p-[2px] animate-spin-slow bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,purple,red)]"></div>
                      <div className="absolute inset-[2px] rounded-full bg-black"></div>
                      <Image
                        src={imageUrl(order.user?.menuLogo, "userLogos")}
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-full relative z-10"
                      />
                    </div>
                  </Link>
                  <div>
                    <Link
                      className="font-semibold  flex items-center gap-1"
                      href={`/${order.username}`}
                      target="_blank"
                    >
                      {order.user?.menuName}
                      <ArrowUpRight
                        size={16}
                        className="opacity-70 text-blue-500"
                      />
                    </Link>
                    <p className="text-xs text-gray-400">
                      شماره سفارش: {separate(order.orderId).replaceAll(",", "")}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 text-sm">
              <Separator className="bg-white/10" />
              <div className="grid gap-2 bg-white/10 p-2 rounded-lg">
                <div className="flex w-full justify-between">
                  <p>{order.customer.name}</p>
                  <IconUser color="gray" size={20} />
                </div>
                {order.customer.phone && (
                  <div className="flex w-full justify-between">
                    <p>{separate(order.customer.phone).replaceAll(",", "")}</p>
                    <IconPhone color="gray" size={20} />
                  </div>
                )}
                {order?.customer?.table && (
                  <div className="flex w-full justify-between">
                    <p className="flex gap-2">
                      <span className="font-medium">میز:</span>{" "}
                      {separate(order.customer.table)}
                    </p>
                    <IconTable color="gray" size={20} />
                  </div>
                )}
                {typeof order.earnedPoints === "number" && (
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      {Number(order?.earnedPoints) === 0 ? (
                        <p className="text-xs text-gray-300">هنوز امتیازی برای این سفارش ثبت نشده</p>
                      ) : (
                        <span>
                          <span className="font-medium">امتیاز:</span>{" "}
                          <Badge className="animate-pulse">
                            +{separate(order.earnedPoints)}
                          </Badge>
                        </span>
                      )}
                    </div>
                    <IconStar color="gray" size={20} />
                  </div>
                )}
                <div className="flex w-full justify-between">
                  <span>
                    {new Date(order.createdAt).toLocaleString("fa-IR")}
                  </span>
                  <IconCalendar color="gray" size={20} />
                </div>
              </div>

              {order.note && (
                <div className="italic text-gray-300 border-r-2 border-gray-600 pr-3">
                  یادداشت شما: {" " + order.note}
                </div>
              )}

              <div className="bg-white/10 p-2 rounded-lg">
                <span className="font-medium block mb-1">آیتم‌ها:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-300 max-h-24 overflow-auto">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.free ? (
                        <span className="text-green-500 bg-green-900 rounded-lg py-1">
                          {item.name} - هدیه!
                        </span>
                      ) : (
                        <>
                          {item.name} - {item.qty} عدد
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex w-full justify-between items-center px-4 py-3">
              <p>جمع کل:</p>
              <p className="font-bold text-lg text-yellow-400">
                {order.total.toLocaleString("fa-IR")} تومان
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
