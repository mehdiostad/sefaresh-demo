"use client";
import {
  IconCalendar,
  IconCategory,
  IconClipboardList,
  IconClipboardListFilled,
  IconFriends,
  IconHome,
  IconInbox,
  IconPalette,
  IconReportAnalytics,
  IconSearch,
  IconSettings,
  IconTable,
} from "@tabler/icons-react";
import React from "react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User2,
  ChevronUp,
  Plus,
  Projector,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MenuLogo from "../MenuLogo";
import { demoSignOut as signOut } from "@/demo/browser";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const AppSidebar = ({ username }: { username: string }) => {
  type SidebarItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    target?: string;
  };

  const items: SidebarItem[] = [
    {
      title: "خانه",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "اشتراک",
      url: "/dashboard/plans",
      icon: IconClipboardListFilled,
    },
    // {

    //   url: "/dashboard/orders",
    //   icon: IconTable,
    // },
    // {

    //   url: "/" + username,
    //   icon: IconInbox,
    //   target: "_blank",
    // },
    // {

    //   url: "#",
    //   icon: IconCalendar,
    // },
    // {

    //   url: "#",
    //   icon: IconSearch,
    // },
    // {

    //   url: "/dashboard/settings/",
    //   icon: IconSettings,
    // },
  ];
  const { open, isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" side="right">
      <div
        className={cn(
          "h-full flex flex-col  ",
          isMobile
            ? "bg-gray-700/70 text-white backdrop-blur-sm border-none"
            : "",
        )}
      >
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <MenuLogo
                    title={open ? "داشبورد" : ""}
                    logo="/heart.png"
                    className="border-none justify-start text-sm font-light"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent dir="rtl">
          <SidebarGroup>
            {/* <SidebarMenuItem key={"your-menu"}> */}
            <SidebarMenuButton
              asChild
              className="bg-sky-700 hover:bg-sky-800 rounded-lg mb-4"
            >
              <Link href={"/" + username} target={"_blank"}>
                <IconInbox color="white" />
                <span className="text-white">مشاهده منو!</span>
              </Link>
            </SidebarMenuButton>
            {/* </SidebarMenuItem> */}
            {}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        target={item?.target || ""}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Inbox" && (
                      <SidebarMenuBadge>24</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>مدیریت</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard/categories"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <IconCategory />
                      منوساز
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between  gap-1">
                      <Link
                        href="/dashboard/orders"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <IconTable size={20} />
                        <p className="text-transparent  bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                          سفارشات آنلاین
                        </p>
                      </Link>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between  gap-1">
                      <Link
                        href="/dashboard/loyalty"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <IconFriends size={20} />
                        باشگاه مشتریان
                      </Link>
                      <Badge>
                        <span className="text-xs">جدید</span>
                      </Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between  gap-1">
                      <Link
                        href="/dashboard/reports"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <IconReportAnalytics size={20} />
                        گزارشات
                      </Link>
                      <Badge>
                        <span className="text-xs">جدید</span>
                      </Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={"/dashboard/settings"}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <IconSettings />
                      تنظیمات
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu className="border border-white/50 rounded-lg">
            <SidebarMenuItem>
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    {username}
                    <ChevronUp className="mr-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="flex flex-col gap-2 p-2 bg-sidebar-accent"
                >
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={() => router.push(`/${username}`)}
                      className="w-full text-left hover:cursor-pointer"
                    >
                      <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                      منوی شما
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={() => {
                        router.push("/dashboard/settings");
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className="w-full text-left hover:cursor-pointer "
                    >
                      <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                      تنظیمات
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="w-full text-left hover:cursor-pointer"
                  >
                    <Button
                      onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/" })
                      }
                      variant={"destructive"}
                    >
                      <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                      خروج
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
