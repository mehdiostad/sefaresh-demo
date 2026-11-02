import DemoSessionProvider from "@/demo/SessionProvider";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DemoSessionProvider admin><div className="font-yekan">{children}</div></DemoSessionProvider>;
}
