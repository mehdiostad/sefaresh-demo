import { Schema } from "mongoose";
import mongoose from "mongoose";
const teaSchema = new Schema(
  {
    type: String,
    itemName: String,
    price: String,
    desc: String,
    img: String,
  },
  {
    timestamps: true,
  }
);
export const teaModel = mongoose.models.Tea || mongoose.model("Tea", teaSchema);
