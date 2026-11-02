import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import separate from "@/utils/number";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

const variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function OtpForm({
  otp,
  setOtp,
  onVerify,
  loading,
  phonenumber,
  fullname,
  handleBack,
  endTime,
}: {
  otp: string;
  setOtp: (val: string) => void;
  onVerify: () => void;
  loading: boolean;
  phonenumber: string;
  handleBack: () => void;
  fullname: string;
  endTime: number | null;
}) {
  const [counter, setCounter] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      if (endTime) {
        const remaining = Math.max(
          0,
          Math.floor((endTime - Date.now()) / 1000)
        );
        setCounter(remaining);

        if (remaining <= 0) {
          clearInterval(timer);
          setOtp("");
          handleBack();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, handleBack]);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${separate(minutes)}:${seconds < 10 ? separate(0) : ""}${separate(
      seconds
    )}`;
  };

  return (
    <motion.div
      key="otp"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <DialogHeader>
        <DialogTitle>تأیید شماره</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 items-center">
        <div className="text-center flex flex-col gap-0">
          <span>
            <strong className="ml-1">{fullname} عزیز،</strong>
            کد دمو 123456 است. برای شمارهٔ نمونهٔ
            <strong className="mx-1">
              {separate(phonenumber).split(",").join("")}
            </strong>{" "}
            پیامکی ارسال نمی‌شود.
          </span>
          <span
            onClick={() => {
              handleBack();
              setOtp("");
            }}
            className="flex justify-center items-center text-blue-600 gap-2 cursor-pointer mt-2"
          >
            <Edit size={12} />
            ویرایش
          </span>
        </div>

        {/* OTP Input */}
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup dir="ltr" className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="border border-gray-400 text-black text-lg rounded-md text-center 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Timer */}
        <div className="text-lg text-red-600 mt-2 font-bold">
          {counter > 0 && counter < 120 ? formatTime(counter) : null}
        </div>

        {/* Verify Button */}
        <Button onClick={onVerify} disabled={loading || otp.length < 6} dir="rtl">
          {loading ? "در حال بررسی..." : "تأیید کد"}
        </Button>
      </div>
    </motion.div>
  );
}
