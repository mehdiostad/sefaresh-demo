"use client";

import CategoryForm from "@/components/Form/NewCategoryForm";
import { Button } from "@/components/ui/button";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import { useSortable } from "@dnd-kit/sortable";
import {
  IconListDetails,
  IconSquareChevronDownFilled,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, GripVertical, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function DragHandle({ row }: { row: any }) {
  const { listeners } = useSortable({ id: row.id });

  return (
    <div
      {...listeners}
      className="cursor-grab flex items-center"
      style={{ touchAction: "none" }}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
export const columns: ColumnDef<MenuProps>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle row={row} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "title",
    header: "نام",
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return <div>تعداد آیتم ها</div>;
    },
    cell: ({ row }) => {
      return <div>{separate(row.original?.items?.length || 0)}</div>;
    },
  },
  {
    accessorKey: "page",
    header: "شماره صفحه",
    cell: ({ row }) => {
      return (
        <div
        // className={cn(
        //   `p-1 rounded-md w-max text-xs`,
        //   status === "pending" && "bg-yellow-500/40",
        //   status === "success" && "bg-green-500/40",
        //   status === "failed" && "bg-red-500/40"
        // )}
        >
          {separate(row.original.pageNumber)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "تنظیمات",
    cell: ({ row }) => {
      const user = useDashboardData((s) => s.user);
      const [isOpen, setIsOpen] = useState(false);
      const [isUpdateCatOpen, setIsUpdateCatOpen] = useState(false);
      const deleteCat = useDashboardData((s) => s.deleteCategory);
      const updateCat = useDashboardData((s) => s.updateCategory);
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();
      const deleteCategory = async () => {
        try {
          setIsLoading(true);
          const res = await fetch("/api/categories/" + row.original._id, {
            method: "DELETE",
          });
          if (res.status === 403) {
            setIsLoading(false);
            throw new Error("Failed to delete category", {
              cause: "Subscription expired",
            });
          } else if (res.ok && res.status === 200) {
            setIsLoading(false);
            deleteCat(String(row.original._id));
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
              title: `دسته بندی ${row.original.title} با موفقیت حذف شد.`,
            });
            setIsOpen(false);
          }
        } catch (error) {
          console.log(error);
          if (
            error instanceof Error &&
            error.cause === "Subscription expired"
          ) {
            toast({
              title:
                "اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.",
              variant: "destructive",
            });
          } else {
            toast({
              title:
                "مشکلی در حذف این دسته بندی به وجود آمده. دوباره تلاش کنید.",
              variant: "destructive",
            });
          }
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="">
              <span className="sr-only">Open menu</span>
              <span className="flex items-center gap-2">
                عملیات ها
                <IconSquareChevronDownFilled />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-yekan" align="end">
            <DropdownMenuItem asChild>
              <Button
                variant={"default"}
                className="flex justify-center items-center w-full hover:cursor-pointer"
                onClick={() =>
                  router.push(
                    "/dashboard/categories/page/" +
                      Number(row.original.pageNumber)
                  )
                }
              >
                <IconListDetails />
                مدیریت آیتم ها
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Dialog open={isUpdateCatOpen} onOpenChange={setIsUpdateCatOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-center items-center flex">
                  <Edit />
                  ویرایش
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>ویرایش کردن دسته بندی جدید</DialogTitle>
                  <DialogDescription>
                    تغییرات مورد نظر را اعمال کنید و سپس ذخیره نمایید.
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  defaultValues={row.original}
                  onSubmit={async (data) => {
                    try {
                      const res = await fetch(
                        `/api/categories/${row.original._id}`,
                        {
                          method: "PUT",
                          body: JSON.stringify(data),
                        }
                      );
                      if (res.status === 403) {
                        throw new Error("Subscription expired", {
                          cause: "Subscription expired",
                        });
                      }
                      const newCategory = await res.json();
                      if (newCategory) {
                        updateCat(
                          newCategory,
                          row.original._id?.toString() || ""
                        );
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
                          title:
                            "دسته بندی " +
                            row.original.title +
                            " " +
                            "با موفقیت ویرایش شد ",
                        });
                        setIsUpdateCatOpen(false);
                      }
                    } catch (error) {
                      if (
                        error instanceof Error &&
                        error.cause === "Subscription expired"
                      ) {
                        toast({
                          title:
                            "اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.",
                          variant: "destructive",
                        });
                      } else {
                        toast({
                          title:
                            "مشکلی در ویرایش این دسته بندی به وجود آمده. دوباره تلاش کنید.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  userId={user?.id}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Delete />
                  حذف دسته بندی
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>
                    آیا از حذف این دسته بندی اطمینان دارید؟
                  </DialogTitle>
                  <DialogDescription>
                    تغییرات قابل بازگشت نیستند و در صورت حذف باید دوباره دسته
                    بندی و آیتم های آن را اضافه کنید.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4">
                  <Button onClick={() => setIsOpen(false)}>خیر</Button>
                  <Button
                    onClick={deleteCategory}
                    variant={"destructive"}
                    disabled={isLoading}
                  >
                    {!isLoading ? " حذف" : "در حال حذف..."}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
