"use client";
import ItemForm from "@/components/Form/NewItemForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import MenuCategoryModel from "@/Models/MenuCategoryModel";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import { IconSquareChevronDownFilled } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, GripVertical, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Item = {
  id: string;
  itemName: string;
  price: number;
  _id?: string;
  categoryId: string;
  available: boolean;
  secondaryPrice: number | undefined;
  secondItemName?: string;
};

export const columns: ColumnDef<Item>[] = [
  {
    id: "drag",
    header: () => null,
    cell: () => <GripVertical className="text-gray-400" />,
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    accessorKey: "available",
    header: "وضعیت موجودی",
    cell: ({ row }) => {
      const updateItem = useDashboardData((s) => s.updateItem);
      const [loading, setLoading] = useState(false);
      const user = useDashboardData((s) => s.user);

      const toggleAvailable = async (checked: boolean) => {
        try {
          setLoading(true);
          const res = await fetch(`/api/items/${row.original._id}`, {
            method: "PUT",
            body: JSON.stringify({ ...row.original, available: checked }),
          });
          setLoading(false);

          if (res.ok) {
            const updated = await res.json();
            updateItem(updated, row.original.categoryId);
            const revalidateRes = await fetch(`/api/revalidates`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: user?.username,
              }),
            });
            if (!revalidateRes.ok) {
              console.error("Failed to revalidate path");
            }
            toast(`آیتم ${checked ? "فعال" : "غیر فعال"} شد.`);
          } else {
            toast("مشکلی پیش آمد، دوباره تلاش کنید.");
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          toast("خطا در ارتباط با سرور");
        }
      };

      return (
        <Checkbox
          checked={row.original.available}
          disabled={loading}
          onCheckedChange={(val) => toggleAvailable(!!val)}
        />
      );
    },
  },

  {
    accessorKey: "itemName",
    header: "نام",
  },
  {
    accessorKey: "price",
    header: "قیمت",
    cell: ({ row }) => {
      return (
        <div>
          {separate(row.original.price)}{" "}
          {row.original.secondaryPrice &&
            " - " + separate(row.original.secondaryPrice)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => {
      const fullMenu = useDashboardData((s) => s.fullMenu);
      const [isEditOpen, setIsEditOpen] = useState(false);
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const updateItem = useDashboardData((s) => s.updateItem);
      const user = useDashboardData((s) => s.user);
      const menuCatSecondPrice = fullMenu.find(
        (a) => a._id === row.original.categoryId
      )?.secondTitle;
      const deleteItem = useDashboardData((s) => s.deleteItem);
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);

      const deleteCatItem = async () => {
        try {
          setIsLoading(true);
          const res = await fetch("/api/items/" + row.original._id, {
            method: "DELETE",
          });
          setIsLoading(false);
          if (res.ok) {
            deleteItem(String(row.original._id), row.original.categoryId);
            const revalidateRes = await fetch(`/api/revalidates`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: user?.username,
              }),
            });
            if (!revalidateRes.ok) {
              console.error("Failed to revalidate path");
            }
            toast({ title: `${row.original.itemName} با موفقیت حذف شد.` });
            setIsDeleteOpen(false);
          } else {
            toast({
              title: "مشکلی در حذف این آیتم به وجود آمده. دوباره تلاش کنید.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.log(error);
          toast({
            title: "مشکلی در حذف این آیتم به وجود آمده. دوباره تلاش کنید.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center gap-4">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit />
                ویرایش آیتم
              </Button>
            </DialogTrigger>
            <DialogContent className="font-yekan sm:max-w-[425px] ">
              <DialogHeader>
                <DialogTitle>
                  {"فرم ویرایش" + " " + row.original?.itemName}
                </DialogTitle>
                <DialogDescription>
                  تغییرات مورد نظر را اعمال کنید و سپس ذخیره نمایید.
                </DialogDescription>
              </DialogHeader>
              <ItemForm
                multiLang={user?.multiLang}
                key={row.original._id}
                secondPrice={menuCatSecondPrice}
                defaultValues={{
                  ...row.original,
                  price: row.original.price.toString(),
                  secondaryPrice:
                    row.original?.secondaryPrice?.toString() || undefined,
                  secondItemName: row.original.secondItemName,
                }}
                onSubmit={async (data) => {
                  try {
                    const res = await fetch(`/api/items/${row.original._id}`, {
                      method: "PUT",
                      body: JSON.stringify(data),
                    });

                    if (data.img) {
                      const formData = new FormData();
                      formData.append("file", data.img);
                      formData.append("folder", "items");
                      formData.append("id", row.original._id || "");
                      formData.append("selectedImg", "img");

                      await fetch("/api/uploadImage", {
                        method: "POST",
                        body: formData,
                      });
                    }
                    if (res.ok) {
                      updateItem(await res.json(), row.original.categoryId);
                      const revalidateRes = await fetch(`/api/revalidates`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          username: user?.username,
                        }),
                      });
                      if (!revalidateRes.ok) {
                        console.error("Failed to revalidate path");
                      }
                      toast({
                        title: "تغییرات مورد نظر با موفقیت انجام شدند.",
                      });
                      setIsEditOpen(false);
                    } else {
                      toast({
                        title: "مشکلی پیش آمد، دوباره تلاش کنید.",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    console.log(error);
                    toast({
                      title: "مشکلی پیش آمد، دوباره تلاش کنید.",
                      variant: "destructive",
                    });
                  }
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="justify-center items-center flex"
              >
                <Delete />
                حذف آیتم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
              <DialogHeader>
                <DialogTitle className="text-red-500">
                  آیا از حذف {row.original.itemName} اطمینان دارید؟
                </DialogTitle>
                <DialogDescription className="text-right">
                  تغییرات قابل بازگشت نیستند و در صورت لزوم، دوباره باید آیتم را
                  اضافه نمایید.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4">
                <Button onClick={() => setIsDeleteOpen(false)}>خیر</Button>
                <Button
                  onClick={deleteCatItem}
                  variant={"destructive"}
                  disabled={isLoading}
                >
                  {!isLoading ? " حذف" : "در حال حذف..."}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
