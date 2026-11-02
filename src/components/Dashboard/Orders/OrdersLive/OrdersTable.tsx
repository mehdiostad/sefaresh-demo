"use client";

// --- helpers
function isCouponObject(c: unknown): c is Coupon {
  return (
    !!c && typeof c === "object" && "type" in (c as any) && "code" in (c as any)
  );
}

function formatCouponValue(coupon: Coupon): string {
  if (coupon.type === "freeItem") return "آیتم رایگان";
  if (typeof coupon.value === "string") return coupon.value;
  if (typeof coupon.value === "number") return `${coupon.value}%`;
  return "-";
}

function getFreeItemFromOrder(coupon: Coupon) {
  const menuItems = useDashboardData((s) => s.fullMenu).flatMap((c) => c.items);
  if (coupon.type !== "freeItem") return null;
  const freeId = String(coupon.value);
  const it = menuItems.find((i) => String(i._id) === freeId) as MenuItemProps;
  return it || null;
}

function formatFaDate(s?: string) {
  return s ? new Date(s).toLocaleString("fa-IR") : "-";
}

function calcSavings(baseTotal?: number, total?: number) {
  const b = Number(baseTotal || 0);
  const t = Number(total || 0);
  return b > t ? b - t : 0;
}
function InfoRow({
  icon: Icon,
  label,
  value,
  small = false,
}: {
  icon?: React.ElementType;
  label: string;
  value: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between font-yekan ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      <div className="flex items-center gap-1.5 text-purple-500">
        {Icon && <Icon className="w-4 h-4 text-primary-foreground" />}
        <span>{label}:</span>
      </div>
      <span className="font-medium text-purple-400 ">{value}</span>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Edit,
  Loader2,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEMO_CHANGE_EVENT } from "@/demo/browser";
import { getPusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardData } from "@/stores/useDashboardData";
import { formatPrice } from "@/utils/formatPrice";
import CouponStatusBadge from "../../Loyalty/Coupons/CouponStatusBadge";
import {
  IconCalendarClock,
  IconCheck,
  IconDiscount2,
  IconInfoCircle,
  IconListDetails,
  IconNotes,
  IconPhone,
  IconTable,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemProps } from "@/components/Menu/MenuItem";
import { cn } from "@/lib/utils";
import separate from "@/utils/number";

interface OrdersTableProps {
  initialData?: OrderEvent[];
  initialPageSize?: number;
  username: string;
}

// --- small presentational badge for statuses
export function StatusBadge({ status }: { status: OrderEvent["status"] }) {
  const map: Record<OrderEvent["status"], { cn: string; text: string }> = {
    pending: { cn: "bg-yellow-100 text-yellow-800", text: "در حال بررسی" },
    preparing: { cn: "bg-blue-100 text-blue-800", text: "در حال آماده‌سازی" },
    ready: { cn: "bg-green-100 text-green-800", text: "آماده" },
    delivered: { cn: "bg-gray-100 text-gray-800", text: "تحویل داده شده" },
    cancelled: { cn: "bg-red-100 text-red-800", text: "لغو شده" },
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap   ${map[status].cn}`}
    >
      {map[status].text}
    </span>
  );
}
// --- helper & columns (createColumnHelper fixes the accessorKey typing issue)
const columnHelper = createColumnHelper<OrderEvent>();

export default function OrdersTable({
  initialData,
  initialPageSize = 10,
  username,
}: OrdersTableProps) {
  const [data, setData] = useState<OrderEvent[]>(initialData || []);
  const [couponLoading, setCouponLoading] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      fetch(`/api/orders?username=${username}`)
        .then((r) => r.json())
        .then((orders) => {
          if (active && Array.isArray(orders)) setData(orders);
        })
        .catch(console.error);
    };
    refresh();
    window.addEventListener(DEMO_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener(DEMO_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [username]);

  const columns = [
    columnHelper.display({
      id: "actions",
      header: "عملیات",
      cell: (info) => {
        const order = info.row.original;

        return (
          <div className="flex gap-2 justify-center font-yekan">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 transition-all duration-200 w-full"
                >
                  جزئیات
                </Button>
              </DialogTrigger>

              <DialogContent
                dir="rtl"
                className="max-w-md font-yekan rounded-2xl shadow-xl border border-zinc-200 max-h-screen overflow-auto"
              >
                <DialogHeader className="text-center font-yekan space-y-1">
                  <DialogTitle className="text-xl font-bold font-yekan  flex items-center justify-center gap-2">
                    <IconListDetails className="w-5 h-5 text-primary" />
                    جزئیات سفارش
                  </DialogTitle>
                  <DialogDescription className="text-sm flex justify-center font-yekan items-center">
                    اطلاعات دقیق سفارش را در این بخش مشاهده کنید.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-6 text-sm text-zinc-700 font-yekan">
                  <InfoRow
                    icon={IconInfoCircle}
                    label="شماره سفارش"
                    value={order.orderId}
                  />
                  <InfoRow
                    icon={IconUser}
                    label="نام مشتری"
                    value={order.customer.name}
                  />
                  {order.customer.phone && (
                    <InfoRow
                      icon={IconPhone}
                      label="شماره تماس"
                      value={order.customer.phone}
                    />
                  )}
                  {order.customer.table && (
                    <InfoRow
                      icon={IconTable}
                      label="میز"
                      value={order.customer.table}
                    />
                  )}
                  <div className="flex items-center justify-between  gap-2 font-yekan">
                    <div className="flex gap-2 font-yekan">
                      <IconCheck className="w-4 h-4 text-green-600 " />
                      <span className="text-purple-500">وضعیت:</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <InfoRow
                    icon={IconCalendarClock}
                    label="تاریخ ایجاد"
                    value={new Date(order.createdAt).toLocaleString("fa-IR")}
                  />

                  {order.note && (
                    <div className="bg-yellow-50 border border-yellow-200 font-yekan rounded-lg p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                        <IconNotes className="w-4 h-4" />
                        یادداشت مشتری:
                      </div>
                      <p className="text-zinc-700 text-sm leading-relaxed">
                        {order.note}
                      </p>
                    </div>
                  )}

                  <div className="bg-zinc-50 border border-zinc-100 font-yekan rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1 text-zinc-700 font-semibold">
                      <IconListDetails className="w-4 h-4 text-primary" />
                      آیتم‌ها:
                    </div>
                    <ul className="grid grid-cols-2 text-zinc-600 max-h-24 overflow-auto">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} – {item.qty} عدد
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCouponObject(order.appliedCouponId) &&
                    (() => {
                      const coupon = order.appliedCouponId as Coupon;
                      const typeText =
                        coupon.type === "discount" ? "تخفیف" : "آیتم رایگان";
                      const freeItemName =
                        getFreeItemFromOrder(coupon)?.itemName;

                      return (
                        <div className="bg-purple-50 font-yekan border border-purple-200 rounded-lg p-3 text-sm">
                          <div className="flex items-center gap-2 text-purple-700 font-semibold">
                            <IconDiscount2 className="w-4 h-4" />
                            کوپن استفاده‌شده:
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-4 text-zinc-700">
                            <InfoRow label="کد" value={coupon.code} small />
                            <InfoRow label="نوع" value={typeText} small />
                            {coupon.type === "discount" ? (
                              <InfoRow
                                label="مقدار"
                                value={formatCouponValue(coupon)}
                              />
                            ) : (
                              <InfoRow
                                label="آیتم رایگان"
                                value={
                                  freeItemName || `#${String(coupon.value)}`
                                }
                              />
                            )}
                            <InfoRow
                              label="تاریخ ایجاد"
                              value={formatFaDate(coupon.createdAt)}
                              small
                            />
                            <InfoRow
                              label="انقضا"
                              value={formatFaDate(coupon.expiresAt)}
                            />
                            <InfoRow
                              label="زمان استفاده"
                              value={formatFaDate(coupon.usedAt)}
                              small
                            />
                            <div className="flex gap-2 font-yekan items-center col-span-2 mt-1">
                              <strong>وضعیت:</strong>
                              <CouponStatusBadge couponStatus={coupon.status} />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  {}
                  {calcSavings(order.baseTotal, order.total) > 0 && (
                    <div className="text-green-600 text-sm flex items-center gap-1">
                      <IconWallet className="w-4 h-4" />
                      <span>
                        <strong>تخفیف لحاظ شده این سفارش:</strong>{" "}
                        {calcSavings(
                          order.baseTotal,
                          order.total,
                        ).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </div>
                  )}

                  <div className="text-lg font-bold text-primary font-yekan flex justify-between border-t pt-3 mt-3">
                    <span>جمع کل:</span>
                    <span>{order.total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    }),

    columnHelper.accessor("customer", {
      id: "customerName",
      header: "مشتری",
      cell: (info) => info.getValue().name,
    }),
    columnHelper.accessor("customer", {
      id: "customerPhone",
      header: "شماره تماس",
      cell: (info) => info.getValue().phone,
    }),
    columnHelper.accessor("items", {
      header: "آیتم‌ها",
      cell: (info) => (
        <div className="max-w-[260px] truncate text-sm">
          {info
            .getValue()
            .map((item) => `${item.name} (x${item.qty})`)
            .join(", ")}
        </div>
      ),
    }),
    columnHelper.accessor("baseTotal", {
      header: "مبلغ اصلی",
      cell: (info) => {
        const base = Number(
          info.row.original?.baseTotal || info.row.original.total,
        );
        const total = Number(info.row.original.total || 0);
        const hasPriceChange = calcSavings(base, total) > 0;
        const order = info.row.original;
        const coupon = order.appliedCouponId as Coupon;
        const freeItem = coupon
          ? (getFreeItemFromOrder(coupon) as MenuItemProps)
          : undefined;
        return (
          <span
            className={cn(
              hasPriceChange ? "line-through text-gray-400" : "",
              freeItem && "text-red-500",
            )}
          >
            {separate(base + (freeItem?.smallPrice || 0))}
          </span>
        );
      },
    }),
    columnHelper.accessor("total", {
      header: "مبلغ نهایی",
      cell: (info) => (
        <span className="font-bold text-green-600">
          {Number(info.getValue()).toLocaleString("fa-IR")}
        </span>
      ),
    }),
    columnHelper.accessor("appliedCouponId", {
      header: "کوپن",
      cell: (info) => {
        const raw = info.getValue() as unknown;
        const order = info.row.original;

        if (!raw) return "-";

        const coupon = isCouponObject(raw) ? (raw as Coupon) : null;

        if (!coupon) {
          return (
            <div className="flex flex-col gap-1 animate-pulse">
              <div className="flex items-center gap-1">
                <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-10 bg-gray-100 rounded-full"></div>
              </div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          );
        }

        const typeText = coupon.type === "discount" ? "تخفیف" : "آیتم رایگان";
        const value =
          coupon.type === "discount"
            ? formatCouponValue(coupon)
            : getFreeItemFromOrder(coupon)?.itemName;

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700">
                {typeText}
              </span>
              <CouponStatusBadge couponStatus={coupon.status} />
            </div>
            <div className="text-xs text-primary">
              کد: {coupon.code} {" | "}
              {coupon.type === "discount" ? `مقدار: ${value}` : `${value}`}
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: (info) => {
        const [loading, setLoading] = useState(false);

        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={info.getValue() as OrderEvent["status"]} />

            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={loading}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={16} className="text-blue-500 animate-spin" />
                ) : (
                  <Edit color="blue" size={16} />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {[
                  "pending",
                  "preparing",
                  "ready",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex justify-center items-center w-full text-center hover:cursor-pointer"
                    onClick={async () => {
                      const order = info.row.original;
                      const prevStatus = order.status;
                      setLoading(true);

                      try {
                        const res = await fetch(`/api/orders/${order._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status }),
                        });

                        if (!res.ok) throw new Error("خطا در بروزرسانی سفارش");

                        if (isCouponObject(order.appliedCouponId)) {
                          const coupon = order.appliedCouponId as Coupon;
                          let newCouponStatus = coupon.status;

                          if (status === "delivered") newCouponStatus = "used";
                          else if (
                            ["pending", "preparing", "cancelled"].includes(
                              status,
                            )
                          )
                            newCouponStatus = "active";

                          if (coupon.status !== newCouponStatus) {
                            await fetch(`/api/coupons/${coupon._id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: newCouponStatus,
                              }),
                            });

                            coupon.status = newCouponStatus;
                          }
                        }

                        info.row.original.status =
                          status as OrderEvent["status"];
                        setData((prev) =>
                          prev.map((o) =>
                            o._id === order._id
                              ? {
                                  ...o,
                                  status: status as OrderEvent["status"],
                                }
                              : o,
                          ),
                        );
                      } catch (err) {
                        console.error(err);
                        info.row.original.status = prevStatus;
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <StatusBadge status={status as OrderEvent["status"]} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "تاریخ",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString("fa-IR"),
    }),
    columnHelper.accessor("orderId", {
      header: () => "شماره سفارش",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
  ];
  // sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channelName = `private-orders-${username}`;
    const channel = pusher.subscribe(channelName);

    const handler = async (data: OrderEvent) => {
      let orderData = { ...data };

      if (
        orderData.appliedCouponId &&
        typeof orderData.appliedCouponId === "string"
      ) {
        try {
          const res = await fetch(`/api/coupons/${orderData.appliedCouponId}`);
          if (res.ok) {
            const coupon = await res.json();
            orderData = { ...orderData, appliedCouponId: coupon.coupon };
          }
        } catch (error) {
          console.log("Error fetching coupon:", error);
        }
      }

      setData((prev) => [
        orderData,
        ...prev.filter((o) => o._id !== orderData._id),
      ]);

      const audio = new Audio("/audio/Ding.wav");
      audio.play().catch(() => {});

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("سفارش جدید", {
            body: `${orderData.customer?.name || "مشتری"} | میز ${
              orderData.customer?.table || "-"
            }`,
          });
        }
      }

      toast("سفارش جدید اضافه شد ✅", {
        duration: 5000,
        style: { fontFamily: "Yekan Bakh" },
      });
    };

    channel.bind("new-order", handler);

    return () => {
      channel.unbind("new-order", handler);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [username]);

  // live global filter (debounced)
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  // column filter for status (simple select)
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // pagination page size
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(globalFilter), 250);
    return () => clearTimeout(t);
  }, [globalFilter]);

  // combine filters in a memoized filtered dataset (fast & simple)
  const filteredData = useMemo(() => {
    const q = debouncedFilter.trim().toLowerCase();
    return data.filter((row) => {
      if (statusFilter && statusFilter !== "all" && row.status !== statusFilter)
        return false;
      if (!q) return true;
      return (
        String(row.orderId).toLowerCase().includes(q) ||
        row.customer.name.toLowerCase().includes(q) ||
        row.items
          .map((item) => item.name)
          .join(", ")
          .toLowerCase()
          .includes(q) ||
        String(row.total).includes(q)
      );
    });
  }, [data, debouncedFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: pageSize } },
  });

  // helper to integrate realtime updates (when you receive a new order from socket)
  // call pushOrder(newOrder) to add it to the table (keeps sorting/pagination working)
  function pushOrder(newOrder: OrderEvent) {
    setData((prev) => [newOrder, ...prev]);
  }
  return (
    <div className="rounded-2xl border shadow-sm p-4 ">
      {/* controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <div className="relative flex-1">
            <Input
              placeholder="جستجو: شماره، نام یا آیتم..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-zinc-400" />
          </div>

          <div className="w-48">
            <Select
              value={statusFilter ?? "all"}
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger
                dir="rtl"
                className="border-zinc-300 text-sm focus:ring-primary/40 focus:border-primary/50"
              >
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>

              <SelectContent dir="rtl" className="text-right" position="popper">
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در حال بررسی</SelectItem>
                <SelectItem value="preparing">در حال آماده‌سازی</SelectItem>
                <SelectItem value="ready">آماده</SelectItem>
                <SelectItem value="delivered">تحویل شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-700 whitespace-nowrap">
            سایز صفحه:
          </label>

          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              const v = Number(value);
              setPageSize(v);
              table.setPageSize(v);
            }}
          >
            <SelectTrigger
              dir="rtl"
              className="w-24 border-zinc-300 text-sm focus:ring-primary/40 focus:border-primary/50"
            >
              <SelectValue placeholder="تعداد" />
            </SelectTrigger>

            <SelectContent dir="rtl" className="text-right" position="popper">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler() as any}
                  className={`cursor-pointer select-none ${
                    header.column.getCanSort() ? "" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === "asc" ? (
                      <span className="ml-2">▲</span>
                    ) : header.column.getIsSorted() === "desc" ? (
                      <span className="ml-2">▼</span>
                    ) : header.column.getCanSort() ? (
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="py-6 text-center text-sm text-zinc-500">
                  سفارشی پیدا نشد
                </div>
              </TableCell>
            </TableRow>
          )}

          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-zinc-600">
          {`نمایش ${
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
            1
          } - ${Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getRowModel().rows.length +
              table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize,
          )} از ${filteredData.length}`}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
