import mongoose, { Schema, models } from "mongoose";

export interface IRedemption extends mongoose.Document {
  customerId: mongoose.Types.ObjectId;  
  userId: mongoose.Types.ObjectId;      
  rewardId?: mongoose.Types.ObjectId;   
  rewardTitle: string;                  
  type: "discount" | "freeItem";         
  value?: number;                        
  pointsUsed: number;                    
}

const redemptionSchema = new Schema<IRedemption>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rewardId: { type: Schema.Types.ObjectId },
    rewardTitle: { type: String, required: true },
    type: { type: String, enum: ["discount", "freeItem"], required: true },
    value: { type: Schema.Types.Mixed }, 
    pointsUsed: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Redemption =
  models.Redemption || mongoose.model<IRedemption>("Redemption", redemptionSchema);
