import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "@/components/EditUser/EditUser";
import { getDemoSession as getServerSession } from "@/demo/server";
import { authOptions } from "@/lib/authOptions";
import { ChevronLeft } from "lucide-react";
import UserInfo from "@/components/UserInfo/UserInfo";
import UserDescription from "@/components/Dashboard/UserDescription/UserDescription";
import UserTheme from "@/components/Dashboard/UserTheme/UserTheme";
import { Card } from "@/components/ui/card";

const SettingUserPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">داشبورد</BreadcrumbLink>
          </BreadcrumbItem>
          <ChevronLeft width={15} />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/settings">تنظیمات</BreadcrumbLink>
          </BreadcrumbItem>
          <ChevronLeft width={15} />
          <BreadcrumbItem>
            <BreadcrumbPage>{session?.user.role === "admin" ? session.user.username : null}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* Right */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* INFORMATION CONTAINER */}
          <div className="dark:bg-muted/10 bg-muted/60 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">اطلاعات شما</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>ویرایش</Button>
                </SheetTrigger>
                <EditUser id={session?.user.id} />
              </Sheet>
            </div>
            <UserInfo />
          </div>
        </div>
        {/* Left */}
        <div className="w-full xl:w-2/3 space-y-6 ">
          {/* USER CARD CONTAINER */}
          {/* <UserDescription /> */}
          <Card className="p-4 dark:bg-muted/10 bg-muted/60 ">
            <UserTheme userId={session?.user.id || ""} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingUserPage;
