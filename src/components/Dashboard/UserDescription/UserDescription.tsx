"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardData } from "@/stores/useDashboardData";
import React from "react";

const UserDescription = () => {
  const userData = useDashboardData((s) => s.user);
  return (
    <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage src={userData?.menuLogo} />
          <AvatarFallback>SAF</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">{userData?.username}</h1>
      </div>
      {userData?.description ||
        "در قسمت ویرایش، میتوانید توضیحات کافه خود را اضافه کنید."}
    </div>
  );
};

export default UserDescription;
