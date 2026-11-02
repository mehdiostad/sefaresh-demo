import { getDemoUser } from "@/demo/server";
export async function getUserData({ username, userId }: { username?: string | null; userId?: string | null }) {
  return getDemoUser(username || userId);
}
