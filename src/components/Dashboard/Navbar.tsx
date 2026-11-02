"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "../ui/sidebar";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserData } from "@/lib/getUserData";

const Navbar = ({
  image,
  username,
}: {
  image: string | undefined;
  username: string;
}) => {
  const { setTheme } = useTheme();
  const params = useSearchParams();
  const newOrder = params.get("newOrder");
  const [userExpireDate, setUserExpireDate] = useState({
    plan: null,
    expiresAt: null,
  });
  // const router = useRouter();
  const user = useDashboardData((s) => s.user);
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/user?username=" + username);
      const data = await res.json();
      setUserExpireDate({
        plan: data.publicUserInfo.plan,
        expiresAt: data.publicUserInfo?.planExpiresAt,
      });
    };
    fetchUserData();
  }, [newOrder, username]);

  function getRemainingDays(planExpiresAt: Date | string) {
    const now = new Date();
    const expiresAt = new Date(planExpiresAt);
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? separate(diffDays) : 0;
  }
  const convertToPersianPlan = (plan: string) => {
    switch (plan) {
      case "free":
        return "رایگان";
      case "silver":
        return (
          <span className="bg-slate-800 px-2 rounded-lg text-white">
            نقره‌ای
          </span>
        );
      case "gold":
        return (
          <span className="bg-yellow-600 px-2 rounded-lg items-center text-white">
            طلایی
          </span>
        );
      default:
        return plan;
    }
  };
  return (
    <nav className="flex justify-between items-center p-4 sticky top-0 bg-background/40 backdrop-blur-sm  z-50">
      {/* right */}
      <SidebarTrigger />
      <div className=" mr-8 border rounded-lg p-2 font-bold text-xs md:text-lg">
        {userExpireDate.expiresAt ? (
          <>
            {getRemainingDays(userExpireDate.expiresAt || "") === 0 ? (
              <span className="text-red-500 justify-center border-red-500 border rounded-lg p-2 flex">
                اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.
              </span>
            ) : (
              <Link href={"/dashboard"}>
                {getRemainingDays(userExpireDate.expiresAt || "")} روز از اشتراک{" "}
                {convertToPersianPlan(userExpireDate.plan || "")} شما باقی مانده — دمو
              </Link>
            )}
          </>
        ) : (
          "..."
        )}
      </div>
      {/* left */}
      <div className="flex items-center gap-4 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="flex justify-start w-full items-end flex-col "
            >
              روشن
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="flex justify-start w-full items-end flex-col "
            >
              تاریک
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="flex justify-start w-full items-end flex-col "
            >
              سیستم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
