import OrdersTable from "@/components/Dashboard/Orders/OrdersLive/OrdersTable";
import { authOptions } from "@/lib/authOptions";
import { getAllUserOrders } from "@/lib/getAllUserOrders";
import { getDemoSession as getServerSession } from "@/demo/server";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  const username = session?.user.role === "admin" ? session?.user.username : "";
  const orders = await getAllUserOrders({ username });
  return (
    <>
      <OrdersTable initialData={orders} username={username} />
    </>
  );
};

export default page;
