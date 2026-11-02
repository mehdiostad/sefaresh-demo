"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { IconLoader, IconSquareRoundedCheckFilled } from "@tabler/icons-react";
import { formatPrice } from "@/utils/formatPrice";

const schema = z.object({
  itemName: z.string().min(1, "نام آیتم الزامی است"),
  img: z.union([z.instanceof(File), z.undefined()]),
  price: z.string().min(1, "قیمت الزامی است"),
  secondaryPrice: z.string().optional(),
  description: z.string().optional(),
  secondItemName: z
    .string()
    .min(2, "لطفا نام انگلیسی آیتم را وارد کنید")
    .optional(),
});
type FormData = z.infer<typeof schema>;

type ItemFormProps = {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onBack?: () => void;
  secondPrice?: string | undefined;
  multiLang?: boolean;
};

const ItemForm = ({
  defaultValues,
  onSubmit,
  onBack,
  secondPrice,
  multiLang,
}: ItemFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      img: undefined,
    },
  });
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} dir="rtl" className="space-y-4">
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان آیتم</FormLabel>
              <FormControl>
                <Input placeholder="مثلاً: قهوه فرانسه" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {multiLang && (
          <FormField
            control={form.control}
            name="secondItemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان انگلیسی</FormLabel>
                <FormControl>
                  <Input placeholder="example: Latte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>قیمت (به تومان)</FormLabel>
              <FormControl>
                <Input placeholder="مثلاً: ۵۰۰۰۰" {...field} type="number" />
              </FormControl>
              {field.value && (
                <p className="text-xs text-muted-foreground mt-1">
                  معادل: {formatPrice(field.value)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {secondPrice && (
          <FormField
            control={form.control}
            name="secondaryPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>قیمت {secondPrice} (به تومان)</FormLabel>
                <FormControl>
                  <Input placeholder="مثلاً: ۵۰۰۰۰" {...field} type="number" />
                </FormControl>
                {field.value && (
                  <p className="text-xs text-muted-foreground mt-1">
                    معادل: {formatPrice(field.value)}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea placeholder="اختیاری" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="img"
          render={() => (
            <FormItem>
              <FormLabel>تصویر آیتم</FormLabel>
              <FormControl>
                <div>
                  <input
                    type="file"
                    id="img-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue("img", file || undefined, {
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

                  {form.watch("img") && (
                    <p className="text-sm text-muted-foreground mt-2">
                      فایل انتخاب‌شده: {form.watch("img")?.name}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {onBack ? (
          <div className="flex gap-4 w-full justify-between">
            <Button
              type="submit"
              variant={"outline"}
              className="text-sidebar-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <IconLoader className="animate-spin" />
              ) : (
                <IconSquareRoundedCheckFilled />
              )}
              {isSubmitting ? "در حال ثبت..." : "ثبت"}
            </Button>
            {/* <Button
              type="button"
              variant={"outline"}
              className="text-sidebar-foreground"
              onClick={onBack}
            >
              قبلی
              <ChevronLeft />
            </Button> */}
          </div>
        ) : (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "در حال ثبت..." : "ارسال"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ItemForm;
