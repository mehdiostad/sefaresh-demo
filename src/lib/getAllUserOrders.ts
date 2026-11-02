import { createDemoState } from "@/demo/seed";
export async function getAllUserOrders(_query: { username?: string; phonenumber?: string }) {
  return createDemoState().orders as OrderEvent[];
}
