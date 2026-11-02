import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema<OrderEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    orderId: { type: Number, required: true, unique: true },
    items: [
      {
        itemId: String,
        name: String,
        price: Number,
        qty: Number,
        free: Boolean,
      },
    ],
    note: String,
    total: { type: Number, required: true },
    baseTotal: { type: Number, required: true },
    appliedCouponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    status: { type: String, default: "pending" },
    customer: {
      name: String,
      table: Number,
      phone: { type: String, required: true },
    },

    // Loyalty
    earnedPoints: { type: Number, default: 0 },
    redeemedPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
