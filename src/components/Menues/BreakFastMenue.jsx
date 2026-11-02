import React from "react";
import BreakfastItems from "../MenueItems/BreakfastItems";
import Logo from "@/components/Logo";
import iceCoffeIcon from "../../../public/coffee-beans.png";
import breakfastIcon from "../../../public/breakfast.png"
const BreakFastMenue = ({ isReRender }) => {
  return (
    <div className="!border-0 !shadow-none flex flex-col items-center bg-[url('/CafeMarya5.jpg')]  text-white h-[100vh] bg-[#8c7652] bg-cover bg-center ">
      {/* cafe logo */}
      <div className="lg:items-end lg:flex lg:flex-col mr-24 mt-8">
        <div className="">
        <Logo logo={breakfastIcon} />

        </div>
        <div className="-mt-8">
          <BreakfastItems isReRender={isReRender} />
        </div>
      </div>
    </div>
  );
};

export default BreakFastMenue;
