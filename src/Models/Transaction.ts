import mongoose, { Schema, models } from "mongoose";

export interface ITransaction extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  plan: "silver" | "gold";
  amount: number;
  trackId: string;
  status: "success" | "failed";
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["silver", "gold"], required: true },
    amount: { type: Number, required: true },
    trackId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    paidAt: { type: Date, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

export const Transaction =
  models.Transaction || mongoose.model("Transaction", transactionSchema);
