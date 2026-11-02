"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SessionContext, SessionContextValue } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { createDemoState, dashboardUser, DEMO_USERNAME, resolveDemoCafe } from "./seed";
import { DEMO_CHANGE_EVENT, readDemoState } from "./browser";

/** Explicit demo identity; this is intentionally not production authentication. */
export default function DemoSessionProvider({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(() => admin ? dashboardUser(createDemoState()) : null);
  const [ready, setReady] = useState(admin);
  const refresh = useCallback(() => {
    const username = admin ? DEMO_USERNAME : resolveDemoCafe(pathname.split("/")[1])?.username || DEMO_USERNAME;
    const state = readDemoState(username);
    setUser(admin ? dashboardUser(state) : state.customer);
    setReady(true);
  }, [admin, pathname]);
  useEffect(() => {
    refresh();
    window.addEventListener(DEMO_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(DEMO_CHANGE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, [refresh]);
  const value = useMemo(() => ({ data: user ? { user, expires: "2099-01-01T00:00:00.000Z" } as Session : null,
    status: !ready ? "loading" as const : user ? "authenticated" as const : "unauthenticated" as const,
    update: async () => { refresh(); return null; },
  }), [ready, user, refresh]);
  return <SessionContext.Provider value={value as SessionContextValue}>{children}</SessionContext.Provider>;
}
