"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/stores/useDashboardData";
import { Textarea } from "../ui/textarea";
import { ChevronRight } from "lucide-react";

const getSchema = (formType: "create" | "update") =>
  z.object({
    menuName:
      formType === "create"
        ? z.string().min(1, "نام منو الزامی است")
        : z.string().optional(),

    menuLogo: z.instanceof(File).optional().or(z.literal(undefined)),

    phone: z.string().min(11).optional(),

    address: z.string().min(3, "آدرس باید حداقل ۳ کاراکتر باشد").optional(),
    description: z.string().min(3, "آدرس باید حداقل ۳ کاراکتر باشد").optional(),
  });

type NewMenuFormProps = {
  userId: string | undefined;
  onSuccess?: () => void;
  additionalFields?: any;
  formType?: "create" | "update";
};

const NewMenuForm = ({
  userId,
  onSuccess,
  additionalFields = {},
  formType = "create",
}: NewMenuFormProps) => {
  const schema = getSchema(formType);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const { toast } = useToast();
  const updateUser = useDashboardData((s) => s.updateUser);
  const onSubmit = async (data: FormData) => {
    const { menuLogo, ...otherData } = data;
    const filteredData = Object.fromEntries(
      Object.entries(otherData).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    let imgName = undefined;
    if (menuLogo) {
      const formData = new FormData();
      formData.append("file", menuLogo);
      formData.append("folder", "userLogos");
      formData.append("id", userId || "");
      formData.append("selectedImg", "menuLogo");

      const imgRes = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });
      imgName = await imgRes.json();
    }

    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ ...filteredData }),
    });

    if (res.ok) {
      updateUser(
        data.menuLogo
          ? { ...filteredData, menuLogo: imgName.menuLogo }
          : { ...filteredData }
      );
      toast({
        title:
          formType === "create"
            ? "منو با موفقیت ایجاد شد! بریم مراحل بعدی."
            : "اطلاعات با موفقیت ویرایش شد",
      });
    } else {
      toast({
        title: "مشکلی پیش آمده لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    }

    onSuccess?.();
  };

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="space-y-6">
        <FormField
          control={form.control}
          name="menuName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام منو</FormLabel>
              <FormControl>
                <Input {...field} placeholder="مثلاً: منوی اصلی" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="menuLogo"
          render={() => (
            <FormItem>
              <FormLabel>لوگوی منو</FormLabel>
              <FormControl>
                <div>
                  <input
                    type="file"
                    id="img-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue("menuLogo", file || undefined, {
                        shouldValidate: true,
                      });
                    }}
                    className="hidden"
                  />

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() =>
                        document.getElementById("img-upload")?.click()
                      }
                    >
                      انتخاب فایل
                    </Button>
                  </div>

                  {form.watch("menuLogo") && (
                    <p className="text-sm text-muted-foreground mt-2">
                      فایل انتخاب‌شده: {form.watch("menuLogo")?.name}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {Object.values(additionalFields).map((item: any, index: number) => (
          <div key={index}>
            <FormField
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item.formLable}</FormLabel>
                  <FormControl>
                    {!item.textarea ? (
                      <Input
                        {...field}
                        placeholder={item.placeholder || ""}
                        type={item?.type || "text"}
                      />
                    ) : (
                      <Textarea {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="outline"
          className="text-sidebar-foreground w-full"
        >
          <ChevronRight />
          {isSubmitting ? "در حال ارسال..." : onSuccess ? "بعدی" : "ثبت"}
        </Button>
      </form>
    </Form>
  );
};

export default NewMenuForm;
