"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconFlask, IconCheck, IconX, IconConfetti } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const ScienceLabGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "wrong">("idle");

  const challenge = {
    question: "نماد شیمیایی عنصر 'طلا' در جدول تناوبی چیست؟",
    correctAnswer: "Au",
    rewardCode: "SCIENCE-GOLD",
    hint: "نام لاتین آن Aurum است.",
  };

  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === challenge.correctAnswer.toLowerCase()) {
      setStatus("success");
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <>
      {}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-2 z-[50] bg-[#BE1E2D] p-2 rounded-full shadow-[0_0_20px_rgba(190,30,45,0.5)] border border-white/20 text-white"
      >
        <IconFlask size={28} className="animate-bounce" />
        <span
          className="absolute -top-2 -left-4 bg-white text-black text-[10px] px-2 py-1 rounded-full font-bold shadow-sm"
          dir="rtl"
        >
          جایزه!
        </span>
      </motion.button>

      {}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
              dir="rtl"
            >
              {}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#BE1E2D]/10 blur-[50px] rounded-full -mr-16 -mt-16" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-black text-white">
                    آزمایشگاه کدشکنی
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <IconX size={24} />
                  </button>
                </div>

                {status !== "success" ? (
                  <>
                    <p className="text-zinc-300 mb-6 leading-relaxed">
                      {challenge.question}
                    </p>

                    <div className="relative mb-6">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="پاسخ را اینجا بنویس..."
                        className={cn(
                          "w-full bg-black/50 border rounded-2xl px-4 py-4 text-white outline-none transition-all",
                          status === "wrong"
                            ? "border-red-500 animate-shake"
                            : "border-white/10 focus:border-[#BE1E2D]",
                        )}
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-[#BE1E2D] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#BE1E2D]/20 active:scale-95 transition-transform"
                    >
                      بررسی آزمایش
                    </button>

                    <p className="text-[10px] text-zinc-500 mt-4 text-center">
                      راهنمایی: {challenge.hint}
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <IconConfetti size={40} className="text-green-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      فرمول درست بود!
                    </h4>
                    <p className="text-zinc-400 text-sm mb-6">
                      کد تخفیف شما برای سفارش امروز:
                    </p>

                    <div className="bg-white/10 border-2 border-dashed border-green-500/50 px-6 py-3 rounded-xl">
                      <span className="text-2xl font-mono tracking-widest text-green-400 select-all">
                        {challenge.rewardCode}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-8 text-white/40 text-sm underline"
                    >
                      بازگشت به منو
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScienceLabGame;
