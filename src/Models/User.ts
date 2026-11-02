import mongoose, { Schema, models } from "mongoose";

type plan = "free" | "silver" | "gold" | "expired";
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: "admin";
  menu: string;
  username: string;
  menuLogo: string;
  isOnboarded: boolean;
  firstname: string;
  lastname: string;
  menuName: string;
  address?: string;
  phone?: string;
  decription: string;
  qrcode: string;
  theme?: string;
  plan: plan;
  planActivatedAt: Date;
  planExpiresAt: Date;
  isPlanActive: boolean;
  multiLang?: boolean;
  loyalty: {
    isActive: boolean;
    pointRate: number;
    rewards: IReward[];
  };
}
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    menu: { type: String, ref: "Menu" },
    username: { type: String, required: true, unique: true },
    menuLogo: String,
    isOnboarded: { type: Boolean, default: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    menuName: { type: String },
    address: { type: String },
    phone: { type: String },
    description: { type: String },
    qrcode: { type: String },
    theme: { type: String, default: "sunset" }, // Default theme
    plan: {
      type: String,
      enum: ["free", "silver", "gold", "expired"],
      default: "free",
    },
    planActivatedAt: { type: Date, default: Date.now },
    planExpiresAt: { type: Date },
    isPlanActive: { type: Boolean, default: true },
    multiLang: { type: Boolean, default: false },
    loyalty: {
      isActive: { type: Boolean, default: true },
      expiresAt: Date,
      pointRate: { type: Number, default: 10000 },
      rewards: [
        {
          isActive: { type: Boolean, default: true },
          title: String,
          requiredPoints: Number,
          type: {
            type: String,
            enum: ["discount", "freeItem"],
            default: "discount",
          },
          expiresAt: { type: Date || String || null },
          value: { type: mongoose.Schema.Types.Mixed, required: true }, // percentage for discount or item ID for freeItem
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || mongoose.model("User", userSchema);
