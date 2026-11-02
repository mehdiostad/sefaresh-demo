import mongoose, { Schema, Document, Types } from "mongoose";

export interface IItem extends Document {
  categoryId: Types.ObjectId;
  itemName: string;
  description: string;
  price: number;
  secondaryPrice?: number;
  img: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  secondItemName?: string;
  order: number;
}

const ItemSchema: Schema = new Schema<IItem>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
    itemName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    secondaryPrice: { type: Number },
    img: { type: String },
    available: { type: Boolean, default: true },
    order: { type: Number, required: true },
    secondItemName: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item ||
  mongoose.model<IItem>("Item", ItemSchema);
