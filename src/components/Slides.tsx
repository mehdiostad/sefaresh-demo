"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/navigation";
//@ts-ignore
import "swiper/css/pagination";
//@ts-ignore
import "swiper/css/scrollbar";
import { Menu } from "@/components/Menu/Menu";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { PresetTheme, presetThemes } from "@/lib/presetThemes";

interface SlidesProps {
  menus: MenuProps[];
  isPreviewMode?: boolean;
  theme: PresetTheme;
}

import Image from "next/image";
import {
  IconCircleChevronUpFilled,
  IconCircleFilled,
} from "@tabler/icons-react";
import { Toaster } from "sonner";
import ScienceLabGame from "./MiniGame/ScienceLabGame";
import Link from "next/link";

const CustomPagination = ({
  slideCount,
  swiper,
  currentSlide,
  theme,
  slideTitle,
  itemsCount,
}: {
  slideCount: number;
  theme: any;
  currentSlide: number;
  swiper: any;
  slideTitle: string[];
  itemsCount: number;
}) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const activeEl = itemRefs.current[currentSlide];
    if (activeEl && !isBoxOpen) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentSlide, isBoxOpen]);
  return (
    <div
      className={cn(
        "font-yekan   backdrop-blur-sm py-2  bg-black/20 shadow-sm px-2  rounded-lg  transition-all duration-300 ease-in-out",
        // isBoxOpen ? "max-h-96 " : " max-h-20",
        theme?.paginationPreset?.boxColor || undefined,
      )}
    >
      {/* {itemsCount > 6 && (
        <div
          className="absolute bg-gradient-to-b from-transparent to-black/80 pointer-events-none  left-0  bottom-8 h-full w-full z-[-1]"
          id="test"
        />
      )} */}

      {/* Toggle Button */}
      {/* <div className="relative">
        <button
          type="button"
          className={cn(
            "flex items-center justify-center bg-white transition-transform duration-300 absolute -top-5 rounded-full p-0 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10",
            isBoxOpen && "rotate-180",
          )}
          onClick={() => setIsBoxOpen((prev) => !prev)}
        >
          <IconCircleChevronUpFilled
            size={32}
            color={theme?.paginationPreset?.iconColor || "grey"}
          />
        </button>
      </div> */}

      {/* Category List */}
      <div
        className={cn(
          "w-full gap-6 h-full flex  overflow-y-hidden",
          // isBoxOpen
          //   ? "grid grid-cols-2 min-w-full"
          //   : "overflow-x-auto scroll-smooth ",
        )}
        dir="rtl"
      >
        {Array.from({ length: slideCount }).map((_, i) => {
          const Icon = theme?.options[i]?.menuIcon || IconCircleFilled;
          const title = slideTitle[i];
          const isActive = i === currentSlide;
          const menuIcon = theme?.options[i]?.menuIcon;

          return (
            <button
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              key={i}
              onClick={() => swiper.current.slideTo(i)}
              className={cn(
                "rounded-full md:rounded-lg flex max-h-full whitespace-nowrap justify-center items-center  w-full transition-colors duration-300 ease-in-out ",
                isBoxOpen &&
                  "flex flex-col gap-4 rounded-lg p-2  whitespace-nowrap",
                // isActive &&
                //   `shadow-lg bg-gray-200/10 border   border-dashed  border-white text-white ${
                //     theme?.paginationPreset?.activeBtn || ""
                //   }`,
              )}
            >
              {/* {typeof menuIcon === "string" ? ( */}
              <div className="flex flex-col gap-2  max-h-full  items-center">
                <div
                  className={
                    cn(
                      "w-12 h-12 flex justify-center items-center ",
                      typeof theme?.paginationPreset?.iconColor === "string"
                        ? "opacity-100"
                        : isActive
                          ? "opacity-100"
                          : "opacity-60",
                    )
                    // "relative ",
                    // isBoxOpen ? "w-16 h-16" : "w-16 h-16  ",
                  }
                >
                  <Icon
                    color={
                      theme?.paginationPreset?.iconColor && isActive
                        ? theme?.paginationPreset?.iconColor
                        : "white"
                    }
                  />
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 800 2500 3000"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      transform="translate(940,2053)"
                      fill={isActive ? "red" : "white"}
                      d="M0,0 L25,0 L51,2 L81,7 L105,13 L131,22 L160,35 L178,45 L202,61 L216,72 L229,83 L245,98 L252,106 L262,117 L275,134 L276,136 L345,137 L355,141 L364,149 L369,158 L371,164 L371,239 L575,239 L575,197 L579,187 L588,177 L598,172 L602,171 L1308,171 L1332,175 L1351,181 L1367,188 L1382,196 L1396,206 L1411,219 L1418,226 L1427,237 L1436,250 L1445,266 L1453,285 L1458,302 L1461,318 L1462,328 L1462,355 L1459,377 L1453,398 L1447,413 L1437,432 L1425,449 L1413,462 L1403,472 L1387,484 L1372,493 L1355,501 L1337,507 L1319,511 L1299,513 L605,513 L592,509 L584,503 L578,494 L575,486 L575,444 L371,444 L371,621 L367,632 L360,641 L258,743 L248,749 L242,751 L24,751 L22,764 L-4,894 L-8,905 L-17,915 L-26,920 L-34,922 L-179,922 L-190,919 L-199,913 L-206,904 L-210,891 L-237,756 L-237,751 L-455,751 L-464,748 L-473,741 L-578,636 L-583,626 L-584,623 L-584,163 L-580,153 L-573,145 L-564,139 L-558,137 L-496,136 L-478,118 L-467,109 L-455,99 L-439,88 L-418,75 L-403,67 L-378,56 L-348,46 L-323,40 L-297,36 L-269,34 L-251,34 L-223,36 L-197,40 L-165,48 L-159,49 L-144,40 L-129,32 L-103,21 L-76,12 L-51,6 L-26,2 Z M9,69 L-19,71 L-42,75 L-61,80 L-84,88 L-111,101 L-132,114 L-141,120 L-147,122 L-163,122 L-194,112 L-216,107 L-239,104 L-281,104 L-304,107 L-330,113 L-356,122 L-385,136 L-385,137 L184,137 L178,130 L164,119 L143,105 L127,96 L104,86 L80,78 L52,72 L35,70 Z M-515,206 L-515,273 L-447,273 L-447,342 L-515,342 L-515,601 L-434,682 L220,682 L302,600 L302,342 L-380,342 L-380,273 L302,273 L302,206 Z M644,240 L644,443 L1305,443 L1322,439 L1339,432 L1354,422 L1367,410 L1377,397 L1385,382 L1390,367 L1392,358 L1393,349 L1393,334 L1390,316 L1383,297 L1374,282 L1363,270 L1355,262 L1340,252 L1324,245 L1308,241 L1301,240 Z M371,308 L371,375 L575,375 L575,308 Z M-167,751 L-147,852 L-146,853 L-67,853 L-61,825 L-47,755 L-47,751 Z "
                    />
                    <path
                      transform="translate(825,928)"
                      fill={isActive ? "red" : "white"}
                      d="M0,0 L16,0 L33,2 L50,6 L65,12 L82,21 L98,33 L114,49 L125,64 L134,81 L140,98 L144,115 L145,123 L145,478 L324,478 L333,482 L341,488 L347,497 L349,502 L350,508 L351,635 L446,730 L451,740 L452,744 L452,996 L448,1007 L442,1015 L433,1021 L424,1024 L-407,1024 L-418,1020 L-426,1014 L-433,1004 L-435,998 L-435,743 L-431,733 L-424,724 L-334,634 L-333,505 L-329,495 L-325,489 L-317,482 L-307,478 L-129,478 L-129,134 L-127,113 L-122,93 L-114,74 L-104,58 L-96,48 L-87,38 L-74,27 L-60,18 L-44,10 L-26,4 L-10,1 Z M7,69 L-8,71 L-21,76 L-33,83 L-45,95 L-52,106 L-57,118 L-59,127 L-59,478 L76,478 L76,129 L72,113 L64,98 L53,86 L40,77 L28,72 L20,70 Z M-264,547 L-264,614 L281,614 L281,547 Z M-284,683 L-366,765 L-366,784 L-298,784 L-298,854 L-366,854 L-366,955 L383,955 L383,854 L-231,854 L-231,784 L383,784 L383,765 L301,683 Z "
                    />
                  </svg> */}
                </div>
                <p
                  className={cn(
                    "text-center text-sm font-medium whitespace-nowrap",
                    typeof theme?.paginationPreset?.iconColor === "string"
                      ? "opacity-100"
                      : isActive
                        ? "opacity-100"
                        : "opacity-60",
                    theme?.paginationPreset?.iconColor &&
                      isActive &&
                      `text-[${theme.paginationPreset.iconColor}]`,
                  )}
                  style={{
                    // backgroundColor: theme?.options[0]?.color,
                    fontFamily: theme?.themeFont || "Yekan Bakh",
                  }}
                >
                  {title}
                </p>
              </div>
              {/* ) : (
                  <Icon
                    className={cn(
                      "w-full flex justify-center items-center h-8",
                    )}
                    color={isActive ? "white" : "#c4c4c4"}
                  />
                )} */}

              {isBoxOpen && (
                <p className="text-center text-sm font-medium">{title}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Slides = ({ menus, isPreviewMode = false, theme }: SlidesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  return (
    <div className={"relative"}>
      <Toaster
        toastOptions={{
          style: {
            color: "white",
            direction: "rtl",
            fontFamily: "Yekan Bakh",
            gap: "1rem",
          },
        }}
      />
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={50}
        slidesPerView={1}
        centeredSlides={true}
        grabCursor={true}
        dir="rtl"
        className={cn("w-full ", isPreviewMode ? "h-[500px]" : "h-[100dvh]")}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      >
        <div
          className="swiper-button-next"
          style={{ color: theme?.swiperNavColor || "white", display: "none" }}
        ></div>
        <div
          className="swiper-button-prev"
          style={{ color: theme?.swiperNavColor || "white", display: "none" }}
        ></div>
        {menus
          .sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0))
          .map((menu, i) => (
            <SwiperSlide
              key={menu._id}
              className="relative overflow-visible first:z-40 md:first:z-0 second:z-50 third:z-30 fourth:z-20 fifth:z-10"
            >
              <div
                className={cn(
                  `w-[115%] h-[100dvh]  bg-gradient-to-r  to-${
                    !isPreviewMode
                      ? theme?.options[i]?.color
                      : theme?.options[i + 1]?.color
                  } from-${
                    !isPreviewMode
                      ? theme?.options[i + 1]?.color
                      : theme?.options[i]?.color
                  } absolute brightness-95 -z-50`,
                  isPreviewMode ? "md:w-[125%] h-[600px]" : "",
                )}
                style={
                  theme?.options?.[i]?.backgroundImage
                    ? { backgroundImage: `url("${theme.options[i].backgroundImage}")`, backgroundSize: "cover", backgroundPosition: "center" }
                    : theme?.options?.[i]?.hexColor &&
                  theme?.options?.[i]?.hexColor?.fromColor &&
                  theme?.options?.[i]?.hexColor?.toColor
                    ? {
                        backgroundImage: `linear-gradient(to right, ${
                          theme?.options[i]?.hexColor?.fromColor || ""
                        }, ${theme?.options[i]?.hexColor?.toColor || ""})`,
                      }
                    : {}
                }
              />
              <Menu
                _id={menu._id}
                title={menu.title}
                cardProps={theme?.cardProps}
                subTitle={theme?.options[i]?.subTitle}
                menuIcon={theme?.options[i]?.menuIcon}
                themeFont={theme?.themeFont}
                pattern={theme?.pattern}
                desc={menu.desc}
                textColor={theme?.options[i]?.textColor}
                items={menu.items}
                itemCn={theme?.itemCn}
                firstTitle={menu.firstTitle}
                secondTitle={menu.secondTitle}
                logo={menu.logo}
                downerImage={theme?.options[i]?.downerImage}
                downerImageProps={theme?.options[i]?.downerImageProps}
                topDrawrerImage={theme?.options[i]?.topDrawrerImage}
                topDrawrerImageProps={theme?.options[i]?.topDrawrerImageProps}
                bottomLeftImage={theme?.options[i]?.bottomLeftImage}
                bottomLeftImageProps={theme?.options[i]?.bottomLeftImageProps}
                bottomRightImage={theme?.options[i]?.bottomRightImage}
                bottomRightImageProps={theme?.options[i]?.bottomRightImageProps}
                drawerText={theme?.options[i]?.drawerText}
                header={theme?.options[i]?.header}
                pageNumber={i + 1}
                modalBtnColor={theme?.modalBtnColor}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <div
        className={cn(
          "absolute  z-40 w-full p-8 top-8 ",
          theme?.paginationPreset?.cn,
        )}
      >
        <CustomPagination
          slideTitle={menus.map((menu) => menu.title)}
          slideCount={menus.length}
          itemsCount={menus[currentSlide].items.length}
          swiper={swiperRef}
          currentSlide={currentSlide}
          theme={theme}
        />
      </div>
      <ScienceLabGame />
      <div className="absolute bottom-0 w-44 h-6 left-1/2 -translate-x-1/2  bg-red-800 z-[50] rounded-t-lg ">
        <Link href={"/"} target="_blank">
          <p className="flex w-full items-center justify-center pt-1 text-xs">
            قدرت گرفته از سفارش‌آنلاین
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Slides;
