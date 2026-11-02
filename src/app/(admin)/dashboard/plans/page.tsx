import PlanCard from "@/components/PlanCard/PlanCard";
import dynamic from "next/dynamic";


export default function PlansPage() {
  return (
    <div className="p-8  mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">انتخاب پلن</h1>

      <div className="flex w-full gap-6">
        <PlanCard />
      </div>

      <p className="text-sm text-center mt-8 text-gray-600">
        پلن رایگان به‌مدت یک‌ماه به‌صورت خودکار فعال می‌شود. برای استفاده بیشتر، یکی از پلن‌های بالا را تهیه کنید.
      </p>
    </div>
  );
}
