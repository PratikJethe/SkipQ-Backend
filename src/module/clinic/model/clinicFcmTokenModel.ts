import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
import { IFcmUserTokenModel } from "../../user/interface/user.interface";
import { IFcmClinicTokenModel } from "../interface/clinic.interface";
const ClinicFcmTokenSchema: Schema<IFcmClinicTokenModel> = new Schema<IFcmClinicTokenModel>(
  {
    clinicId: { type: mongoose.Types.ObjectId, ref: "clinic", required: true,index:true },
    fcm: { type: String, required: true }
  },

  { timestamps: true }
);

export const FcmClinicModel: Model<IFcmClinicTokenModel> = model<IFcmClinicTokenModel>("clinicFcmToken", ClinicFcmTokenSchema);
