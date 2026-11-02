import DemoSessionProvider from "@/demo/SessionProvider";
export default function UsernameLayout({ children }: { children: React.ReactNode }) {
  return <DemoSessionProvider>{children}</DemoSessionProvider>;
}
