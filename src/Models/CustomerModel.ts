import mongoose, { Schema, models } from "mongoose";

export interface ICustomer extends mongoose.Document {
  phone: string;
  fullname: string;
  otp?: string;
  role: string;
  otpExpiresAt?: Date;
  totalPoints: number;
  pointsByCafe: {
    userId: mongoose.Types.ObjectId;
    points: number;
  }[];
}

const customerSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    role: { type: String, default: "customer" },

    // Loyalty
    totalPoints: { type: Number, default: 0 },
    pointsByCafe: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        points: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Customer =
  models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);
