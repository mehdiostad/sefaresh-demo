"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CategoryForm from "../Form/NewCategoryForm";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/stores/useDashboardData";

interface CategoryDialogProps {
  userId: string | undefined;
  username?: string | undefined;
}
const CategoryDialog = ({ userId, username }: CategoryDialogProps) => {
  const user = useDashboardData((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const addCategory = useDashboardData((s) => s.addCategory);
  const fullMenu = useDashboardData((s) => s.fullMenu);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className=" px-4 py-2 bg-secondary rounded-md ml-4">
          <h1 className="font-semibold">همه دسته بندی های شما</h1>
        </div>
        <DialogTrigger asChild className="flex">
          <div className="flex gap-8  items-center">
            <div className="w-full">
              <Button className="flex w-full justify-center items-center bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-800 hover:shadow-lg transition-all duration-200 active:scale-95">
                <Plus />
                اضافه کردن دسته بندی جدید
              </Button>
            </div>
          </div>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>اضافه کردن دسته بندی جدید</DialogTitle>
          <DialogDescription>
            تغییرات مورد نظر را اعمال کنید و سپس ذخیره نمایید.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onSubmit={async (data) => {
            try {
              const { title } = data;
              const res = await fetch(`/api/categories/`, {
                method: "POST",
                body: JSON.stringify({ userId, ...data }),
              });
              const newCategory = await res.json();
              if (res.ok) {
                addCategory(newCategory);
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
                  title: `دسته بندی ${title} با موفقیت اضافه شد`,
                  description: new Date().toLocaleString("fa-IR"),
                });
                setIsOpen(false);
              } else if (res.status === 403) {
                toast({
                  title: `متاسفانه شما اشتراک فعالی ندارید. لطفا اشتراک خود را تمدید کنید.`,
                  description: new Date().toLocaleString("fa-IR"),
                  variant: "destructive",
                });
              }
            } catch (error) {
              toast({
                title: `متاسفانه دسته بندی جدید شما ایجاد نشد. دوباره تلاش کنید.`,
                description: new Date().toLocaleString("fa-IR"),
                variant: "destructive",
              });
            }
          }}
          userId={user?.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
