"use client";
import { cn } from "@/lib/utils";
import { IconBrandInstagram, IconRocket } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CafeElmBG, CafeElmLogo, CafeElmText } from "@/Icons";

const CafeElmWelcome = () => {
  const [showPage, setShowPage] = useState(true);

  return (
    <AnimatePresence>
      {showPage && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black flex h-screen-dynamic flex-col overflow-hidden touch-none"
        >
          <div className="absolute inset-0 opacity-50 w-full">
            <CafeElmBG color={"white"} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between py-4 h-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#BE1E2D]/20 blur-[100px] rounded-full animate-pulse" />
            <div className="relative w-full flex flex-col items-center h-full justify-center ">
              {/* //main */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs tracking-[0.8em] font-light text-white/40 mb-2">
                  EXPLORE THE
                </span>
                <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  MENU
                </h1>
              </div>

              <div className="relative  z-20 flex flex-col items-center animate-float max-h-60 xs:max-h-80">
                <CafeElmLogo color={"white"} />
              </div>

              <div className=" xs:-mt-20 flex flex-col gap-2 items-center max-h-40 xs:max-h-80">
                <CafeElmText color={"white"} />
              </div>
              <div className="flex flex-col items-center gap-10 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPage(false)}
                  className="group relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-2xl transition-all hover:border-[#BE1E2D]/50 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BE1E2D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                  <IconRocket className="text-[#BE1E2D] group-hover:animate-bounce" />
                  <span className="text-white font-bold text-lg tracking-wide">
                    آغاز ماجراجویی
                  </span>

                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BE1E2D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BE1E2D]"></span>
                  </span>
                </motion.button>

                <Link
                  href="https://instagram.com/cafeelm1"
                  target="_blank"
                  className="group flex items-center gap-3 opacity-50 hover:opacity-100 transition-all"
                >
                  <div className="p-2 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                    <IconBrandInstagram size={20} />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] font-bold">
                    JOIN THE GALAXY
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CafeElmWelcome;
