import CafeElmWelcome from "@/components/Welcome/CafeElmWelcome";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBubbleTea,
  IconCakeRoll,
  IconClock,
  IconCoffee,
  IconCoffeeOff,
  IconMug,
} from "@tabler/icons-react";
import { GlassWater } from "lucide-react";
import {
  Breakfast,
  BrowedCoffee,
  Cake,
  Coffee,
  ColdBeverage,
  ColdCoffee,
  HerbalTea,
  HotDrink,
  MilkShake,
  Sandewich,
} from "../Icons";
import React from "react";
export interface SocialItem {
  href: string;
  icon: React.ElementType;
  iconColor?: string;
}

export interface SocialMediaInfo {
  type: "socialMedia";
  items: SocialItem[];
  separator?: boolean;
}

export interface AddressInfo {
  type: "address";
  desc: string;
  icon?: React.ElementType;
  separator?: boolean;
  iconColor?: string;
}

export interface GeneralInfo {
  type: "info";
  desc: string | React.ReactNode;
  icon?: React.ElementType;
  separator?: boolean;
  iconColor?: string;
}

export type SocialInfoProps = SocialMediaInfo | AddressInfo | GeneralInfo;
export interface PresetTheme {
  name: string;
  id: string;
  isPublic: boolean;
  secondTitle?: string;
  themeFont?: string;
  options: PreviewMenuProps[];
  cardProps?: string;
  itemCn?: string;
  logoTitleProps?: string;
  logoImageProps?: { size?: string; cn?: string };
  tax?: number;
  welcomePage?: any;
  logoBgCn?: string;
  customerAccountIcon?: {
    color?: string;
  };
  selectionIconProps?: {
    color?: string;
    cn?: string;
  };
  socialInfo?: SocialInfoProps[];
  searchIconProps?: {
    color?: string;
    cn?: string;
  };
  swiperNavColor?: string;
  paginationPreset?: {
    cn?: string;
    iconColor?: string;
    activeBtn?: string;
    boxColor?: string;
  };
  modalBtnColor?: string;
  pattern?: string;
}
export const presetThemes: PresetTheme[] = [
  {
    name: "کافه علم",
    id: "cafe_elm",
    isPublic: false,
    secondTitle: "/themes/cafe_elm/cafe_elm.png",
    themeFont: "Gramophone",
    cardProps: "border-none text-white bg-black py-0 whitespace-nowrap",
    itemCn: "bg-transparent",
    swiperNavColor: "#BE1E2D",
    logoTitleProps: "hidden",
    tax: 0.1,
    welcomePage: CafeElmWelcome,
    customerAccountIcon: {
      color: "black",
    },
    socialInfo: [
      {
        type: "socialMedia",
        items: [
          {
            href: "https://instagram.com/cafeelm1",
            icon: IconBrandInstagram,
          },
          {
            href: "https://telegram.me/Cafeelm1",
            icon: IconBrandTelegram,
          },
        ],
      },
      {
        type: "address",
        desc: "باغ کتاب تهران، طبقه اول، بعد از باغ علم نوجوان، کافه علم",
      },
      {
        type: "info",
        desc: "ساعت کاری کافه از 9 صبح تا 10 شب",
        icon: IconClock,
        separator: false,
      },
      {
        type: "info",
        desc:
          // desc: React.createElement(
          //   React.Fragment,
          //   null,
          //   React.createElement(
          //     "span",
          //     {
          //       className:
          //         "text-[#BE1E2D] bg-white rounded-full px-1 animate-pulse",
          //     },

          //   ),
          "نسخهٔ دموی بازسازی‌شده؛ سرویس اصلی دیگر فعال نیست و سفارش‌ها واقعی نیستند.",
        // ),
      },
    ],
    selectionIconProps: {
      color: "black",
    },
    searchIconProps: {
      color: "black",
    },
    logoBgCn: "hidden",
    logoImageProps: {
      size: "w-14 h-14",
      cn: "top-0 -mt-3",
    },
    paginationPreset: {
      // cn: "bottom-0  ",
      activeBtn: "bg-[#BE1E2D]",
      iconColor: "#BE1E2D",
      boxColor: "bg-black",
    },
    modalBtnColor: "[#BE1E2D]",
    pattern: "/themes/cafe_elm/bg-pattern.webp",
    options: [
      {
        textColor: "text-black",
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: Coffee,
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },

        subTitle: "Coffee",
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        textColor: "text-black",
        menuIcon: HotDrink,

        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },

        subTitle: "Hot Drink",
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: ColdCoffee,

        textColor: "text-black",
        subTitle: "Cold Coffee",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: ColdBeverage,
        textColor: "text-black",
        subTitle: "Cold Beverage",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: MilkShake,
        textColor: "text-black",
        subTitle: "Milk Shake",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: BrowedCoffee,
        textColor: "text-black",
        subTitle: "Brewed Coffee",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: HerbalTea,
        textColor: "text-black",
        subTitle: "Herbal Tea",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: Cake,
        textColor: "text-black",
        subTitle: "Cakes",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: Breakfast,
        textColor: "text-black",
        subTitle: "Breakfasts",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        menuIcon: Sandewich,
        textColor: "text-black",
        subTitle: "Sandwiches",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        textColor: "text-black",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        textColor: "text-black",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        textColor: "text-black",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
      {
        // bottomLeftImage: "/themes/cafe_elm/bg-pattern.webp",
        // bottomLeftImageProps: {
        //   cn: "w-auto bottom-0 opacity-60 left-0 md:opacity-30",
        // },
        textColor: "text-black",
        hexColor: {
          fromColor: "#fff",
          toColor: "#fff",
        },
      },
    ],
  },
  {
    name: "قهوه و گیتار",
    id: "sunset",
    isPublic: true,
    options: [
      {
        color: "yellow-900",

        hexColor: {
          fromColor: "#582F0E",
          toColor: "#7F4F24",
        },
      },
      {
        color: "amber-900",
        hexColor: {
          fromColor: "#7F4F24",
          toColor: "#936639",
        },
      },
      {
        hexColor: {
          fromColor: "#936639",
          toColor: "#A68A64",
        },
      },
      {
        hexColor: {
          fromColor: "#A68A64",
          toColor: "#B6AD90",
        },
      },
      {
        hexColor: {
          fromColor: "#B6AD90",
          toColor: "#C2C5AA",
        },
      },
      {
        hexColor: {
          fromColor: "#C2C5AA",
          toColor: "#A4AC86",
        },
      },
      {
        hexColor: {
          fromColor: "#A4AC86",
          toColor: "#656D4A",
        },
      },
      {
        hexColor: {
          fromColor: "#656D4A",
          toColor: "#414833",
        },
      },
      {
        hexColor: {
          fromColor: "#414833",
          toColor: "#333D29",
        },
      },
      {
        hexColor: {
          fromColor: "#333D29",
          toColor: "#132a13",
        },
      },
      {
        hexColor: {
          fromColor: "#132a13",
          toColor: "#31572c",
        },
      },
      {
        hexColor: {
          fromColor: "#31572c",
          toColor: "#4f772d",
        },
      },
      {
        hexColor: {
          fromColor: "#4f772d",
          toColor: "#90a955",
        },
      },
      {
        hexColor: {
          fromColor: "#90a955",
          toColor: "#ecf39e",
        },
      },
    ],
  },
  {
    name: "ساده - متال",
    isPublic: true,
    id: "ocean",
    options: [
      { color: "slate-500" },
      { color: "slate-600" },
      { color: "slate-600" },
      { color: "slate-700" },
      { color: "slate-700" },
      { color: "slate-800" },
      { color: "slate-800" },
      { color: "slate-800" },
      { color: "slate-800" },
      { color: "slate-800" },
      { color: "slate-800" },
      { color: "slate-800" },
    ],
  },
  {
    name: "جنگل",
    id: "forest",
    isPublic: true,
    options: [
      { color: "green-700" },
      { color: "green-400" },
      { color: "emerald-400" },
      { color: "lime-400" },
      { color: "yellow-400" },
      { color: "amber-400" },
    ],
  },

  {
    name: "کافه کالما",
    id: "cafe_calma",
    isPublic: false,
    cardProps: "border-black ",
    options: [
      {
        color: "yellow-900",
        menuIcon: IconCoffee,

        topDrawrerImage: "/themes/cafe_calma/elec_guitar.png",
        bottomRightImage: "/coffee-ui.png",
        bottomRightImageProps: {
          cn: "w-52 left-2 bottom-0 scale-x-[-1] md:hidden",
          float: true,
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#9d0208] md:hidden left-0 opacity-50 mask-fade-left shadow-lg h-64 w-64 -bottom-20",
        },
        hexColor: {
          toColor: "#6a040f",
          fromColor: "#9d0208",
        },
      },
      {
        color: "amber-900",
        menuIcon: IconMug,
        hexColor: {
          toColor: "#9d0208",
          fromColor: "#370617",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
        bottomRightImage: "/themes/cafe_calma/iced_americano.png",
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#9d0208] md:hidden left-40 opacity-50 mask-fade-right shadow-lg h-64 w-64 -bottom-20",
        },
        bottomRightImageProps: {
          cn: "w-64 -right-16 scale-x-[-1] bottom-0",
          float: true,
        },
        drawerText: "کافه کالما،جایی برای آرامش",
      },
      {
        color: "green-900",
        menuIcon: IconBubbleTea,
        hexColor: {
          toColor: "#370617",
          fromColor: "#dc2f02",
        },
        bottomRightImage: "/themes/cafe_calma/mojito.png",
        bottomRightImageProps: {
          cn: "w-80 -right-20 -bottom-12",
          float: true,
        },
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#370617] md:hidden left-40 opacity-50 mask-fade-right shadow-lg h-64 w-64 -bottom-20",
        },

        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        color: "orange-900",
        menuIcon: IconCoffeeOff,
        hexColor: {
          toColor: "#dc2f02",
          fromColor: "#e85d04",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
        // topDrawrerImage: "/themes/cafe_calma/elec_guitar.png",
        topDrawrerImageProps: {
          cn: "-right-60 pointer-events-none opacity-70",
        },
        bottomRightImage: "/themes/cafe_calma/hot_choco.png",
        bottomRightImageProps: {
          cn: "w-80 -right-16 bottom-0",
          float: true,
        },
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#dc2f02] md:hidden left-40 opacity-50 mask-fade-right shadow-lg h-64 w-64 -bottom-20",
        },
      },
      {
        color: "pink-900",
        menuIcon: IconCakeRoll,
        hexColor: {
          toColor: "#e85d04",
          fromColor: "#f48c06",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2 ",
        },
        bottomRightImage: "/themes/cafe_calma/cake.png",
        bottomRightImageProps: {
          cn: "w-60 -right-4 bottom-0 lg:hidden",
          float: true,
        },
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#e85d04] md:hidden left-40 opacity-50 mask-fade-right shadow-lg h-64 w-64 -bottom-20",
        },
      },
      {
        color: "rose-900",
        menuIcon: GlassWater,
        hexColor: {
          toColor: "#f48c06",
          fromColor: "#faa307",
        },
        // topDrawrerImage: "/themes/cafe_calma/elec_guitar.png",
        topDrawrerImageProps: {
          cn: "-left-60 pointer-events-none opacity-70",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
        bottomRightImage: "/themes/cafe_calma/damnoosh.png",
        bottomRightImageProps: {
          cn: "w-60 -right-4 bottom-0",
          float: true,
        },
        downerImage: true,
        downerImageProps: {
          className:
            " rounded-full -z-50 bg-[#f48c06] md:hidden left-40 opacity-50 mask-fade-right shadow-lg h-64 w-64 -bottom-20",
        },
      },
      {
        color: "emerald-900",
        hexColor: {
          toColor: "#faa307",
          fromColor: "#ffba08",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        color: "slate-900",
        hexColor: {
          toColor: "#ffba08",
          fromColor: "#370617",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        hexColor: {
          fromColor: "#370617",
          toColor: "#03071e",
        },
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
      {
        bottomLeftImage: "/themes/cafe_calma/calma_logo.png",
        bottomLeftImageProps: {
          cn: "top-1/2   w-[22rem] opacity-25 left-1/2 -translate-x-1/2 -translate-y-1/2",
        },
      },
    ],
  },
  {
    name: "کافه ماریا",
    id: "cafe_marya",
    isPublic: false,
    options: [
      {
        backgroundImage: "/CafeMarya3.jpg",
        hexColor: { fromColor: "#8c7652", toColor: "#8c7652" },
        menuIcon: HerbalTea,
      },
      {
        backgroundImage: "/CafeMarya1.jpg",
        hexColor: { fromColor: "#8c7652", toColor: "#8c7652" },
        menuIcon: Coffee,
      },
      {
        backgroundImage: "/CafeMarya4.jpg",
        hexColor: { fromColor: "#8c7652", toColor: "#8c7652" },
        menuIcon: ColdBeverage,
      },
      {
        backgroundImage: "/CafeMarya2.jpg",
        hexColor: { fromColor: "#8c7652", toColor: "#8c7652" },
        menuIcon: HotDrink,
      },
      {
        backgroundImage: "/CafeMarya5.jpg",
        hexColor: { fromColor: "#8c7652", toColor: "#8c7652" },
        menuIcon: Breakfast,
      },
    ],
  },
];
