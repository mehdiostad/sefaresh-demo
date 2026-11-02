"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import Item from "@/components/Item";
import menue from "@/DB/db";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
const NoneRangeCoffees = ({ isReRender }) => {
  const [hotDrinks, setHotDrinks] = useState(null);
  useEffect(() => {
    const fetchHotDrinks = async () => {
      const { data } = await axios.get(
        "https://cafemarya.liara.run/api/getAll"
      );
      setHotDrinks(data[1]);
    };
    fetchHotDrinks();
  }, []);
  return (
    <div>
      <div className=" flex justify-center ml-4 mt-16">
        <Card cardName={"نوشیدنی های گرم"} smallSize={"تک"} />
      </div>
      {isReRender && (
        <div className="flex flex-col justify-center">
          {hotDrinks &&
            hotDrinks.map((item, idx) => (
              <div className=" flex  justify-center items-center " key={idx}>
                <AnimatePresence>
                  <motion.li
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1 + idx / 10,
                    }}
                  >
                    <Item
                      itemName={item.itemName}
                      smallPrice={item.price}
                      img={item.img}
                      desc={item.desc ? item.desc : ""}
                    />
                  </motion.li>
                </AnimatePresence>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NoneRangeCoffees;
