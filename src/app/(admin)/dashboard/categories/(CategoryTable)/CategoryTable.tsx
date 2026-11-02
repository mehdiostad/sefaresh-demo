"use client";

import { useDashboardData } from "@/stores/useDashboardData";
import { columns } from "../columns";
import { DataTable } from "../data-table";
import { useToast } from "@/hooks/use-toast";

const CategoryTable = ({ username }: { username: string }) => {
  const categories = useDashboardData((s) => s.fullMenu);
  const updateCat = useDashboardData((s) => s.updateCategory);
  const { toast } = useToast();

  const handleReorder = async (newData: {
    activeItem: MenuProps;
    overItem: MenuProps;
  }) => {
    const { activeItem, overItem } = newData;
    try {
      categories.forEach(async (cat) => {
        if (cat._id === activeItem._id) {
          const res = await fetch(`/api/categories/${cat._id}`, {
            method: "PUT",
            body: JSON.stringify({
              pageNumber: activeItem.pageNumber,
            }),
          });
          if (res.ok && res.status === 200) {
            updateCat(
              { pageNumber: activeItem.pageNumber },
              cat._id?.toString() || ""
            );
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
            toast({
              title: "دسته بندی ها با موفقیت به روز شد",
              description: "تغییرات در ترتیب دسته بندی ها ذخیره شد.",
            });
          } else if (res.status === 403) {
            toast({
              title:
                "اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.",
              variant: "destructive",
            });
            throw new Error("Subscription expired");
          }
        } else if (cat._id === overItem._id) {
          await fetch(`/api/categories/${cat._id}`, {
            method: "PUT",
            body: JSON.stringify({
              pageNumber: overItem.pageNumber,
            }),
          });
          updateCat(
            { pageNumber: overItem.pageNumber },
            cat._id?.toString() || ""
          );
        }
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "خطا در به روز رسانی دسته بندی ها",
        description: "لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  return (
    <DataTable
      columns={columns}
      data={
        categories.sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0)) ||
        []
      }
      onReorder={handleReorder}
    />
  );
};

export default CategoryTable;
