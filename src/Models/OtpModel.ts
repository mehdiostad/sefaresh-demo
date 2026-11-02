import mongoose, { Schema, models } from "mongoose";

export interface IOtp extends mongoose.Document {
  phone: string;
  code: string;
  expiresAt: Date;
}

const otpSchema = new Schema(
  {
    phone: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Otp = models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
