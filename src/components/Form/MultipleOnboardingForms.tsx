"use client";
import { useEffect, useState } from "react";
import NewMenuForm from "./NewMenuForm";
import NewItemForm from "./NewItemForm";
import { IMenuCategory } from "@/Models/MenuCategoryModel";
import CategoryForm from "./NewCategoryForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Confetti from "react-confetti";

export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};
const MultipleOnboardingForms = ({ id }: { id: string }) => {
  const [step, setStep] = useState(1);
  const [newCategoryData, setNewCategoryData] = useState<IMenuCategory>();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (celebrate) {
      const timeout = setTimeout(() => setCelebrate(false), 5000); // 5s confetti
      return () => clearTimeout(timeout);
    }
  }, [celebrate]);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const router = useRouter();
  const { toast } = useToast();

  return (
   
 <div className="z-40">
      {step === 1 && (
        <motion.div
          className="z-50 h-full "
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center p-6  shadow-lg md:w-[40rem] rounded-lg md:h-[40rem] gap-4"
          >
            <motion.h1
              className="text-2xl font-bold text-white"
              variants={STAGGER_CHILD_VARIANTS}
            >
              به منو ساز آنلاین ما خوش آمدید
            </motion.h1>
            <motion.p
              className="max-w-md text-gray-200 transition-colors sm:text-lg text-right"
              variants={STAGGER_CHILD_VARIANTS}
            >
              با استفاده از این ابزار، می‌توانید منوهای خود را به راحتی ایجاد و
              مدیریت کنید. لطفاً مراحل زیر را دنبال کنید تا منوی خود را
              راه‌اندازی کنید.
            </motion.p>
            <motion.div
              variants={STAGGER_CHILD_VARIANTS}
              className="flex items-center justify-center mt-4"
            >
              <Button variant={"outline"} onClick={handleNext}>
                شروع کنید
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {step === 2 && (
        <motion.div
          className="z-50 h-full "
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center p-6  shadow-lg md:w-[40rem] rounded-lg md:h-[40rem] gap-4"
          >
            <motion.h1
              className="text-2xl font-bold text-white"
              variants={STAGGER_CHILD_VARIANTS}
            >
              لطفا اطلاعات اولیه منوی خودتونو وارد کنید
            </motion.h1>
            <motion.p
              className="max-w-md text-gray-200 transition-colors sm:text-lg text-right"
              variants={STAGGER_CHILD_VARIANTS}
            >
              <NewMenuForm userId={id} onSuccess={handleNext} />
            </motion.p>
          </motion.div>
          {/* <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex items-center justify-center mt-4"
          >
            توضیحات
          </motion.div> */}
        </motion.div>
      )}
      {step === 3 && (
        <motion.div
          className="z-50 h-full "
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center p-6  shadow-lg md:w-[40rem] rounded-lg md:h-[40rem] gap-4"
          >
            <motion.h1
              className="text-2xl font-bold text-white"
              variants={STAGGER_CHILD_VARIANTS}
            >
              اولین دسته بندی خودتونو بسازید
            </motion.h1>
            <motion.p
              className="max-w-md text-gray-200 transition-colors sm:text-lg text-right"
              variants={STAGGER_CHILD_VARIANTS}
            >
              <CategoryForm
                onSubmit={async (data) => {
                  const { title } = data;

                  const res = await fetch(`/api/categories/`, {
                    method: "POST",
                    body: JSON.stringify({ userId: id, title }),
                  });
                  const newCategory = await res.json();
                  setNewCategoryData(newCategory);
                  handleNext();
                }}
                userId={id}
                onBack={handleBack}
              />
            </motion.p>
          </motion.div>
          {/* <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex items-center justify-center mt-4"
          >
            توضیحات
          </motion.div> */}
        </motion.div>
      )}
      {step === 4 && (
        <motion.div
          className="z-50 h-full "
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center p-6  shadow-lg md:w-[40rem] rounded-lg md:h-[40rem] gap-4"
          >
            <motion.h1
              className="text-2xl font-bold text-white"
              variants={STAGGER_CHILD_VARIANTS}
            >
              خیلی عالی! حالا یک آیتم برای دسته بندی ساخته شده خود اضافه کنید.
            </motion.h1>
            <motion.p
              className="max-w-md text-gray-200 transition-colors sm:text-lg text-right"
              variants={STAGGER_CHILD_VARIANTS}
            >
              <NewItemForm
                onSubmit={async (data) => {
                  const { itemName, price, img, description } = data;

                  try {
                    const res = await fetch(`/api/items/`, {
                      method: "POST",
                      body: JSON.stringify({
                        userId: id,
                        categoryId: newCategoryData?._id,
                        itemName,
                        price,
                        description,
                      }),
                    });

                    if (res && img) {
                      const { _id } = await res.json();
                      const formData = new FormData();
                      formData.append("file", img);
                      formData.append("folder", "items");
                      formData.append("id", _id);
                      formData.append("selectedImg", "img");

                      await fetch("/api/uploadImage", {
                        method: "POST",
                        body: formData,
                      });
                    }
                    const isOnbordingFinished = await fetch(`/api/user/${id}`, {
                      method: "PUT",
                      body: JSON.stringify({ isOnboarded: true }),
                    });
                    if (isOnbordingFinished.ok) {
                      setCelebrate(true);
                      handleNext();
                    }
                  } catch (error: unknown) {
                    console.log(error);
                    toast({
                      title: "مشکلی پیش آمد، دوباره تلاش کنید.",
                      variant: "destructive",
                    });
                  }
                }}
                onBack={handleBack}
                secondPrice={newCategoryData?.secondTitle}
              />
            </motion.p>
          </motion.div>
          {/* <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex items-center justify-center mt-4"
          >
            توضیحات
          </motion.div> */}
        </motion.div>
      )}

      {step === 5 && (
        <div className="flex flex-col items-center justify-center p-6 shadow-lg md:w-[40rem] rounded-lg md:h-[40rem] gap-4">
          {celebrate && (
            <Confetti
              numberOfPieces={600}
              gravity={0.6}
              wind={0.02}
              initialVelocityX={20}
              initialVelocityY={30}
            />
          )}
          <div className="text-3xl font-bold mb-4 text-white flex gap-2">
            تبریک! منوی شما
            <p className="text-green-500">با موفقیت ساخته شد</p>
            🎉
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition"
          >
            بزن بریم داشبورد مدیریت منو
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleOnboardingForms;
