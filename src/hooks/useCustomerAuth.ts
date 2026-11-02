"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { demoSignIn } from "@/demo/browser";

const authSchema = z.object({
  fullname: z
    .string({ required_error: "نام کامل الزامی است" })
    .min(2, "نام کامل باید حداقل ۲ کاراکتر باشد"),
  phonenumber: z
    .string({ required_error: "شماره تلفن الزامی است" })
    .min(11, "شماره تلفن نامعتبر می باشد.")
    .max(11, "شماره تلفن نامعتبر می باشد.")
    .transform((val) =>
      val.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    )
    .refine((val) => /^09\d{9}$/.test(val), "شماره معتبر وارد کنید"),
});

export type AuthForm = z.infer<typeof authSchema>;

export function useCustomerAuth() {
  const { data: session } = useSession();

  const [step, setStep] = useState<"form" | "otp">(session?.user.role === "customer" ? "otp" : "form");
  const [formData, setFormData] = useState<AuthForm | null>(null);
  const [otp, setOtp] = useState("");
  const [endTime, setEndTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues:
      session?.user.role === "customer"
        ? {
            fullname: session.user?.fullname || "",
            phonenumber: session.user?.phone || "",
          }
        : undefined,
  });

  const handleSendOtp = async (data: AuthForm) => {
    try {
      setLoading(true);
      setEndTime(Date.now() + 120 * 1000);
      setFormData(data);

      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phonenumber, name: data.fullname }),
      });

      if (!res.ok) throw new Error("خطا در ارسال کد، لطفا دوباره تلاش کنید");

      toast.success("کد دمو: 123456 — پیامکی ارسال نمی‌شود", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });

      setStep("otp");
    } catch (err: any) {
      toast.error(err.message, {
        style: { backgroundColor: "#ef4444", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData?.phonenumber,
          code: otp,
          name: formData?.fullname,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "کد معتبر نیست");

      await demoSignIn();

      toast.success("با موفقیت وارد شدید", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });
    } catch (err: any) {
      toast.error(err.message, {
        style: { backgroundColor: "#ef4444", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("form");
    setFormData(null);
    setOtp("");
    setEndTime(null);
    form.reset();
  };

  return {
    step,
    form,
    formData,
    otp,
    setOtp,
    endTime,
    loading,
    handleSendOtp,
    handleVerifyOtp,
    resetFlow,
    session,
  };
}
