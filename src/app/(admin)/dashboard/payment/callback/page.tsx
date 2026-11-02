"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");

  useEffect(() => {
    const verifyPayment = async () => {
      const trackId = searchParams.get("trackId");
      const plan = searchParams.get("plan");
      if (!trackId || !plan) {
        setStatus("error");
        return;
      }
      try {
        const res = await fetch(`/api/zibal/verify?trackId=${trackId}&plan=${plan}`);
        const data = await res.json();
        if (data.success && (res.status === 200 || res.status === 201)) {
          setStatus("success");
          setTimeout(() => {
            router.refresh()
            router.push("/dashboard?newOrder=true")
          }, 3000);
        } else if(res.status === 400) {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="p-10 text-center">
      {status === "checking" && <p>در حال شبیه‌سازی اشتراک...</p>}
      {status === "success" && <p className="text-green-600">اشتراک نمایشی فعال شد؛ هیچ پرداختی انجام نشد. در حال انتقال...</p>}
      {status === "error" && <p className="text-red-600">خطا در تایید پرداخت. لطفاً با پشتیبانی تماس بگیرید.</p>}
    </div>
  );
}
