"use client";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">حریم خصوصی</h1>
      <p className="mb-3">
        این نسخهٔ نمایشی <span className="font-semibold">سفارش‌آنلاین</span> با داده‌های نمونه اجرا می‌شود. لطفاً اطلاعات واقعی وارد نکنید. ورود و تغییرات دمو در حافظهٔ محلی مرورگرتان نگهداری می‌شود.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        داده‌های محلی دمو
      </h2>
      <ul className="list-disc pr-6 text-sm space-y-1">
        <li>نام دلخواه و شمارهٔ نمونه برای نمایش ورود دمو؛ بدون ارسال پیامک.</li>
        <li>تاریخچه سفارش‌ها برای نمایش و بهبود تجربه کاربری.</li>
        <li>امتیازها و کوپن‌های دریافتی جهت مدیریت حساب کاربری.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        نحوه‌ی استفاده از اطلاعات
      </h2>
      <ul className="list-disc pr-6 text-sm space-y-1">
        <li>نمایش پیام موفقیت و سابقهٔ سفارش در همین مرورگر، بدون اتصال به خدمات پیامک.</li>
        <li>نمایش سابقه‌ی خرید و امتیازهای کسب‌شده.</li>
        <li>تغییرات دمو بین بازدیدکنندگان مختلف به اشتراک گذاشته نمی‌شود.</li>
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        برای پاک کردن داده‌های این مرورگر و شروع مجدد به /demo/reset بروید.
      </p>
    </div>
  );
}
