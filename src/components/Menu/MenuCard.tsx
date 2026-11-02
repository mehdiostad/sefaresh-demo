import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface MenuCardProps {
  menuName: string;
  firstTitle?: string;
  secondTitle?: string;
  subTitle?: string;
  textColor?: string;
  cardProps?: string;
  menuIcon?: React.ElementType | string
}
const MenuCard = ({
  menuName,
  firstTitle,
  secondTitle,
  subTitle,
  textColor,
  cardProps = "",
  menuIcon,
}: MenuCardProps) => {
const Icon = menuIcon as React.ElementType;
  return (
    <div
      className={cn(
        "flex justify-between w-full rounded-lg py-4 text-2xl font-bold px-3 border border-dashed bg-transparent items-center shadow-2xl",
        textColor,
        cardProps
      )}
    >
      {subTitle ? (
        <div>{subTitle}</div>
      ) : (
        <div className="flex gap-4" dir="rtl">
          <div>{firstTitle || "قیمت"}</div>
          {secondTitle && <div>{secondTitle}</div>}
        </div>
      )}

        {menuIcon  ? (
          <div className={cn("relative", "w-16 h-16 p-2 ")}>
           <Icon color="white"/>
          </div>
          ) : null}
      <div className="flex items-center gap-2">
        <div>{menuName}</div>
      </div>
    </div>
  );
};

export default MenuCard;
