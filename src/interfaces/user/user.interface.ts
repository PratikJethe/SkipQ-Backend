import mongoose, { Mongoose, ObjectId, PopulatedDoc } from "mongoose";
import { authProviderEnum, genderEnum } from "../../constants/enums";

export interface IUserAddress {
  address?: string;
  apartment?: String;
  geometry?: {
    type?: string;
    coordinates?: number[];
  };
  pincode?: string;
  city?: string;
}
export interface IUserPhone {
  phoneNo: number;
  dialCode: number;
}

export interface IUserModel extends IUser, mongoose.Document {
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  fullName: string;
  authProvider: authProviderEnum;
  address?: IUserAddress;
  email?: string;
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  contact: IUserPhone;
}

export interface IUserRegistrationDetails {
  fullName: string;
  phoneNo: number;
  apartment?: string;
  address?: string;
  email?: string;
  coordinates?: number[];
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  pincode?: string;
  dialCode: number;
  city: string;
}

export interface IFcmUserTokenModel extends Document {
  userId: PopulatedDoc<IUserModel>;
  fcm: String;
  createdAt?: string;
  updatedAt?: string;
}
