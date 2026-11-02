"use client";
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
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { IconUser, IconPhone } from "@tabler/icons-react";
import { useState } from "react";

const variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function CustomerForm({
  form,
  onSubmit,
  loading,
}: {
  form: any;
  onSubmit: any;
  loading: boolean;
}) {
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <motion.div
      key="form"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      dir="rtl"
    >
      <DialogHeader>
        <DialogTitle className="mb-4 font-medium font-yekan">
          <p className="font-bold mb-2 text-center">
            به{" "}
            <span className="text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
              سفارش‌آنلاین
            </span>{" "}
            خوش آمدید
          </p>
          <p className="text-sm  text-center">
            برای ورود دمو، نام دلخواه و شمارهٔ نمونه وارد کنید.
          </p>
        </DialogTitle>
      </DialogHeader>

      <div className="p-4 border rounded-2xl shadow-sm font-yekan">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Fullname */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <IconUser className="w-5 h-5 " />
                      <Input placeholder="نام کامل شما" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone number */}
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تلفن</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <IconPhone className="w-5 h-5 " />
                      <Input placeholder="09000000000" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(val) => setAcceptTerms(!!val)}
              />
              <label
                htmlFor="terms"
                className="text-xs  leading-tight"
              >
                توضیحات دمو در{" "}
                <a href="/terms" target="_blank" className="underline">
                  قوانین و مقررات
                </a>{" "}
                و{" "}
                <a href="/privacy" target="_blank" className="underline">
                  حریم خصوصی
                </a>{" "}
                را خواندم.
              </label>
            </div>

            {/* Submit button */}
            <Button type="submit" disabled={loading || !acceptTerms}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  در حال ارسال...
                </span>
              ) : (
                "ارسال کد"
              )}
            </Button>
          </form>
        </Form>

        {/* Info text */}
        <p className="mt-3 text-xs text-center ">
          کد دمو: 123456 — هیچ پیامکی ارسال نمی‌شود.
        </p>
      </div>
    </motion.div>
  );
}
