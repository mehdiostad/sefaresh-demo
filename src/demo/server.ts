import { createDemoState, dashboardUser, resolveDemoCafe } from "./seed";
export async function getDemoSession(..._args: unknown[]) {
  return { user: dashboardUser(createDemoState()), expires: "2099-01-01T00:00:00.000Z" };
}
export function getDemoUser(username?: string | null) {
  const cafe = resolveDemoCafe(username);
  return cafe ? { ok: true, publicUserInfo: createDemoState(new Date(), cafe.username).user } : { ok: false, publicUserInfo: undefined };
}
