import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMenuCategory extends Document, Omit<MenuProps, '_id'> {
  userId: Types.ObjectId;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuCategorySchema: Schema = new Schema<IMenuCategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    firstTitle: { type: String },
    secondTitle: { type: String },
    desc: { type: String },
    downerImage: { type: Boolean, default: false },
    downerImageProps: {
      type: Object,
    },
    topDrawrerImage: { type: String },
    bottomLeftImage: { type: String },
    bottomRightImage: { type: String },
    drawerText: { type: String },
    color: { type: String },
    header: {
      type: Object,
    },
    isInteracted: { type: Boolean },
    pageNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.MenuCategory ||
  mongoose.model<IMenuCategory>("MenuCategory", MenuCategorySchema);
