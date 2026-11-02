export const revalidate = 300;
import Slider from "@/components/Menu/Slider";
import { Suspense } from "react";
import { LoadingSpinner } from "@/app/loading";
import { getAllItems } from "@/lib/getAll";
import { isUser } from "@/lib/isUser";
import { notFound } from "next/navigation";
import { Metadata, Viewport } from "next";

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const userData = await isUser(username);
  return {
    title: `دموی منوی آنلاین ${userData?.publicUserInfo?.menuName || "کافه"}`,
    description: `Profile page for ${username}`,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};


const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const userPage = await isUser(username);
  if (!userPage.ok) notFound();
  const data = await getAllItems(username);
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Slider
        data={data}
        menuName={userPage?.publicUserInfo?.menuName}
        menuLogo={userPage?.publicUserInfo?.menuLogo}
        username={username}
      />
    </Suspense>
  );
};

export default page;
