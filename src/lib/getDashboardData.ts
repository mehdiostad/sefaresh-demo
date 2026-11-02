import { createDemoState, dashboardUser } from "@/demo/seed";
export async function getDashboardData() {
  const state = createDemoState();
  return { user: dashboardUser(state), fullMenu: state.menu };
}
