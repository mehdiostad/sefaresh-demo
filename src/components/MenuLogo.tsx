"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { presetThemes } from "@/lib/presetThemes";

interface LogoProps {
  logo: string;
  title?: string;
  className?: string;
  userTheme?: string;
}
const MenuLogo = ({ logo, title, className, userTheme }: LogoProps) => {
  const theme =
    presetThemes.find((theme) => theme?.id === userTheme) || undefined;
  return (
    <div
      className={cn(
        `flex items-center w-full justify-center relative `,
        className,
        theme?.options[0]?.textColor || "text-white",
      )}
      style={{
        backgroundColor: theme?.options[0]?.color,
        fontFamily: theme?.themeFont || "Yekan Bakh",
      }}
    >
      {/* <div className={cn("absolute bg-black w-[125%] h-[125%] rounded-lg bg-opacity-10 -z-30 blur-lg backdrop-blur-xl" , theme?.logoBgCn)} /> */}
      <div className="flex items-center gap-2 justify-center">
        {theme?.logoTitleProps === "hidden" ? null : (
          <div className={cn("font-bold text-2xl", theme?.logoTitleProps)}>
            {title}
          </div>
        )}
        <div
          className={cn(
            "relative flex items-center w-12 h-12",
            theme?.logoImageProps?.size,
            theme?.logoImageProps?.cn,
          )}
        >
          <Image
            src={logo}
            fill={true}
            alt="logo"
            className="motion-safe:animate-ping ease-in-out absolute inline-flex h-auto w-full rounded-full  opacity-75"
          ></Image>
          <Image
            src={logo}
            className="inline-flex w-full h-auto"
            width={1980}
            priority
            height={1080}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuLogo;
