"use client";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">قوانین و مقررات</h1>
      <p className="mb-3">
        این وب‌سایت نسخهٔ دموی بازسازی‌شدهٔ <span className="font-semibold">سفارش‌آنلاین</span> برای نمایش نمونه‌کار است. سرویس اصلی دیگر فعال نیست. این صفحه صرفاً توضیح دمو است و قرارداد خرید یا ثبت‌نام واقعی ایجاد نمی‌کند.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">ثبت‌نام و حساب کاربری</h2>
      <ul className="list-disc pr-6 text-sm space-y-1">
        <li>از نام دلخواه و شمارهٔ نمونهٔ 09000000000 استفاده کنید.</li>
        <li>ورود مشتری با کد ثابت 123456 و داشبورد بدون ورود در دسترس است.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">سفارش و پرداخت</h2>
      <ul className="list-disc pr-6 text-sm space-y-1">
        <li>تمام سفارش‌ها و اشتراک‌ها صرفاً شبیه‌سازی هستند؛ مبلغی دریافت نمی‌شود.</li>
        <li>هیچ سفارشی به کافه یا رستوران ارسال نمی‌شود.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">امتیاز و کوپن</h2>
      <ul className="list-disc pr-6 text-sm space-y-1">
        <li>امتیازها و کوپن‌ها فقط برای امتحان کردن دمو هستند و ارزش مالی ندارند.</li>
        <li>قابلیت انتقال یا فروش ندارند.</li>
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        تغییرات فقط در مرورگر شما ذخیره می‌شود. برای بازگشت به داده‌های اولیه به /demo/reset بروید.
      </p>
    </div>
  );
}
