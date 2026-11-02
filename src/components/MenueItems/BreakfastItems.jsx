"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import Item from "@/components/Item";
import menue from "@/DB/db";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
const BreakfastItems = ({ isReRender }) => {
  const [breakFasts, setBreakFasts] = useState(null);
  useEffect(() => {
    const fetchBreakFast = async () => {
      const { data } = await axios.get(
        "https://cafemarya.liara.run/api/getAll"
      );
      setBreakFasts(data[4]);
    };
    fetchBreakFast();
  }, []);
  return (
    <div>
      <div className=" flex justify-center mt-16">
        <Card cardName={"صبحانه و خوشمزه جات"} smallSize={"قیمت"} />
      </div>
      {isReRender && (
        <div className="flex flex-col justify-center">
          {breakFasts &&
            breakFasts.map((item, idx) => (
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

export default BreakfastItems;
