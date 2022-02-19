import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IFcmUserTokenModel } from "../interface/user.interface";

const UserFcmTokenSchema : Schema<IFcmUserTokenModel> = new Schema<IFcmUserTokenModel>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true,index:true },
   fcm:{type:String,required:true}
  },

  { timestamps: true }
);

export const FcmUserModel: Model<IFcmUserTokenModel> = model<IFcmUserTokenModel>("userFcmToken", UserFcmTokenSchema);
