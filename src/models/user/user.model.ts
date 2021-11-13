import { IUser, IUserModel } from "../../interfaces/user/user.interface";
import { genderEnum, authProviderEnum } from "../../constants/enums";
import { Mongoose, Schema, model, Model } from "mongoose";

const userAddressSchema = new Schema(
  {
    address: { type: String },
    apartment: { type: String },
    geometry: {
      type: { type: String },
      coordinates: { type: [Number], requied: false, default: undefined }
    },
    pincode: {
      type: String,
      trime: true
    },
    city: {
      type: String
    }
  },
  { _id: false }
);

const userContactSchema = new Schema(
  {
    phoneNo: { type: Number, required: true, unique: true },
    dialCode: { type: Number, required: true }
  },
  { _id: false }
);

const UserSchema: Schema<IUserModel> = new Schema<IUserModel>(
  {
    fullName: {
      type: String,
      required: true
    },
    contact: userContactSchema,
    email: { type: String },

    authProvider: {
      type: String,
      required: true,
      enum: authProviderEnum
    },
    apartment: {
      type: String
    },

    address: { type: userAddressSchema },

    fcm: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    profilePicUrl: {
      type: String
    },
    gender: {
      type: String,
      enum: genderEnum
    }
  },
  { timestamps: true }
);

UserSchema.index({ "address.geometry": "2dsphere" });
export const UserModel: Model<IUserModel> = model<IUserModel>("user", UserSchema);
