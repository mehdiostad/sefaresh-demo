type plan = "free" | "silver" | "gold" | "expired";
interface IDashboardUser {
  id: string;
  email: string;
  username: string;
  role: "admin";
  multiLang?: boolean;
  menuId?: string;
  menuLogo: string;
  isOnboarded: boolean;
  phone?: string;
  address?: string;
  createdAt: string;
  description?: string;
  menuName: string;
  qrcode?: string;
  theme: string;
  plan: plan;
  planExpiresAt: string;
  loyalty: {
    isActive: boolean;
    pointRate: number; // e.g., 10000 means 1 point per $10000 spent
    rewards: IReward[];
  };
}

interface IApiUser {
  _id: string;
  email: string;
  username: string;
  role: "admin";
  multiLang?: boolean;
  menuId?: string;
  menuLogo: string;
  isOnboarded: boolean;
  phone?: string;
  address?: string;
  createdAt: string;
  description?: string;
  menuName: string;
  qrcode?: string;
  theme: string;
  plan: Plan;
  planExpiresAt: string;
  loyalty: {
    isActive: boolean;
    pointRate: number;
    rewards: IReward[];
  };
}
