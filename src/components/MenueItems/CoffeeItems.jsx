"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import Item from "@/components/Item";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
const CoffeeItems = () => {
  const [coffees, setCoffees] = useState(null);
  useEffect(() => {
    const fetchCoffees = async () => {
      const { data } = await axios.get(
        "https://cafemarya.liara.run/api/getAll"
      );
      setCoffees(data[0]);
    };
    fetchCoffees();
  }, []);
  return (
    <div>
      <div className=" flex flex-col items-center justify-center mt-16">
        <Card cardName={"قهوه ها"} smallSize={"تک"} largeSize={"دبل"} />
        <div className="mt-2">همه ی نوشیدنی ها به صورت آیس قابل سفارش است</div>
      </div>

      <div className="flex flex-col justify-center">
        {coffees &&
          coffees.map((item, idx) => (
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
                    smallPrice={item.smallPrice}
                    largePrice={item.largePrice}
                    img={item.img}
                    desc={item.desc ? item.desc : ""}
                  />
                </motion.li>
              </AnimatePresence>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CoffeeItems;
