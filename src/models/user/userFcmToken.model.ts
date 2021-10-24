import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import { IFcmUserTokenModel } from "../../interfaces/user/user.interface";
const UserFcmTokenSchema : Schema<IFcmUserTokenModel> = new Schema<IFcmUserTokenModel>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
   fcm:{type:String,required:true}
  },

  { timestamps: true }
);

export const FcmUserModel: Model<IFcmUserTokenModel> = model<IFcmUserTokenModel>("userFcmToken", UserFcmTokenSchema);
