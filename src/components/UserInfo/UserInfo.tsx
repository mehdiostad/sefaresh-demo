"use client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDashboardData } from "@/stores/useDashboardData";
import { format } from "date-fns-jalali";

const UserInfo = () => {
  const user = useDashboardData((s) => s.user);
  if (!user) return <div className="spinner" />;
  return (
    <div className="dark:bg-muted/10 bg-muted/60 p-4 rounded-lg">
      <div className="space-y-4 mt-4">
        {/* <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-muted-foreground">کامل شدن اطلاعات</p>
          <Progress value={66} />
        </div> */}
        <div className="flex items-center gap-2">
          <span className="font-bold">عنوان منوی شما:</span>
          <span>{user?.menuName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">نام کاربری:</span>
          <span>{user?.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">ایمیل:</span>
          <span>{user?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">آدرس:</span>
          <span>{user?.address || "لطفا آدرس خود را وارد نمایید."}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">تلفن:</span>
          <Badge>{user?.phone || "لطفا شماره تلفن خود را وارد نمایید."}</Badge>
        </div>
      </div>
      {user?.createdAt && (
        <p className="text-sm text-muted-foreground mt-4">
          ملحق شده به سفارش آنلاین در تاریخ {format(user?.createdAt, "PPP")}
        </p>
      )}
    </div>
  );
};

export default UserInfo;
