"use client";

import { PresetTheme, presetThemes, SocialInfoProps } from "@/lib/presetThemes";
import {
  IconInfoCircle,
  IconMapPin,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MenuInfo = ({ info }: { info: SocialInfoProps }) => {
  switch (info.type) {
    case "socialMedia":
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[12px] text-white/80 font-bold tracking-widest uppercase">
            شبکه‌های اجتماعی
          </p>
          <div className="flex gap-4">
            {info.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                >
                  <Icon size={22} strokeWidth={1.5} />
                </Link>
              );
            })}
          </div>
        </div>
      );

    case "address":
      const AddressIcon = info.icon || IconMapPin;
      return (
        <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="p-2 rounded-xl text-white/40 bg-white/5 ">
            <AddressIcon size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[12px] text-white/40 font-bold">آدرس</p>
            <p className="text-sm leading-relaxed text-white/90">{info.desc}</p>
          </div>
        </div>
      );

    case "info":
      const Icon = info.icon || IconClock;

      const isLongText =
        typeof info?.desc === "string" && info.desc.length > 50;

      return (
        <div
          className={cn(
            "flex gap-4 p-3 rounded-2xl border",
            isLongText
              ? "bg-yellow-500/10 border-yellow-500/20"
              : "bg-white/5 border-white/5",
          )}
        >
          <div
            className={cn(
              "p-2 rounded-xl shrink-0 my-auto ",
              isLongText
                ? "text-yellow-500 bg-yellow-500/10"
                : "text-white/40 bg-white/5",
            )}
          >
            {isLongText ? <IconAlertCircle size={20} /> : <Icon size={20} />}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[12px] opacity-40 font-bold">
              {isLongText ? "توجه" : "اطلاعات"}
            </p>
            <p
              className={cn(
                "text-sm leading-relaxed",
                isLongText ? "text-white/80 " : "text-white/90",
              )}
            >
              {info.desc}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const MenuInfoPopover = ({ userTheme }: { userTheme: string }) => {
  const theme = presetThemes.find(
    (theme) => theme.id === userTheme,
  ) as PresetTheme;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="outline-none transition-transform active:scale-90">
          <IconInfoCircle
            color={open ? "#BE1E2D" : "black"}
            size={28}
            strokeWidth={1.5}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 bg-black/60 backdrop-blur-2xl  border-white/10 rounded-[2.5rem] p-5 shadow-2xl flex flex-col gap-5 font-yekan text-white mt-2 relative overflow-hidden"
        align="end"
        dir="rtl"
      >
        {}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#BE1E2D]/20 rounded-full blur-3xl pointer-events-none" />

        {theme?.socialInfo?.map((info, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <MenuInfo info={info} />
          </motion.div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default MenuInfoPopover;
