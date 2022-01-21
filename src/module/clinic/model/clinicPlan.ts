import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
import { IClinicPlanModel } from "../interface/clinicSubscription.inteface";
const ClinicPlanSchema: Schema<IClinicPlanModel> = new Schema<IClinicPlanModel>(
  {
    amount:{type:Number,required:true},
    isMonthly:{type:Boolean,required:true},
    duration:{type:Number,required:true},
    currency:{type:String,trim:true,required:true}
  },

  { timestamps: true }
);

export const ClinicPlanModel: Model<IClinicPlanModel> = model<IClinicPlanModel>("clinicPlans", ClinicPlanSchema);
