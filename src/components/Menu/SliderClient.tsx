"use client";
import { imageUrl } from "@/demo/seed";

import Logo from "@/components/MenuLogo";
import Slides from "../Slides";
import SelectedItems from "./SelectedItems";
import SearchItems from "./SearchItems";
import { PresetTheme, presetThemes } from "@/lib/presetThemes";
import MenuInfoPopover from "./MenuInfo";
import CustomerAccount from "./Customer/CustomerAccount";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { readDemoState, DEMO_CHANGE_EVENT } from "@/demo/browser";

interface SliderClientProps {
  data: MenuProps[];
  menuName: string;
  menuLogo: string | undefined;
  username?: string;
  userData: IDashboardUser;
}

export default function SliderClient({
  data: initialData,
  menuName: initialMenuName,
  menuLogo: initialMenuLogo,
  username,
  userData: initialUserData,
}: SliderClientProps) {
  const [data, setData] = useState(initialData);
  const [userData, setUserData] = useState(initialUserData);
  const menuName = userData.menuName || initialMenuName;
  const menuLogo = `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/userLogos/1752401431081cafe_elm_logo.png?versionId=`
  useEffect(() => {
    const refresh = () => { const state = readDemoState(username); setData(state.menu as MenuProps[]); setUserData({ ...state.user, id: state.user._id } as IDashboardUser); };
    useSelectionStore.getState().clearSelection();
    refresh(); window.addEventListener(DEMO_CHANGE_EVENT, refresh); window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(DEMO_CHANGE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, [username]);
  const userTheme = presetThemes.find((theme) => theme.id === userData.theme);

  const WelcomePage = userTheme?.welcomePage;

  const customerAccountIcon = userTheme?.customerAccountIcon?.color;
  const [showWelcomePage, setShowWelcomePage] = useState(
    WelcomePage ? true : false,
  );

  const flattenItems = (data: MenuProps[]) => {
    const result = [] as any;
    data.forEach((obj) => {
      if (obj.items && Array.isArray(obj.items)) {
        obj.items.forEach((item) => {
          result.push({
            ...item,
            firstTitle: obj.firstTitle || null,
            secondTitle: obj.secondTitle || null,
          });
        });
      }
    });
    return result;
  };

  const allItems = flattenItems(data);

  return (
    <div className="bg-yellow-950 text-white relative  h-[100dvh] w-full font-yekan">
      {showWelcomePage && typeof WelcomePage === "function" && <WelcomePage />}
      {!showWelcomePage ? (
        <div className="flex justify-between  px-8 items-center absolute pt-1 z-[50] w-full ">
          <div className="flex gap-2 items-center bg-black/5  px-2 rounded-2xl border border-white/20 backdrop-blur-sm ">
            <SelectedItems
              username={username || ""}
              tax={userTheme?.tax}
              userTheme={userData?.theme}
              pointRate={userData?.loyalty?.pointRate}
              menuName={menuName}
              userAllItems={allItems}
              isLoyaltyActive={userData.loyalty.isActive}
            />
            {userTheme?.socialInfo && (
              <MenuInfoPopover userTheme={userData?.theme} />
            )}
            <CustomerAccount
              iconColor={customerAccountIcon}
              userData={userData}
              menuItems={allItems}
            />
            <SearchItems
              searchIconProps={userTheme?.searchIconProps}
              items={allItems}
              searchModalBtnColor={userTheme?.modalBtnColor}
              themeFont={userTheme?.themeFont}
            />
          </div>
          {menuName && (
            <div className="">
              <Logo
                userTheme={userData?.theme}
                logo={
                  menuLogo
                    ? imageUrl(menuLogo, "userLogos")
                    : "heart.png"
                }
                title={menuName}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="absolute  w-full flex justify-center">
          <div
            className="bg-gradient-to-b from-[#BE1E2D]/10 to-transparent  backdrop-blur-xl px-8 w-full  pt-4 flex justify-between   items-center absolute z-50"
            id="ehsan"
          >
            <div className=" flex gap-4 items-center w-1/3">
              <SelectedItems
                username={username || ""}
                tax={userTheme?.tax}
                userTheme={userData?.theme}
                pointRate={userData?.loyalty?.pointRate}
                menuName={menuName}
                userAllItems={allItems}
                isLoyaltyActive={userData.loyalty.isActive}
              />
              {userTheme?.socialInfo && (
                <MenuInfoPopover userTheme={userData?.theme} />
              )}
            </div>
            {menuName && (
              <div className="flex justify-center w-1/3">
                <Logo
                  userTheme={userData?.theme}
                  logo={
                    menuLogo
                      ? imageUrl(menuLogo, "userLogos")
                      : "heart.png"
                  }
                  title={menuName}
                />
              </div>
            )}
            <div className="flex items-center gap-2 justify-end w-1/3">
              <CustomerAccount
                iconColor={customerAccountIcon}
                userData={userData}
                menuItems={allItems}
              />
              <SearchItems
                searchIconProps={userTheme?.searchIconProps}
                items={allItems}
                searchModalBtnColor={userTheme?.modalBtnColor}
                themeFont={userTheme?.themeFont}
              />
            </div>
          </div>
        </div>
      )}
      {userTheme?.pattern && (
        <Image
          src={userTheme?.pattern}
          width={200}
          priority
          height={200}
          className="absolute z-10 pointer-events-none w-auto bottom-0 opacity-60 left-0 md:opacity-30 animate-float"
          alt=""
        />
      )}
      <Slides menus={data} theme={userTheme || presetThemes[0]} />
    </div>
  );
}
