"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { demoSignIn } from "@/demo/browser";

import CustomerForm from "../CustomerForm";
import OtpForm from "../OtpForm";
import { useAuthStore } from "@/stores/useAuthStore";

const toEnglishDigits = (str: string) =>
  str
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632));

const authSchema = z.object({
  fullname: z
    .string({ required_error: "نام کامل الزامی است" })
    .min(2, "نام کامل باید حداقل ۲ کاراکتر باشد"),
  phonenumber: z
    .string({ required_error: "شماره تلفن الزامی است" })
    .transform(toEnglishDigits)
    .refine((val) => /^09\d{9}$/.test(val), "شماره معتبر وارد کنید"),
});

type AuthForm = z.infer<typeof authSchema>;

export default function AuthFlow() {
  const { update } = useSession();

  const {
    step,
    formData,
    otp,
    endTime,
    loading,
    setStep,
    setFormData,
    setOtp,
    setEndTime,
    setLoading,
    reset,
  } = useAuthStore();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  });

  const handleSendOtp = async (data: AuthForm) => {
    try {
      setLoading(true);
      setFormData(data);
      setEndTime(Date.now() + 120 * 1000);

      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phonenumber, name: data.fullname }),
      });

      if (!res.ok) throw new Error("خطا در ارسال کد");

      toast.success("کد دمو: 123456 — پیامکی ارسال نمی‌شود", {
        style: { backgroundColor: "green" },
      });
      setStep("otp");
    } catch (err: any) {
      toast.error(err.message ?? "خطای ناشناخته", {
        style: { backgroundColor: "red" },
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
        style: { backgroundColor: "green" },
      });
      reset();
    } catch (err: any) {
      toast.error(err.message ?? "خطای ناشناخته", {
        style: { backgroundColor: "red" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-black p-4 rounded-lg font-yekan">
      {step === "form" && (
        <CustomerForm loading={loading} form={form} onSubmit={handleSendOtp} />
      )}
      {step === "otp" && formData && (
        <OtpForm
          endTime={endTime!}
          fullname={formData.fullname}
          phonenumber={formData.phonenumber}
          handleBack={() => setStep("form")}
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          loading={loading}
        />
      )}
    </div>
  );
}
