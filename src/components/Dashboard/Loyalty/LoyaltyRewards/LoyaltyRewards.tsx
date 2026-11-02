"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import { z } from "zod";

type RewardType = "discount" | "freeItem";

export interface Reward {
  _id?: string;
  title: string;
  requiredPoints: number;
  type: RewardType;
  value: number | string; // discount % | itemId
  expiresAt: string | Date | null;
  isActive: boolean;
}

export default function LoyaltyRewardsTable({
  userId,
  rewards,
  isLoyaltyActive,
  username,
}: {
  userId?: string;
  rewards: IReward[];
  isLoyaltyActive: boolean;
  username: string;
}) {
  const [localRewards, setLocalRewards] = useState(rewards || []);
  const [formState, setFormState] = useState<{
    mode: "create" | "edit" | null;
    reward: IReward | null;
  }>({ mode: null, reward: null });

  const [rowLoading, setRowLoading] = useState<{
    [id: string]: { toggle?: boolean; delete?: boolean; save?: boolean };
  }>({});
  const [globalCreating, setGlobalCreating] = useState(false);

  const fullMenu = useDashboardData((s) => s.fullMenu);
  const userItems = useMemo(
    () => (fullMenu || []).flatMap((c: any) => c.items || []),
    [fullMenu],
  );

  const setRowBusy = (
    id: string,
    key: "toggle" | "delete" | "save",
    v: boolean,
  ) => setRowLoading((prev) => ({ ...prev, [id]: { ...prev[id], [key]: v } }));

  const RewardSchema = z
    .object({
      _id: z.string().optional(),
      title: z.string().trim().min(1, "عنوان را وارد کنید"),
      requiredPoints: z
        .number({
          invalid_type_error: "امتیاز لازم نامعتبر است",
          required_error: "امتیاز لازم نامعتبر است",
        })
        .int("امتیاز لازم باید عدد صحیح باشد")
        .min(10, "حداقل امتیاز لازم ۱۰ است")
        .max(10000, "حداکثر امتیاز لازم ۱۰هزار است"),
      type: z.enum(["discount", "freeItem"]),
      value: z.union([z.number(), z.string()]),
      expiresAt: z.union([z.date(), z.string(), z.null()]).optional(),
      isActive: z.boolean().optional(),
    })
    .superRefine((rw, ctx) => {
      if (rw.type === "discount") {
        const val = Number(rw.value);
        if (!Number.isFinite(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: "درصد تخفیف نامعتبر است",
          });
          return;
        }
        if (val < 1 || val > 90) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: "درصد تخفیف باید بین ۱ تا ۹۰ باشد",
          });
        }
      } else if (rw.type === "freeItem") {
        if (
          !rw.value ||
          (typeof rw.value === "string" && rw.value.trim() === "")
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: "باید یک آیتم رایگان انتخاب کنید",
          });
        }
      }
    });

  const validateReward = (rw: IReward): string | null => {
    const parsed = RewardSchema.safeParse(rw);
    if (parsed.success) return null;

    return parsed.error.issues[0]?.message || "ورودی نامعتبر است";
  };

  const toFaDate = (d?: string | Date | null) =>
    d ? new Date(d).toLocaleDateString("fa-IR") : "بدون انقضا";

  const computeExpiration = (key: string): Date | null => {
    if (key === "1d") return new Date(Date.now() + 1 * 86400000);
    if (key === "7d") return new Date(Date.now() + 7 * 86400000);
    if (key === "30d")
      return new Date(new Date().setMonth(new Date().getMonth() + 1));
    if (key === "90d")
      return new Date(new Date().setMonth(new Date().getMonth() + 3));
    if (key === "none") return null;
    return null;
  };

  // ---------- API ----------
  const apiToggle = async (id: string, isActive: boolean) => {
    setRowBusy(id, "toggle", true);
    const res = await fetch(`/api/loyalty/rewards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setRowBusy(id, "toggle", false);
    return res;
  };

  const apiDelete = async (id: string) => {
    setRowBusy(id, "delete", true);
    const res = await fetch(`/api/loyalty/rewards/${id}`, { method: "DELETE" });
    setRowBusy(id, "delete", false);
    return res;
  };

  const apiUpdate = async (rw: IReward) => {
    if (!rw._id) throw new Error("شناسه جایزه نامعتبر است");
    setRowBusy(rw._id, "save", true);
    const res = await fetch(`/api/loyalty/rewards/${rw._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rw),
    });
    setRowBusy(rw._id, "save", false);
    return res;
  };

  const apiCreate = async (rw: IReward) => {
    setGlobalCreating(true);
    const res = await fetch(`/api/loyalty/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...rw, value: rw.value }),
    });
    setGlobalCreating(false);
    return res;
  };

  // ---------- Event handlers ----------
  const toggleReward = async (id: string, isActive: boolean) => {
    if (!isLoyaltyActive) return;
    const prev = [...localRewards];
    setLocalRewards((p) =>
      p.map((r) => (r._id === id ? { ...r, isActive } : r)),
    );
    const res = await apiToggle(id, isActive);
    if (res.ok) {
      const revalidateRes = await fetch(`/api/revalidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });
      if (!revalidateRes.ok) {
        console.error("Failed to revalidate path");
      }
    }
    if (!res.ok) {
      setLocalRewards(prev);
      toast.error("خطا در تغییر وضعیت");
    } else {
      toast.success("وضعیت جایزه تغییر کرد ✅");
    }
  };

  const deleteReward = async (id: string) => {
    const prev = [...localRewards];
    setLocalRewards((p) => p.filter((r) => r._id !== id));
    const res = await apiDelete(id);
    if (res.ok) {
      const revalidateRes = await fetch(`/api/revalidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });
      if (!revalidateRes.ok) {
        console.error("Failed to revalidate path");
      }
    }
    if (!res.ok) {
      setLocalRewards(prev);
      toast.error("خطا در حذف جایزه");
    } else {
      toast.success("جایزه حذف شد 🗑️");
    }
  };

  const onSaveEdit = async (rw: IReward) => {
    const err = validateReward(rw);
    if (err) return toast.error(err);
    const res = await apiUpdate(rw);
    if (res.ok) {
      const revalidateRes = await fetch(`/api/revalidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });
      if (!revalidateRes.ok) {
        console.error("Failed to revalidate path");
      }
    }
    if (!res.ok) {
      toast.error("خطا در ویرایش جایزه");
      return;
    }
    setLocalRewards((p) => p.map((x) => (x._id === rw._id ? rw : x)));
    setFormState({ mode: null, reward: null });
    toast.success("جایزه ویرایش شد ✏️");
  };

  const onSaveCreate = async (rw: IReward) => {
    const err = validateReward(rw);
    if (err) return toast.error(err);
    const res = await apiCreate(rw);
    if (res.ok) {
      const revalidateRes = await fetch(`/api/revalidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });
      if (!revalidateRes.ok) {
        console.error("Failed to revalidate path");
      }
    }
    if (!res.ok) {
      toast.error("خطا در افزودن جایزه");
      return;
    }
    const { reward } = await res.json();
    setLocalRewards((p) => [...p, reward]);
    setFormState({ mode: null, reward: null });
    toast.success("جایزه اضافه شد 🎉");
  };

  const openCreate = () => {
    if (!isLoyaltyActive) {
      toast.error("ابتدا سیستم امتیازدهی را از قسمت قوانین فعال کنید");
      return;
    }
    setFormState({
      mode: "create",
      reward: {
        _id: Date.now().toString(),
        title: "",
        requiredPoints: 0,
        type: "discount",
        value: 0,
        expiresAt: null,
        isActive: true,
      },
    });
  };

  return (
    <Card className="flex w-full flex-col gap-2" dir="rtl">
      <CardHeader className="flex justify-start items-start">
        <Button onClick={openCreate} disabled={globalCreating}>
          {globalCreating ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 ml-2" />
          )}
          افزودن جایزه
        </Button>
      </CardHeader>

      <CardContent className="flex w-full flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">امتیاز لازم</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">مقدار</TableHead>
              <TableHead className="text-right">تاریخ انقضا</TableHead>
              <TableHead className="text-right">فعال</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localRewards.map((r) => {
              const busy = rowLoading[r._id || ""] || {};
              const isDiscount = r.type === "discount";
              const chosenItem =
                !isDiscount && typeof r.value === "string"
                  ? userItems.find((i: any) => i._id === r.value)
                  : null;

              return (
                <TableRow key={r._id}>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.requiredPoints}</TableCell>
                  <TableCell>{isDiscount ? "تخفیف" : "آیتم رایگان"}</TableCell>
                  <TableCell>
                    {isDiscount ? `${r.value}%` : chosenItem?.itemName}
                  </TableCell>
                  <TableCell>{toFaDate(r.expiresAt)}</TableCell>
                  <TableCell>
                    {isLoyaltyActive ? (
                      <Switch
                        dir="ltr"
                        checked={r.isActive}
                        onCheckedChange={(checked) =>
                          r._id && !busy.toggle
                            ? toggleReward(r._id, checked)
                            : null
                        }
                        disabled={!!busy.toggle}
                      />
                    ) : (
                      "غیرفعال"
                    )}
                  </TableCell>
                  <TableCell className="space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormState({ mode: "edit", reward: { ...r } })
                      }
                      disabled={!!busy.save}
                    >
                      {busy.save ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        "ویرایش"
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" disabled={!!busy.delete}>
                          {busy.delete ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            "حذف"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex justify-between items-center">
                        <DialogHeader>
                          <DialogTitle>
                            آیا از حذف این جایزه مطمئن هستید؟
                          </DialogTitle>
                          <DialogDescription>
                            با حذف جایزه، این عمل قابل بازگشت نیست.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-4">
                          <Button
                            variant="destructive"
                            onClick={() => r._id && deleteReward(r._id)}
                            disabled={!!busy.delete}
                          >
                            {busy.delete ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              "بله، حذف کن"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {}
      <RewardFormDialog
        open={!!formState.mode}
        mode={formState.mode}
        reward={formState.reward}
        onClose={() => setFormState({ mode: null, reward: null })}
        onChange={(rw) => setFormState((s) => ({ ...s, reward: rw }))}
        onSubmit={(rw) =>
          formState.mode === "edit" ? onSaveEdit(rw) : onSaveCreate(rw)
        }
        userItems={userItems}
        saving={
          formState.mode === "edit" && formState.reward?._id
            ? !!rowLoading[formState.reward._id!]?.save
            : globalCreating
        }
        computeExpiration={computeExpiration}
      />
    </Card>
  );
}

/* ---------------------------------- Subcomponents ---------------------------------- */

function RewardFormDialog({
  open,
  mode,
  reward,
  onChange,
  onSubmit,
  onClose,
  saving,
  userItems,
  computeExpiration,
}: {
  open: boolean;
  mode: "create" | "edit" | null;
  reward: IReward | null;
  onChange: (rw: IReward) => void;
  onSubmit: (rw: IReward) => void;
  onClose: () => void;
  saving: boolean;
  userItems: any[];
  computeExpiration: (k: string) => Date | null;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!mode || !reward) return null;

  const isDiscount = reward.type === "discount";
  const chosenItemName =
    !isDiscount && typeof reward.value === "string"
      ? userItems.find((i) => i._id === reward.value)?.itemName
      : undefined;

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent dir="rtl" className="font-yekan">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "افزودن جایزه جدید" : "ویرایش جایزه"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {}
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input
              value={reward.title}
              onChange={(e) => onChange({ ...reward, title: e.target.value })}
            />
          </div>

          {}
          <div className="space-y-2">
            <Label>امتیاز لازم</Label>
            <Input
              type="number"
              value={reward.requiredPoints || ""}
              onChange={(e) =>
                onChange({
                  ...reward,
                  requiredPoints: Number(e.target.value || 0),
                })
              }
            />
          </div>

          {}
          <div className="space-y-2" dir="rtl">
            <Label>نوع</Label>
            <Select
              value={reward.type}
              onValueChange={(val: RewardType) => {
                onChange({
                  ...reward,
                  type: val,
                  value: val === "discount" ? 0 : "",
                });
              }}
              dir="rtl"
            >
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem
                  className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
                  value="discount"
                >
                  تخفیف
                </SelectItem>
                <SelectItem
                  className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
                  value="freeItem"
                >
                  آیتم رایگان
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {}
          {isDiscount ? (
            <div className="space-y-2">
              <Label>درصد تخفیف</Label>
              <Input
                type="number"
                value={Number(reward.value) || ""}
                onChange={(e) =>
                  onChange({ ...reward, value: Number(e.target.value || 0) })
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>آیتم رایگان</Label>
              <Button variant="secondary" onClick={() => setPickerOpen(true)}>
                انتخاب آیتم
              </Button>

              <ItemPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                userItems={userItems}
                onPick={(id: string) => onChange({ ...reward, value: id })}
              />

              {reward.value && chosenItemName && (
                <p className="text-sm text-muted-foreground">
                  انتخاب شده: {chosenItemName}
                </p>
              )}
            </div>
          )}

          {}
          <div className="space-y-2">
            <Label>تاریخ انقضا</Label>
            <ExpirationSelect
              value={reward.expiresAt ?? null}
              onValueChange={(key) =>
                onChange({ ...reward, expiresAt: computeExpiration(key) })
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={() => onSubmit(reward)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : mode === "create" ? (
              "ذخیره"
            ) : (
              "ذخیره تغییرات"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ItemPickerDialog({
  open,
  onOpenChange,
  userItems,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userItems: any[];
  onPick: (id: string) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="جستجوی آیتم..." />
        <CommandList>
          <CommandEmpty>آیتمی پیدا نشد</CommandEmpty>
          <CommandGroup heading="منوی شما">
            {userItems.map((item) => (
              <CommandItem
                key={item._id}
                onSelect={() => {
                  onPick(item._id);
                  onOpenChange(false);
                }}
              >
                {item.itemName} — {separate(item.price)} تومان
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function ExpirationSelect({
  value,
  onValueChange,
}: {
  value: Date | string | null;
  onValueChange: (key: "1d" | "7d" | "30d" | "90d" | "none") => void;
}) {
  const label = (() => {
    if (!value) return "انتخاب کنید";
    return new Date(value).toLocaleDateString("fa-IR");
  })();

  return (
    <Select onValueChange={(val: any) => onValueChange(val)} dir="rtl">
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
          value="1d"
        >
          ۱ روزه
        </SelectItem>
        <SelectItem
          className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
          value="7d"
        >
          ۱ هفته
        </SelectItem>
        <SelectItem
          className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
          value="30d"
        >
          ۱ ماهه
        </SelectItem>
        <SelectItem
          className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
          value="90d"
        >
          ۳ ماهه
        </SelectItem>
        <SelectItem
          className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer hover:bg-muted transition"
          value="none"
        >
          بدون انقضا
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
