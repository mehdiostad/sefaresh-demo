"use client";
import { imageUrl } from "@/demo/seed";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MotionModal from "../Modals/MotionModal";
import separate from "@/utils/number";
import { IconHelpOctagonFilled, IconLibraryPhoto } from "@tabler/icons-react";
import { removeZerosFromNumber } from "@/lib/removeZerosFromNumber";
import { cn } from "@/lib/utils";
import { Camera, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface MenuItemProps {
  _id?: string;
  itemName: string;
  smallPrice?: number;
  largePrice?: number;
  img: string;
  desc?: string;
  pageVisible: boolean;
  secondItemName?: string;
  firstTitle?: string;
  secondTitle?: string;
  themeFont?: string;
  itemCn?: string;
  modalBtnColor?: string;
  available: boolean;
  id: string;
}

const MenuItem = ({
  id,
  itemName,
  smallPrice,
  largePrice,
  img,
  desc,
  pageVisible,
  secondItemName,
  firstTitle,
  available,
  secondTitle,
  itemCn,
  themeFont,
  modalBtnColor,
}: MenuItemProps) => {
  const [showModal, setShowModal] = useState(false);
  const [animateUnavailable, setAnimateUnavailable] = useState(false);
  const [jiggle, setJiggle] = useState(false);

  const randomJiggleTime = useMemo(() => 4000 + Math.random() * 3000, []);
  useEffect(() => {
    if (!available || !secondItemName) return;

    const interval = setInterval(() => {
      setJiggle(true);
      setTimeout(() => setJiggle(false), 500);
    }, randomJiggleTime);

    return () => clearInterval(interval);
  }, [available, secondItemName, randomJiggleTime]);

  useEffect(() => {
    if (!pageVisible) setShowModal(false);
  }, [pageVisible]);

  const handleClick = () => {
    if (!available) {
      setAnimateUnavailable(true);
      setTimeout(() => setAnimateUnavailable(false), 400);
      return;
    }
    setShowModal(true);
  };
  const randomDelay = useMemo(() => Math.random() * 5, []);
  return (
    <AnimatePresence>
      <motion.div
        key={id}
        whileHover={
          available ? { scale: 1.01, backgroundColor: "rgba(0,0,0,0.08)" } : {}
        }
        whileTap={available ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "w-full bg-black/10 p-3 rounded-xl items-center transition-all flex justify-between relative overflow-hidden group cursor-pointer",
          !available && "opacity-80",
        )}
        onClick={handleClick}
      >
        {}
        {available && (
          <motion.div
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4 + randomDelay,
              delay: randomDelay,
              duration: 1.5 + randomDelay / 5,
              ease: "easeInOut",
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
            className="absolute inset-0 w-full h-full -skew-x-12 pointer-events-none z-0"
          />
        )}

        {}
        <div className="z-10 flex items-center">
          {secondItemName && available ? (
            <div className="flex justify-center items-center text-black/50 group-hover:text-[#BE1E2D] transition-colors gap-0.5">
              <motion.div
                animate={
                  jiggle
                    ? {
                        rotate: [0, -15, 15, -15, 15, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Camera size={20} strokeWidth={2.5} />
              </motion.div>
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          ) : !secondItemName && available ? (
            <div className="flex flex-col gap-2 pl-2">
              <div
                className={cn(
                  "text-sm font-medium ",
                  "flex gap-1",
                  !available && "opacity-40 line-through",
                )}
              >
                {smallPrice && Number(smallPrice) !== 0 ? (
                  <div>{separate(removeZerosFromNumber(smallPrice))}</div>
                ) : null}
                {Number(smallPrice) !== 0 && largePrice && "-"}
                {largePrice && (
                  <div>{separate(removeZerosFromNumber(largePrice))}</div>
                )}
                <ChevronRight size={18} strokeWidth={1.5} />
              </div>
            </div>
          ) : !available ? (
            <motion.span
              className="text-[10px] font-bold bg-[#BE1E2D] text-white py-0.5 px-2 rounded-full flex items-center shadow-sm"
              animate={
                animateUnavailable
                  ? { scale: [1, 1.2, 1], x: [0, -5, 5, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
            >
              تمام شد
            </motion.span>
          ) : null}
        </div>

        {}
        <div
          className="font-bold gap-0.5 flex flex-col items-end z-10"
          // dir="rtl"
        >
          <div className="flex items-center gap-2" dir="rtl">
            {!secondItemName && img && (
              <div className="relative overflow-hidden   w-10 h-10 rounded-full border border-gray-300">
                <div className=" absolute bg-gray-200/10 w-full h-full animate-pulse z-0" />
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/items/${img}?versionId=`}
                  alt={itemName}
                  width={40}
                  height={40}
                  onLoadingComplete={(image) =>
                    image.classList.remove("opacity-0")
                  }
                  className="transition-opacity duration-500 opacity-0 z-10"
                />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  "text-xl whitespace-nowrap ",
                  !available && "opacity-50 line-through",
                  secondItemName ? "text-black/90" : "text-white/90",
                )}
              >
                {itemName}
              </span>
              {!secondItemName && (
                <p className="text-xs  max-w-16 truncate text-white/60">
                  {desc}
                </p>
              )}
            </div>
          </div>

          {secondItemName ? (
            <span
              className={cn(
                "text-lg font-bold text-[#BE1E2D] whitespace-nowrap",
                !available && "opacity-40 line-through",
              )}
            >
              {secondItemName}
            </span>
          ) : null}
        </div>
      </motion.div>

      {showModal && available && (
        <MotionModal
          itemName={itemName}
          themeFont={themeFont}
          img={img}
          desc={desc}
          setShowModal={setShowModal}
          smallPrice={smallPrice}
          largePrice={largePrice}
          firstTitle={firstTitle}
          secondTitle={secondTitle}
          btnColor={modalBtnColor}
        />
      )}
    </AnimatePresence>
  );
};

export default MenuItem;
