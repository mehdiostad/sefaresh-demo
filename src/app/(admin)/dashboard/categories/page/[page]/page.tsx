"use client";
import { useDashboardData } from "@/stores/useDashboardData";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import NewItemForm from "@/components/Form/NewItemForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GripVertical, InfoIcon, Plus } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ page: string }>();
  const menuCategory = useDashboardData((s) => s.fullMenu)?.find(
    (page) => page?.pageNumber === +params.page
  );
  const user = useDashboardData((s) => s.user);
  const isExpired = user?.planExpiresAt
    ? new Date(user?.planExpiresAt) < new Date()
    : true;
  const addItem = useDashboardData((s) => s.addItem);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" flex flex-col gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className=" px-4 py-2 bg-secondary rounded-md">
            <h1 className="font-semibold">
              آیتم های دسته بندی {menuCategory?.title}
            </h1>
          </div>
          <DialogTrigger asChild className="md:w-1/5  flex">
            <div className="flex gap-8  items-center">
              <div className="w-full">
                <Button className="flex w-full justify-center items-center bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-800 hover:shadow-lg transition-all duration-200 active:scale-95">
                  <Plus />
                  آیتم جدید
                </Button>
              </div>
            </div>
          </DialogTrigger>
        </div>
        <DialogContent className="font-yekan sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>اضافه کردن آیتم جدید</DialogTitle>
            <DialogDescription>
              اطلاعات آیتم جدید خود را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <NewItemForm
            multiLang={user?.multiLang}
            onSubmit={async (data) => {
              try {
                const { itemName, price, img, description } = data;
                const res = await fetch(`/api/items/`, {
                  method: "POST",
                  body: JSON.stringify({
                    userId: user?.id,
                    categoryId: menuCategory?._id,
                    itemName,
                    price,
                    description,
                    secondaryPrice: data?.secondaryPrice,
                    secondItemName: data.secondItemName,
                  }),
                });
                if (res.status === 403 && res.ok === false) {
                  toast({
                    title:
                      "اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.",
                    variant: "destructive",
                  });
                  throw new Error("Subscription expired", {
                    cause: "Subscription expired",
                  });
                } else if (res.ok) {
                  const newItem = await res.json();
                  if (img) {
                    const newItemId = newItem._id;
                    const formData = new FormData();
                    formData.append("file", img);
                    formData.append("folder", "items");
                    formData.append("id", newItemId);
                    formData.append("selectedImg", "img");

                    await fetch("/api/uploadImage", {
                      method: "POST",
                      body: formData,
                    });
                  }
                  if (res.ok) {
                    addItem(newItem, menuCategory?._id?.toString() || "");
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
                    toast({ title: "آیتم با موفقیت ایجاد شد" });
                    setIsOpen(false);
                  }
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
                      "مشکلی در اضافه کردن آیتم جدید به وجود آمده، لطفا دوباره تلاش کنید",
                    variant: "destructive",
                  });
                }
              }
            }}
            secondPrice={menuCategory?.secondTitle}
          />
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2">
        <InfoIcon color="yellow" />
        <span>برای جابجایی آیتم ها از</span>
        <GripVertical className="w-4 h-4 text-muted-foreground mb-1" />
        <span> استفاده کنید.</span>
      </div>
      {isExpired ? (
        <div>
          اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.
        </div>
      ) : (
        <DataTable
          username={user?.username}
          columns={columns}
          categoryId={menuCategory?._id?.toString() || ""}
          data={menuCategory?.items?.sort((a, b) => a.order - b.order) || []}
        />
      )}
    </div>
  );
};

export default Page;
