import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema({
  code: { type: String, unique: true, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  rewardId: { type: Schema.Types.ObjectId, required: false }, 
  source: { type: String, enum: ["loyalty", "campaign"], required: true },
  type: { type: String, enum: ["discount", "freeItem"], required: true },
  value: { type: Schema.Types.Mixed, required: true },
  status: {
    type: String,
    enum: ["active", "reserved", "used" , "expired"],
    default: "active",
  },
  isActive: { type: Boolean, default: true },
  usedAt: { type: Date },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Coupon = models.Coupon || model("Coupon", CouponSchema);
