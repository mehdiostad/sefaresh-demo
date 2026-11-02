import React from "react";
import ColdDrinkItems from "@/components/MenueItems/ColdDrinkItems";
import Logo from "@/components/Logo";
import iceCoffeIcon from "../../../public/coffee-beans.png";
import coldDrinkIcon from "../../../public/drink.png"
const ColdMenue = ({ isReRender }) => {
  return (
    <div className="!border-0 !shadow-none flex flex-col items-center bg-[url('/CafeMarya4.jpg')]  text-white h-[100vh] bg-[#8c7652] bg-cover bg-center ">
      {/* cafe logo */}
      <div className="lg:items-end lg:flex lg:flex-col mr-24 mt-8">
        <div className="">
        <Logo logo={coldDrinkIcon} />

        </div>
        <div className="-mt-8">
          <ColdDrinkItems isReRender={isReRender} />
        </div>
      </div>
    </div>
  );
};

export default ColdMenue;
