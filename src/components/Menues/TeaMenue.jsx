import React from "react";
import TeaItems from "../MenueItems/TeaItems";
import Logo from "@/components/Logo";
import iceCoffeIcon from "../../../public/coffee-beans.png";
import teaIcon from "../../../public/green-tea.png"
const TeaMenue = ({ isReRender }) => {
  return (
    <div className="!border-0 !shadow-none flex flex-col items-center bg-[url('/CafeMarya3.jpg')]  text-white h-[100vh] bg-[#8c7652] bg-cover bg-center ">
      {/* cafe logo */}
      <div className="lg:items-end lg:flex lg:flex-col mr-24 mt-8">
        <div className="">
        <Logo logo={teaIcon} />

        </div>
        <div className="-mt-8">
          <TeaItems isReRender={isReRender} />
        </div>
      </div>
    </div>
  );
};

export default TeaMenue;
