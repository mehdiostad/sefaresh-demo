"use client";
import { imageUrl } from "@/demo/seed";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import separate from "@/utils/number";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, Phone, User, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns-jalali";

const variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

type ConfirmOrderProps = {
  items: OrderItem[];
  totalPrice: number;
  tax?: number;
  session: any;
  loading?: boolean;
  pointRate?: number;
  menuName: string;
  coupons?: Coupon[];
  couponLoading: boolean;
  userAllItems: any[];
  isLoyaltyActive: boolean;
  onSubmit: (
    data: { table?: number; note?: string; freeItem?: any },
    coupon?: Coupon
  ) => Promise<void>;
};

export default function ConfirmOrder({
  items,
  totalPrice,
  tax,
  session,
  onSubmit,
  loading,
  pointRate,
  menuName,
  couponLoading,
  coupons = [],
  isLoyaltyActive,
  userAllItems,
}: ConfirmOrderProps) {
  const form = useForm<{ table?: number; note?: string; couponId?: string }>();
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [previewTotal, setPreviewTotal] = useState<number>(
    totalPrice + (tax ? tax * totalPrice : 0)
  );

  const baseTotal = totalPrice + (tax ? tax * totalPrice : 0);

  const getFreeItem = (coupon: any) => {
    if (!coupon) return null;
    if (coupon.type === "freeItem" || coupon.type === "free_item") {
      return userAllItems.find((it) => it._id === coupon.value);
    }
    return null;
  };

  useEffect(() => {
    if (!selectedCoupon) {
      setPreviewTotal(baseTotal);
      return;
    }

    if (selectedCoupon.type === "discount") {
      (async () => {
        try {
          const res = await fetch("/api/coupons/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              couponCode: selectedCoupon.code,
              order: { items, totalPrice: baseTotal },
            }),
          });
          const data = await res.json();
          if (data.success && data.order?.totalPrice != null) {
            setPreviewTotal(data.order.totalPrice);
          } else {
            setPreviewTotal(baseTotal);
          }
        } catch (e) {
          setPreviewTotal(baseTotal);
        }
      })();
    } else {
      setPreviewTotal(baseTotal);
    }
  }, [selectedCoupon, baseTotal, items]);

  const freeItem = getFreeItem(selectedCoupon);

  const points =
    pointRate && pointRate > 0 ? Math.floor(baseTotal / pointRate) : 0;

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setPreviewTotal(baseTotal);
  };
  return (
    <motion.div
      key="confirm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className="p-4 pt-0 flex flex-col gap-2 font-yekan"
    >
      <DialogHeader>
        <DialogTitle>تأیید سفارش</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <div className="flex items-center w-full justify-between ">
          <p className="flex gap-2 items-center">
            <User size={14} color="gray" />
            {session?.user?.fullname}
          </p>
          <p className="flex gap-2 items-center">
            <Phone size={14} color="gray" />
            {separate(session?.user?.phone).split(",").join("")}
          </p>
        </div>
        <Separator className="border-dashed opacity-50" />
        <Table className="w-full">
          <TableHeader className="top-0 sticky bg-white z-10">
            <TableRow>
              <TableHead colSpan={2} className="text-right">
                آیتم
              </TableHead>
              <TableHead className="">تعداد</TableHead>
              <TableHead className="text-right">قیمت</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="max-h-52 overflow-auto">
          <Table className="mt-1">
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{separate(item.qty)}</TableCell>
                  <TableCell>{separate(item.price * item.qty)} تومان</TableCell>
                </TableRow>
              ))}

              {freeItem && (
                <TableRow className="bg-green-50">
                  <TableCell className="flex items-center gap-2 font-semibold">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs">
                      🎁
                    </span>
                    <span>{freeItem.itemName || freeItem.name}</span>
                  </TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-green-600 font-bold">
                    رایگان 🎉
                  </TableCell>
                </TableRow>
              )}

              {tax && (
                <TableRow>
                  <TableCell colSpan={2} className="font-bold">
                    مالیات
                  </TableCell>
                  <TableCell>{separate(tax * totalPrice)} تومان</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  قیمت کل
                </TableCell>
                <TableCell
                  className={
                    selectedCoupon && selectedCoupon.type === "discount"
                      ? "line-through text-gray-400"
                      : ""
                  }
                >
                  {separate(baseTotal)} تومان
                </TableCell>
              </TableRow>

              {selectedCoupon && selectedCoupon.type === "discount" && (
                <motion.tr
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  className="bg-green-50"
                >
                  <TableCell colSpan={2} className="font-bold text-green-600">
                    قیمت بعد از کوپن
                  </TableCell>
                  <TableCell className="font-extrabold text-green-600 text-lg">
                    {separate(previewTotal)} تومان
                  </TableCell>
                </motion.tr>
              )}
            </TableBody>
          </Table>
        </div>
        {isLoyaltyActive && pointRate && pointRate > 0 && (
          <div className="">
            <div className=" rounded-b-lg bg-gradient-to-r from-[#D247BF] to-primary text-white shadow-sm">
              <div className="flex justify-center items-center gap-3">
                <Badge className="animate-pulse">
                  +{separate(points)} امتیاز
                </Badge>
                <span className="text-sm ">در {menuName}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col h-full">
        {couponLoading && isLoyaltyActive? (
          <Loader className="animate-spin flex justify-center items-center" />
        ) : (
          isLoyaltyActive &&
          coupons.length > 0 && (
            <div className="mt-4">
              {!selectedCoupon ? (
                <>
                  <p className=" mb-2 text-green-500">
                    تبریک! میتوانید از کوپن های خود استفاده کنید.
                  </p>
                  <Select
                    onValueChange={(val) => {
                      const found = coupons.find((c) => c._id === val);
                      setSelectedCoupon(found || null);
                    }}
                    value={selectedCoupon?._id}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="یک کوپن انتخاب کنید (اختیاری)" />
                    </SelectTrigger>
                    <SelectContent>
                      {coupons.map((c) => {
                        const couponFreeItem = getFreeItem(c);
                        if (c?.expiresAt === null || (c.expiresAt && (new Date()) < new Date(c.expiresAt)))
                          return (
                            <SelectItem
                              key={c._id}
                              value={c._id}
                              className="py-2"
                            >
                              <div className="flex items-center gap-3 text-right">
                                {couponFreeItem ? (
                                  <div className="relative w-12 h-12 shrink-0">
                                    <Image
                                      src={imageUrl(couponFreeItem.img, "items")}
                                      alt={couponFreeItem.itemName}
                                      fill
                                      className="rounded-md object-cover"
                                    />
                                    <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
                                      🎁هدیه
                                    </span>
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 flex items-center justify-center rounded-md bg-yellow-400/20 text-yellow-500">
                                    💸
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  {c.type === "discount" && (
                                    <span className="font-bold text-sm">
                                      تخفیف {c.value}%
                                    </span>
                                  )}
                                  {couponFreeItem && (
                                    <span className="font-bold text-sm">
                                      آیتم رایگان: {couponFreeItem.itemName}
                                    </span>
                                  )}
                                  <span className="text-xs opacity-70 mt-0.5">
                                    کد: {c.code}
                                  </span>

                                  <span className="text-xs opacity-70 mt-0.5">
                                    انقضا:{" "}
                                    {c.expiresAt
                                      ? format(c.expiresAt, "PPP")
                                      : "ندارد"}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                      })}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <Card className="p-3 flex justify-between items-center border border-gray-200">
                  <div className="flex items-center gap-3">
                    {freeItem ? (
                      <div className="relative w-12 h-12 shrink-0">
                        <Image
                          src={imageUrl(freeItem.img, "items")}
                          alt={freeItem.itemName}
                          fill
                          className="rounded-md object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
                          🎁هدیه
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-yellow-400/20 text-yellow-500">
                        💸
                      </div>
                    )}

                    <div className="text-right">
                      {selectedCoupon.type === "discount" ? (
                        <div className="flex flex-col">
                          <span className="font-bold">
                            تخفیف {selectedCoupon.value}%
                          </span>
                          <span className="text-xs text-gray-600 mt-0.5">
                            کد: {selectedCoupon.code}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold">آیتم رایگان</span>
                          <span className="text-xs text-gray-600 mt-0.5">
                            آیتم: {freeItem?.itemName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center ">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="h-4 w-4 text-red-500" />
                      <span className="mr-2 text-red-500">حذف کوپن</span>
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              const selected = coupons.find(
                (c) => c._id === selectedCoupon?._id
              );
              const freeItem = getFreeItem(selected);

              onSubmit({ ...data, freeItem }, selected);
            })}
            className="mt-2"
          >
            <FormField
              control={form.control}
              name="table"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره میز (اختیاری)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="مثلاً 3"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>یادداشت (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثلاً: بدون شکر لطفاً" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-black text-white mt-4"
              disabled={loading}
            >
              {loading ? "در حال ارسال..." : "تأیید نهایی"}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
