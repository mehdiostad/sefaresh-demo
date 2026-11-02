"use client";
import { imageUrl } from "@/demo/seed";
import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ItemProps } from "./Menu";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronLeft } from "lucide-react";
import MotionModal from "../Modals/MotionModal";
import separate from "@/utils/number";
import { cn } from "@/lib/utils";

const SearchItems = ({
  items,
  searchIconProps,
  searchModalBtnColor,
  themeFont,
}: {
  items: ItemProps[];
  searchIconProps?: {
    color?: string;
    cn?: string;
  };
  searchModalBtnColor?: string;
  themeFont?: string;
}) => {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(query.toLowerCase()),
  );

  const handleItemClick = (e: React.MouseEvent, item: ItemProps) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.available) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  return (
    <>
      <Sheet
        open={openSheet}
        onOpenChange={(open) => {
          setOpenSheet(open);
          if (!open) setQuery("");
          else {
            setTimeout(() => inputRef.current?.focus(), 150);
          }
        }}
      >
        <SheetTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            aria-label="جستجوی منو"
            className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition-all active:scale-90"
          >
            <Search
              strokeWidth={1.5}
              size={28}
              color={searchIconProps?.color || "white"}
              className={searchIconProps?.cn}
            />
          </div>
        </SheetTrigger>

        <SheetContent
          side="top"
          className="h-full border-none bg-black/60 backdrop-blur-2xl p-0 overflow-hidden [&>button]:text-white [&>button]:scale-150 [&>button]:left-6 [&>button]:right-auto"
        >
          <div className="pt-16 pb-6 px-6">
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                size={20}
              />
              <input
                ref={inputRef}
                dir="rtl"
                placeholder="جستجو در منو..."
                className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl pr-12 pl-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/50 transition-all font-yekan"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div
            className={cn(
              "px-6 pb-20 overflow-y-auto h-[calc(100%-140px)]",
              showModal ? "pointer-events-none select-none" : "",
            )}
            dir="rtl"
          >
            <AnimatePresence mode="popLayout">
              {query.length > 0 && (
                <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.itemName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={(e) => handleItemClick(e, item)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-2xl border border-white/5 transition-all",
                        item.available
                          ? "bg-white/5 hover:bg-white/10 active:scale-[0.98] cursor-pointer"
                          : "opacity-40 grayscale pointer-events-none",
                      )}
                    >
                      {item.available && (
                        <div className="w-14 h-14 rounded-xl bg-black/40 overflow-hidden">
                          {item.img ? (
                            <img
                              src={imageUrl(item.img, "items")}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                      )}
                      <div className="flex-1 text-right">
                        <h4 className="text-white font-bold">
                          {item.itemName}
                        </h4>
                        <p className="text-[#BE1E2D] text-sm">
                          {separate(item.price)} تومان
                        </p>
                      </div>
                      {item.available ? (
                        <ChevronLeft size={18} className="text-white/20" />
                      ) : (
                        <p className="text-gray-400 text-xs">ناموجود</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </SheetContent>
      </Sheet>

      {}
      <AnimatePresence>
        {showModal && selectedItem && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MotionModal
              itemName={selectedItem.itemName}
              themeFont={themeFont}
              img={selectedItem.img}
              desc={selectedItem.description}
              setShowModal={setShowModal}
              smallPrice={selectedItem.price}
              largePrice={selectedItem.secondaryPrice}
              firstTitle={selectedItem.firstTitle}
              secondTitle={selectedItem.secondTitle}
              btnColor={searchModalBtnColor}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchItems;
