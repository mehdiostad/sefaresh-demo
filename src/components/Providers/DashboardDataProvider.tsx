"use client";
import { useDashboardData } from "@/stores/useDashboardData";
import { useEffect, useState } from "react";
import { DEMO_CHANGE_EVENT, readDemoState } from "@/demo/browser";
import { dashboardUser, DEMO_USERNAME } from "@/demo/seed";
export function DashboardDataProvider({ data, children }: { data: { user: any; fullMenu: any }; children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const refresh = () => { const state = readDemoState(DEMO_USERNAME); useDashboardData.getState().setData({ user: dashboardUser(state), fullMenu: state.menu }); };
    refresh(); setReady(true);
    // Let existing optimistic handlers finish before rehydrating the authoritative demo data.
    const changed = () => { queueMicrotask(refresh); };
    window.addEventListener(DEMO_CHANGE_EVENT, changed); window.addEventListener("storage", changed);
    return () => { window.removeEventListener(DEMO_CHANGE_EVENT, changed); window.removeEventListener("storage", changed); };
  }, []);
  return ready ? <>{children}</> : null;
}
