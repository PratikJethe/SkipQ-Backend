import { IUser, IUserModel } from "../../interfaces/user/user.interface";
import { genderEnum, authProviderEnum } from "../../constants/enums";
import { Mongoose, Schema, model, Model } from "mongoose";

const UserSchema: Schema<IUserModel> = new Schema<IUserModel>(
  {
    fullName: {
      type: String,
      required: true
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true
    },
    email: { type: String },

    authProvider: {
      type: String,
      required: true,
      enum: authProviderEnum
    },
    apartment: {
      type: String
    },
    address: {
      type: String
    },
    geometry: {
      type: { type: String },
      coordinates: [Number]
    },

    fcm: {
      type: String,
      required: true
    },
    dateOfBirth:{
       type:Date,
    },
    profilePicUrl:{
      type:String,   
    },
    gender:{
      type:String,
      enum:genderEnum
    }
  },
  { timestamps: true }
);

UserSchema.index({ geometry: "2dsphere" });
export const UserModel: Model<IUserModel> = model<IUserModel>("user", UserSchema);
