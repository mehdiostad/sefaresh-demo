import React from "react";
import Image from "next/image";
import Logo from "../Logo";
import CoffeeItems from "../MenueItems/CoffeeItems";
import iceCoffeIcon from "../../../public/coffee-beans.png";
import NoneRangeCoffees from "../MenueItems/NoneRangeCoffees";
import logo from "../../../public/heart.png";
import Instagram from "../../../public/instagram.png";
const IceCoffeeMenue = ({ isReRender }) => {
  return (
    <div className="!border-0 !shadow-none flex flex-col items-center bg-[url('/CafeMarya2.jpg')]  text-white h-[100vh] bg-[#8c7652] bg-cover bg-center ">
      {/* cafe logo */}
      <div className="lg:items-end lg:flex lg:flex-col mr-24 mt-8">
        <div className="">
        <Logo logo={iceCoffeIcon} />
        </div>
          
        <div className="-mt-8">
          <NoneRangeCoffees isReRender={isReRender} />
        </div>
       
        <div className="absolute bottom-4 animate-bounce right-40 ">
          <a href="https://instagram.com/cafemarya" target="_blank">
            <Image src={Instagram} width={30} ></Image>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IceCoffeeMenue;
