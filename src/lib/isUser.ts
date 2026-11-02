import { getDemoUser } from "@/demo/server";
export async function isUser(username: string) { return getDemoUser(username); }
