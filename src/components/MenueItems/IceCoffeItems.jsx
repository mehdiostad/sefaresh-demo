import React, { useEffect } from "react";
import Card from "@/components/Card";
import Item from "@/components/Item";
import menue from "@/DB/db";
import { motion, AnimatePresence } from "framer-motion";
const IceCoffeItems = () => {
  return (
    <div>
      <div className=" flex justify-center mt-16">
        <Card cardName={"قهوه ها"} smallSize={"تک"} largeSize={"دبل"} />
      </div>

      <div className="flex flex-col justify-center">
        {menue[0].map((item, idx) => (
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
                  itemName={item.caffeeName}
                  smallPrice={item.smallPrice}
                  largePrice={item.largePrice}
                />
              </motion.li>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IceCoffeItems;
