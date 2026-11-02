// src/app/(admin)/dashboard/layout.tsx
import AppSidebar from "@/components/Dashboard/AppSidebar";
import Navbar from "@/components/Dashboard/Navbar";
import { DashboardDataProvider } from "@/components/Providers/DashboardDataProvider";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getDashboardData } from "@/lib/getDashboardData";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const data = await getDashboardData();

  return (
    <DashboardDataProvider data={data}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen} >
          <div className="flex w-full font-yekan" dir="rtl">
            <AppSidebar username={data.user?.username || "کاربر"} />
            <main className="w-full max-h-screen overflow-y-auto pb-4" dir="rtl">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 right-40 h-72 w-72 rounded-full bg-purple-500 opacity-30 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-20 left-40 h-72 w-72 rounded-full bg-blue-500 opacity-25 blur-[120px] animate-move-slow" />
                <div className="absolute top-1/2 left-1/3 h-80 w-80 rounded-full bg-pink-500 opacity-20 blur-[150px] animate-move-reverse" />
              </div>
              <Navbar
                image={data.user?.menuLogo || undefined}
                username={data.user.username}
              />
              <div className=" px-4" dir="rtl">{children}</div>
            </main>
          </div>
          <Toaster style={{ fontFamily: "Yekan Bakh" }} />
        </SidebarProvider>
      </ThemeProvider>
    </DashboardDataProvider>
  );
}
