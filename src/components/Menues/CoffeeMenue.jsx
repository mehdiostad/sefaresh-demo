"use client";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Logo from "@/components/Logo";
import CamkasCoffeeBar from "../CamkasCoffeeBar";

import CoffeeItems from "@/components/MenueItems/CoffeeItems";
import logo from "../../../public/heart.png";
const CoffeeMenue = () => {
  return (
    <div className=" !border-0 !shadow-none flex md: flex-col bg-zinc-800 text-white h-[100vh] bg-[url('/CafeMarya1.jpg')] bg-cover bg-center">
      {/* cafe logo */}
      <div className="lg:items-end lg:flex lg:flex-col mr-24 mt-8 items-center">
        <div className="">
          <Logo logo={logo} />
        </div>

        <div className="-mt-8 ">
          <CoffeeItems />
        </div>
        <div className=" -mt-6">
          <CamkasCoffeeBar />
        </div>
      </div>
    </div>
  );
};

export default CoffeeMenue;
