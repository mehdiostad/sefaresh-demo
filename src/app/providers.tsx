"use client";
import DemoSessionProvider from "@/demo/SessionProvider";
export default function Providers({ children }: { children: React.ReactNode; session?: any }) { return <DemoSessionProvider>{children}</DemoSessionProvider>; }
