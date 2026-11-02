"use client";

import { useSelectionStore } from "@/stores/useSelectionStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import separate from "@/utils/number";
import { cn } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import CheckoutForm from "./Customer/CheckoutForm";
import SelectedItemsCount from "./SelectedItemsCount";
import { PresetTheme, presetThemes } from "@/lib/presetThemes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SelectedItems = ({
  username,
  tax,
  userTheme,
  pointRate,
  menuName,
  userAllItems,
  isLoyaltyActive,
}: {
  username: string;
  tax?: number;
  userTheme: string;
  pointRate?: number;
  menuName: string;
  userAllItems: any[];
  isLoyaltyActive: boolean;
}) => {
  const theme = presetThemes.find((t) => t.id === userTheme) as PresetTheme;
  const items = useSelectionStore((s) => s.selectedItems);
  const removeItem = useSelectionStore((s) => s.removeItem);
  const updateQuantity = useSelectionStore((s) => s.updateQuantity);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const [openSelectedItems, setOpenSelectedItems] = useState(false);

  const closeSheet = () => setOpenSelectedItems(false);

  return (
    <Sheet open={openSelectedItems} onOpenChange={setOpenSelectedItems}>
      <SheetTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          aria-label="سبد سفارش"
          className="cursor-pointer active:scale-90 transition-transform"
        >
          <SelectedItemsCount selectionIconProps={theme?.selectionIconProps} />
        </div>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-[3rem] border-t border-white/20 bg-black/60 backdrop-blur-2xl p-0 overflow-hidden flex flex-col [&>button]:hidden"
      >
        <div className="absolute top-6 left-6 z-50">
          <button
            onClick={closeSheet}
            className="p-2 rounded-full bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
        {}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2" />

        <SheetHeader className="px-6 py-2">
          <SheetTitle className="text-white text-2xl font-black text-right flex items-center justify-end gap-2">
            سفارشات شما
            <ShoppingBag className="text-[#BE1E2D]" size={24} />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-white/40 space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <ShoppingBag size={40} strokeWidth={1} />
                </div>
                <p>لیست سفارشات شما خالی است</p>
              </motion.div>
            ) : (
              items.map((i, index) => (
                <motion.div
                  layout
                  key={i.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center justify-between"
                >
                  {}
                  <div className="flex flex-col items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
                    <button
                      onClick={() => updateQuantity(i.id, i.qty + 1)}
                      className="p-2 text-white hover:text-green-400 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                    <span className="text-white font-bold text-lg">
                      {separate(i.qty)}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(i.id, Math.max(i.qty - 1, 1))
                      }
                      className="p-2 text-[#BE1E2D] hover:opacity-70 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                  </div>

                  {}
                  <div className="flex-1 px-4 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <Trash2
                        size={16}
                        className="text-white/20 hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => removeItem(i.id)}
                      />
                      <p className="text-white font-bold text-lg text-right">
                        {i.name}
                      </p>
                    </div>
                    <p className="text-[#BE1E2D] font-medium" dir="rtl">
                      {separate(i.price)}{" "}
                      <small className="text-[10px] text-white/40 font-light">
                        تومان
                      </small>
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {}
        {items.length > 0 && (
          <div className="bg-white/5 backdrop-blur-3xl border-t border-white/10 p-6 pb-10 space-y-4">
            <div className="flex justify-between items-center" dir="rtl">
              <div className="flex flex-col">
                <span className="text-white/50 text-xs">مجموع قابل پرداخت</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">
                    {tax
                      ? separate(Number((totalPrice * (1 + tax)).toFixed(0)))
                      : separate(totalPrice)}
                  </span>
                  <span className="text-xs text-white/40">تومان</span>
                </div>
              </div>

              {tax && (
                <div className="text-left">
                  <span className="text-[10px] px-2 py-1 bg-[#BE1E2D]/20 text-[#BE1E2D] rounded-full border border-[#BE1E2D]/30">
                    %{separate(tax * 100)} مالیات
                  </span>
                </div>
              )}
            </div>

            <CheckoutForm
              pointRate={pointRate}
              closeSheet={closeSheet}
              username={username}
              tax={tax}
              totalPrice={totalPrice}
              items={items}
              menuName={menuName}
              userAllItems={userAllItems}
              isLoyaltyActive={isLoyaltyActive}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SelectedItems;
