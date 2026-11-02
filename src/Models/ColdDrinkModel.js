import { Schema } from "mongoose";
import mongoose from "mongoose";
const coldDrinkSchema = new Schema(
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
export const coldDrinkModel =
  mongoose.models.ColdDrink || mongoose.model("ColdDrink", coldDrinkSchema);
