import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import { IFcmUserTokenModel } from "../../interfaces/user/user.interface";
import { IFcmClinicTokenModel } from "../../interfaces/clinic/clinic.interface";
const ClinicFcmTokenSchema: Schema<IFcmClinicTokenModel> = new Schema<IFcmClinicTokenModel>(
  {
    clinicId: { type: mongoose.Types.ObjectId, ref: "clinic", required: true },
    fcm: { type: String, required: true }
  },

  { timestamps: true }
);

export const FcmClinicModel: Model<IFcmClinicTokenModel> = model<IFcmClinicTokenModel>("clinicFcmToken", ClinicFcmTokenSchema);
