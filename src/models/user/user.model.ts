import { IUser } from "../../interfaces/user/user.interface";
import { genderEnum, authProviderEnum } from "../../constants/enums";
import { Mongoose, Schema, model, Model } from "mongoose";

const UserSchema: Schema<IUser> = new Schema<IUser>(
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
    address2: {
      type: String
    },
    geometry: {
      type: { type: String },
      coordinates: [Number]
    },

    fcm: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

UserSchema.index({ geometry: "2dsphere" });
export const UserModel: Model<IUser> = model<IUser>("user", UserSchema);
