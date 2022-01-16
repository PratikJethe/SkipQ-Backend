import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { subscriptionType, TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
import { IClinicSubscriptionModel } from "../interface/clinicSubscription.inteface";
const ClinicSubscriptionSchema: Schema<IClinicSubscriptionModel> = new Schema<IClinicSubscriptionModel>(
  {
    clinic: { type: mongoose.Types.ObjectId, ref: "clinic", required: true },
    plan: { type: mongoose.Types.ObjectId, ref: "clinicPlans", required: true },
    subStartDate:{type:Date,required:true},
    subEndDate:{type:Date,required:true},
    subscriptionType:{type:subscriptionType,required:true},
    paymentInfo:{type:Schema.Types.Mixed,}
  },

  { timestamps: true }
);

export const ClinicSubscriptionModel: Model<IClinicSubscriptionModel> = model<IClinicSubscriptionModel>("clinicSubscription", ClinicSubscriptionSchema);
