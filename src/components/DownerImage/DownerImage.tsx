import { cn } from "@/lib/utils";
import React from "react";

const DownerImage = ({ optionalText, className }: DownerImageProps) => {
  return (
    <div
      className={cn(
        `hidden xs:flex w-96 h-80
         absolute -bottom-36 -left-44
         border rotate-45 -z-20 `, className
      )}
    >
      {optionalText && (
        <p
          className="text-white flex justify-start items-center  p-2  font-bold h-full w-1/3"
          dir="rtl"
        >
          {optionalText}
        </p>
      )}
    </div>
  );
};

export default DownerImage;
