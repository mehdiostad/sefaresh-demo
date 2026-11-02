"use client";
import Logo from "@/components/MenuLogo";
import Item from "@/components/Menu/MenuItem";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./MenuCard";
import Image from "next/image";
import DownerImage from "../DownerImage/DownerImage";
import MenuCard from "./MenuCard";
import MenuItem from "@/components/Menu/MenuItem";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@tabler/icons-react";

export interface ItemProps {
  itemName: string; // item name
  img: string; // item image path
  description?: string; // item description
  price: number;
  secondaryPrice?: number;
  _id?: string;
  firstTitle: string;
  secondTitle?: string;
  available: boolean;
  themeFont: string;
  order?: number; // order of the item in the menu
}

const Menu = ({
  logo,
  items,
  title,
  subTitle,
  firstTitle,
  secondTitle,
  desc,
  downerImage,
  downerImageProps,
  topDrawrerImage,
  topDrawrerImageProps,
  bottomLeftImage,
  bottomLeftImageProps,
  bottomRightImage,
  bottomRightImageProps,
  drawerText,
  header,
  textColor,
  themeFont,
  cardProps,
  itemCn,
  menuIcon,
  modalBtnColor,
}: MenuProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showFooterFade, setShowFooterFade] = useState(true);

  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   const target = e.currentTarget;

  //   const isBottom =
  //     target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

  //   setShowFooterFade(!isBottom);
  // };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // observer.disconnect() // Just Once
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`h-full flex flex-col gap-2 relative  `}
      style={{ fontFamily: themeFont || "Yekan Bakh" }}
      key={title}
      dir="ltr"
    >
      {/* {drawerText && !topDrawrerImage && (
        <div
          className="absolute -right-56 opacity-50 top-1/2 rotate-90 text-2xl font-thin z-50 w-full flex justify-center items-center md:hidden"
          dir="rtl"
        >
          {drawerText}
        </div>
      )} */}
      {topDrawrerImage && (
        <div
          className={cn(
            "absolute w-full h-full",
            topDrawrerImageProps?.float ? "animate-float" : "",
          )}
        >
          <Image
            src={topDrawrerImage}
            width={500}
            height={500}
            alt="firstImage"
            className={cn(
              "absolute -left-64 md:hidden flex object-cover max-w-md z-30 brightness-95 mask-fade-left pointer-events-none",
              topDrawrerImageProps?.cn,
            )}
          />
        </div>
      )}

      {bottomLeftImage && (
        <div
          className={cn(
            "absolute w-full h-full",
            bottomLeftImageProps?.float ? "animate-float" : "",
          )}
        >
          <img
            src={bottomLeftImage}
            width={500}
            height={500}
            alt="secondImage"
            className={cn(
              `absolute -bottom-6  w-48 h-auto -left-2  object-cover -z-10 brightness-95 hidden xs:flex `,
              bottomLeftImageProps?.cn,
            )}
          />
        </div>
      )}
      {bottomRightImage && (
        <div
          className={cn(
            "absolute w-full h-full",
            bottomRightImageProps?.float ? "animate-float" : "",
          )}
        >
          <Image
            src={bottomRightImage}
            width={500}
            height={500}
            alt="thirdImage"
            className={cn(
              "absolute -bottom-16 -right-72 max-w-max h-auto hidden xs:flex object-cover brightness-95   -z-40",
              bottomRightImageProps?.cn,
            )}
          />
        </div>
      )}
      {downerImage && <DownerImage {...downerImageProps} />}
      <div className={`${header?.color} min-h-16 w-[120%]  -z-40`}>
        {/* {logo && <Logo logo={logo} title={menuName} />} */}
      </div>
      <div
        className="flex relative flex-col w-full max-h-[92dvh] pt-24 pb-8 px-8 gap-4 mx-auto"
        dir="ltr"
      >
        {/* menu items */}
        <div
          className="flex  flex-col gap-4  z-50 h-full overflow-y-auto   custom-scrollbar items-center scroll-padding scrollbar-visible"
          ref={sectionRef}
          // onScroll={handleScroll}
        >
          {items &&
            items
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item, idx) => (
                <div
                  key={idx}
                  className={` flex  justify-center items-center  transition-all duration-500 ease-out w-full
              ${
                // pageNumber === 1 && !isInteracted
                //   ? ""
                visible ? "opacity-100 " : "opacity-0 translate-y-6"
              } ${textColor || "text-white"}
            `}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <MenuItem
                    id={item._id || ""}
                    itemName={item.itemName}
                    smallPrice={item?.price}
                    largePrice={item?.secondaryPrice}
                    firstTitle={firstTitle}
                    secondTitle={secondTitle}
                    img={item.img}
                    available={item.available}
                    desc={item?.description || ""}
                    pageVisible={visible}
                    secondItemName={item?.secondItemName}
                    themeFont={themeFont}
                    itemCn={itemCn}
                    modalBtnColor={modalBtnColor}
                  />
                </div>
              ))}
        </div>
        <div className="absolute bottom-6 left-0 right-0 h-24 px-8 ">
          {/* <AnimatePresence>
            {isScrollable && showFooterFade && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="
        pointer-events-none z-[60] h-full
        bg-gradient-to-t from-black/40 via-black/10 to-transparent
        flex items-end justify-center"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 mb-8"
                >
                  <IconChevronDown size={24} className="text-white/70" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </div>
    </div>
  );
};

export { Menu };
