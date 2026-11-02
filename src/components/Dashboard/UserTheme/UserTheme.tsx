"use client";
import { useState } from "react";
import clsx from "clsx";
import Slides from "@/components/Slides";
import { useDashboardData } from "@/stores/useDashboardData";
import { useToast } from "@/hooks/use-toast";
import { presetThemes } from "@/lib/presetThemes";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const generateChainedGradients = (
  themeOptions: PreviewMenuProps[],
  pageNumber: number
) => {
  const index = pageNumber - 1;
  const from = themeOptions[index % themeOptions.length];
  const to = themeOptions[(index + 1) % themeOptions.length];
  const previewGradient = `from-${to.color} to-${from.color}`;
  const mainGradient = `from-${from.color} to-${to.color}`;
  return {
    pageNumber,
    previewColor: previewGradient,
    mainColor: mainGradient,
    header: { color: mainGradient },
    ...from,
  };
};

export default function UserTheme({ userId }: { userId: string }) {
  const user = useDashboardData((s) => s.user);
  const [selectedTheme, setSelectedTheme] = useState(
    presetThemes.find((a) => a.id === user?.theme) || presetThemes[0]
  );
  const fullMenu = useDashboardData((s) => s.fullMenu);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelect = (themeId: string) => {
    const theme = presetThemes.find((t) => t.id === themeId);
    if (theme) setSelectedTheme(theme);
  };

  const themedMenu: MenuProps[] = Array.from({ length: 10 }, (_, index) => {
    const pageNumber = index + 1;
    const themeData = generateChainedGradients(
      selectedTheme.options,
      pageNumber
    );

    return {
      pageNumber,
      firstTitle: `دسته ${pageNumber}`,
      title: "",
      color: themeData.previewColor,
      header: themeData.header,
      items: [],
    };
  });
  const privateUserTheme =
    presetThemes?.find((a) => a.id === user?.username) || null;
  const updateUserTheme = async (themeId: string) => {
    // Update user theme in the database

    try {
      const res = await fetch("/api/user/" + userId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeId }),
      });

      if (res.status === 403) {
        throw new Error("Subscription Expired", {
          cause: "Subscription Expired",
        });
      } else if (res.status === 200) {
        toast({
          title: "تم با موفقیت ذخیره شد",
          description: "تم انتخاب‌شده شما اکنون فعال است.",
        });
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error && error.cause === "Subscription Expired") {
        toast({
          title:
            "اشتراک شما به پایان رسیده است. لطفا اشتراک جدیدی تهیه بفرمایید.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا در به روز رسانی تم",
          description: "لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
    }
  };
  const handleTheme = async () => {
    setIsLoading(true);

    try {
      updateUserTheme(selectedTheme.id);
    } catch (error) {
      toast({
        title: "خطا در ذخیره تم",
      });
    }
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full h-full">
      <div className="md:w-1/3  flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-4 min-h-full px-1  ">
          <h2 className="text-xl font-bold">انتخاب تم</h2>
          <span className="flex items-center gap-2">
            <InfoIcon color="yellow" />
            <p className="text-sm">
              پس از انتخاب تم مدنظر، حتما دکمه ذخیره تم انتخاب شده را بفشارید.
            </p>
          </span>
          {presetThemes.map(
            (theme) =>
              theme.isPublic && (
                <button
                  key={theme.id}
                  className={clsx(
                    "p-3 w-full rounded-lg text-white font-semibold ",
                    theme.id === selectedTheme.id
                      ? "ring-2 ring-offset-2 ring-blue-800"
                      : "",
                    `bg-gradient-to-r from-${theme.options[0].color} to-${theme.options[1].color}`
                  )}
                  onClick={() => handleSelect(theme.id)}
                >
                  {theme.name}
                </button>
              )
          )}
          {privateUserTheme && (
            <button
              className={cn(
                "bg-red-500 p-2 rounded-lg animate-pulse",
                privateUserTheme.id === selectedTheme.id
                  ? "ring-2 ring-offset-2 ring-blue-800"
                  : ""
              )}
              onClick={() => handleSelect(privateUserTheme.id)}
            >
              تم اختصاصی {user?.menuName}
            </button>
          )}
        </div>
        <Button onClick={handleTheme} disabled={isLoading} className="w-1/2">
          {isLoading ? "در حال ذخیره..." : "ذخیره تم انتخاب‌شده"}
        </Button>
      </div>
    </div>
  );
}
