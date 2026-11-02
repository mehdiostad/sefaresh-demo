"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { IconLoader, IconTruckLoading } from "@tabler/icons-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "نام دسته بندی الزامی است"),
  firstTitle: z.string().optional(),
  secondTitle: z.string().optional(),
  desc: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type CategoryFormProps = {
  userId?: string;
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onBack?: () => void;
};

const CategoryForm = ({
  defaultValues,
  onSubmit,
  onBack,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="space-y-4">
      <div>
        <label className="block mb-1">عنوان دسته بندی</label>
        <input
          type="text"
          {...register("title")}
          className="border p-2 rounded w-full bg-transparent"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">عنوان قیمت</label>
        <input
          type="text"
          {...register("firstTitle")}
          className="border p-2 rounded w-full bg-transparent"
        />
        {errors.firstTitle && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstTitle.message}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-1">عنوان قیمت ثانویه</label>
        <input
          type="text"
          {...register("secondTitle")}
          className="border p-2 rounded w-full bg-transparent"
        />
        {errors.secondTitle && (
          <p className="text-red-500 text-sm mt-1">
            {errors.secondTitle.message}
          </p>
        )}
      </div>

      {onBack ? (
        <div className="flex gap-4 w-full justify-between">
          <Button
            type="submit"
            variant={"outline"}
            className="text-sidebar-foreground flex"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <IconLoader className="animate-spin" />
            ) : (
              <ChevronRight />
            )}
            {isSubmitting ? "در حال ثبت..." : "بعدی"}
          </Button>
          {/* <Button
            type="button"
            variant={"outline"}
            className="text-sidebar-foreground flex"
            onClick={onBack}
          >

            قبلی
              <ChevronLeft />

          </Button> */}
        </div>
      ) : isSubmitting ? (
        <>
          <Button disabled className="flex gap-2">
            <IconTruckLoading />
            در حال ثبت...
          </Button>
        </>
      ) : (
        <Button
          type="submit"
          variant={"outline"}
          className="text-sidebar-foreground"
        >
          ثبت
        </Button>
      )}
    </form>
  );
};

export default CategoryForm;
