import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPage extends Document {
  menuId: Types.ObjectId;
  title: string;
  items: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema<IPage>(
  {
    menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
    title: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  },
  { timestamps: true }
);

export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);
