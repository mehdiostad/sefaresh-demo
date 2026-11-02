"use client";
import { imageUrl } from "@/demo/seed";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/stores/useDashboardData";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function QRCode({
  menuUrl,
  userId,
}: {
  menuUrl: string;
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const updateUser = useDashboardData((s) => s.updateUser);
  const user = useDashboardData((s) => s.user);
  const [qrImage, setQrImage] = useState<string>("");
  const { toast } = useToast();
  const generateQR = async () => {
    setIsLoading(true);
    const res = await fetch("/api/generate_qr", {
      method: "POST",
      body: JSON.stringify({ url: menuUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const base64 = data.image;
    const mime = base64.match(/data:(.*);base64/)?.[1] || "image/png";
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    const file = new File([blob], "qrcode.png", { type: mime });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "qr_codes");
    formData.append("id", userId || "");
    formData.append("selectedImg", "qrcode");

    const qrImgRes = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });
    const savedQr = await qrImgRes.json();
    if (qrImgRes.ok) {
      updateUser({
        qrcode: savedQr.qrcode,
      });
      toast({ title: "بارکد شما با موفقیت ساخته شد" });
      setQrImage(
        imageUrl(savedQr.qrcode, "qr_codes")
      );
    } else {
      toast({
        title: "مشکلی در ساخت بارکد شما به وجود آمده، لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const downloadImage = () => {
    if (!qrImage) return;
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "qrcode.png";
    a.click();
  };
  useEffect(() => {
    if (user?.qrcode) {
      setQrImage(
        imageUrl(user.qrcode, "qr_codes")
      );
    }
  }, [user]);
  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="spinner" />
      </div>
    );
  return (
    <div className="space-y-4 h-full">
      {user && !user?.qrcode && (
        <Button
          onClick={generateQR}
          className="bg-transparent text-opacity-50 hover:bg-transparent hover:border-rose-500 w-full h-full border-2 border-dashed"
        >
          + بارکد منوی خود را بسازید
        </Button>
      )}

      {qrImage && (
        <div className="h-full flex flex-col items-center gap-8 justify-center">
          <Image
            src={qrImage}
            width={40}
            height={40}
            alt="QR Code"
            className="w-64 h-auto rounded-lg border-2"
          />
          <button
            onClick={downloadImage}
            className="bg-green-500 text-white w-64 px-4 py-2 rounded"
          >
            دانلود QR Code
          </button>
        </div>
      )}
    </div>
  );
}
