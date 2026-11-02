"use client";
import { useSession } from "next-auth/react";
import AuthFlow from "./AuthFlow";

export default function AuthGate({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  const { data: session, status } = useSession();
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full flex-col">
        <div className="spinner"></div>
        <p className="text-white" dir="rtl">
          لطفا صبر کنید...
        </p>
      </div>
    );
  }

  if (!session || session.user.role !== "customer") {
    return (
      <div className="flex justify-center items-center h-full font-yekan">
        <AuthFlow />
      </div>
    );
  }

  return <>{children}</>;
}
