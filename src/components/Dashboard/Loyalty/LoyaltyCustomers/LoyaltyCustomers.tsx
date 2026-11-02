"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./DataTable";
import { ColCustomer, columns } from "./culomns";
import { Loader2 } from "lucide-react";

export default function LoyaltyCustomers({ userId }: { userId?: string }) {
  const [customers, setCustomers] = useState<ColCustomer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await fetch(`/api/loyalty/customers/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(Object.values(data.customers).flat() as any);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [userId]);
  if (loading)
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <div className="w-full h-full overflow-auto p-4">
      <CardContent className="w-full" dir="rtl">
        <DataTable data={customers} columns={columns} />
      </CardContent>
    </div>
  );
}
