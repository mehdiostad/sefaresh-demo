interface IReward {
  _id: string;
  title: string;
  requiredPoints: number;
  type: "discount" | "freeItem";
  value: number | string;
  isActive: boolean;
  expiresAt: string | null | Date;
}
