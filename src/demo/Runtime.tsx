"use client";
import { useEffect } from "react";
import { installDemoTransport } from "./browser";
installDemoTransport();
export default function DemoRuntime({ children }: { children: React.ReactNode }) {
  installDemoTransport();
  useEffect(() => { installDemoTransport(); }, []);
  return <>{children}</>;
}
