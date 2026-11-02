"use client";
import { imageUrl as demoImageUrl } from "@/demo/seed";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Pencil, Check } from "lucide-react";
import separate from "@/utils/number";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { toast } from "sonner";
import { removeZerosFromNumber } from "@/lib/removeZerosFromNumber";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface MotionModalProps {
  itemName: string;
  img?: string;
  desc?: string;
  setShowModal: (show: boolean) => void;
  smallPrice?: number;
  largePrice?: number;
  firstTitle?: string;
  secondTitle?: string;
  themeFont?: string;
  btnColor?: string;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const MotionModal = ({
  itemName,
  img,
  desc,
  setShowModal,
  smallPrice,
  largePrice,
  firstTitle,
  secondTitle,
  themeFont,
  btnColor,
}: MotionModalProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<"first" | "second">("first");
  const modalRef = useRef<HTMLDivElement>(null);
  const items = useSelectionStore((s) => s.selectedItems);
  const addItem = useSelectionStore((s) => s.addItem);

  const closeModal = () => setIsVisible(false);
  const { activePrice, activeTitle } = useMemo(() => {
    const isFirst = selectedType === "first";

    let price = isFirst ? smallPrice || largePrice : largePrice || smallPrice;

    let title = "";
    if (isFirst) {
      title = smallPrice !== 0 ? firstTitle || "" : "";
    } else {
      title = secondTitle || "";
    }

    return {
      activePrice: price || 0,
      activeTitle: title,
    };
  }, [selectedType, smallPrice, largePrice, firstTitle, secondTitle]);
  const handleAddOrder = () => {
    const fullName = `${itemName} ${activeTitle}`.trim();
    const exists = items.some((a) => a.name.trim() === fullName);

    if (exists) {
      toast.warning(`${fullName} را قبلا اضافه کرده‌اید.`, {
        style: { background: "#ab890f" },
      });
      return;
    }

    addItem({
      name: fullName,
      price: activePrice || 0,
      id: fullName,
      qty: 1,
    });

    toast.success(`${fullName} اضافه شد`, {
      icon: <Check className="w-4 h-4" />,
      style: { background: "green" },
    });
    closeModal();
  };
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/items/${img}?versionId=`;

  if (typeof window === "undefined") return null;
  return createPortal(
    <AnimatePresence onExitComplete={() => setShowModal(false)}>
      {isVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: themeFont || "Yekan Bakh" }}
            className="relative w-full max-w-[360px] bg-black/60 backdrop-blur-lg border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#BE1E2D]/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Content Container */}
            <div className="flex flex-col items-center">
              {/* Image Section */}
              <div className="relative w-full pb-0 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6">
                {img && (
                  <div className="w-52 h-80 xs:h-96">
                    {isLoading && (
                      <Skeleton className="bg-black/60 w-full h-full rounded-xl z-50" />
                    )}
                    {
                      <Image
                        src={imageUrl}
                        alt="itemImage"
                        width={200}
                        height={200}
                        className={`object-cover w-full h-full rounded-md transition-opacity duration-300 ${
                          isLoading ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                      />
                    }
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="px-8 w-full text-center space-y-2 mt-2" dir="rtl">
                <h3 className="text-2xl font-black text-white">{itemName}</h3>
                {desc && (
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                )}
              </div>

              {/* Interaction Section */}
              <div className="w-full p-6 space-y-2">
                {/* Segmented Picker (Only if two prices exist) */}
                {smallPrice && largePrice && (
                  <div className="relative flex p-1 overflow-hidden bg-black/40 rounded-2xl border border-white/5">
                    <motion.div
                      className="absolute inset-y-1 rounded-xl bg-white/10 shadow-inner"
                      initial={false}
                      animate={{
                        x: selectedType === "first" ? "100%" : "0%",
                        width: "50%",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                    <button
                      onClick={() => setSelectedType("second")}
                      className={cn(
                        "relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors",
                        selectedType === "second"
                          ? "text-white"
                          : "text-white/40",
                      )}
                    >
                      {secondTitle}
                    </button>
                    <button
                      onClick={() => setSelectedType("first")}
                      className={cn(
                        "relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors",
                        selectedType === "first"
                          ? "text-white"
                          : "text-white/40",
                      )}
                    >
                      {firstTitle}
                    </button>
                  </div>
                )}

                {/* Price Display */}
                <div
                  className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"
                  dir="rtl"
                >
                  <span className="text-white/50 text-xs">قیمت</span>
                  <div className="flex items-center gap-1">
                    <motion.span
                      key={activePrice}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xl font-black text-white"
                    >
                      {separate(removeZerosFromNumber(activePrice || 0))}
                    </motion.span>
                    <span className="text-[10px] text-white/40">تومان</span>
                  </div>
                </div>

                {/* Main Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddOrder}
                  style={{ backgroundColor: "#BE1E2D" }}
                  className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-black/20 transition-all"
                >
                  <Pencil size={18} className="opacity-80" />
                  <span>یادداشت سفارش {activeTitle}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default MotionModal;
