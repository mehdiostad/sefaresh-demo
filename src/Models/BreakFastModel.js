import { Schema } from "mongoose";
import mongoose from "mongoose";
const breakFastSchema = new Schema(
  {
    type: String,
    itemName: { type: String, require: true },
    price: String,
    desc: String,
    img: String,
  },
  {
    timestamps: true,
  }
);
export const breakFastModel =
  mongoose.models.BreakFast || mongoose.model("BreakFast", breakFastSchema);
