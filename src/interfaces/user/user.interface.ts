import mongoose,{ Mongoose, ObjectId } from "mongoose";
import { authProviderEnum, genderEnum } from "../../constants/enums";

export interface IUserModel extends IUser,mongoose.Document  {
  createdAt?:string,
  updatedAt?:string,
}

export interface IUser {
  fullName: string;
  phoneNo: number;
  authProvider: authProviderEnum;
  apartment?: string;
  address?: string;
  email?: string;
  geometry?: {
    type?: string;
    coordinates?: number[];
  };
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
}

export interface IUserRegistrationDetails {
  fullName: string;
  phoneNo: number;
  authProvider: authProviderEnum;
  apartment?: string;
  address?: string;
  email?: string;
  coordinates?: number[];
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
}
