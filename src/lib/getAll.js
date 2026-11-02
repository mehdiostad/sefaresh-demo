import { createDemoState, isDemoUsername } from "@/demo/seed";
/** @returns {Promise<MenuProps[]>} */
export async function getAllItems(username) {
  if (!isDemoUsername(username)) return [];
  return createDemoState(new Date(), username).menu;
}
