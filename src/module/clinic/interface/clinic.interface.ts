import { ObjectId, Document, PopulatedDoc } from "mongoose";
import internal from "stream";
import { authProviderEnum, genderEnum } from "../../../constants/enums";
import { IClinicSubscriptionModel } from "./clinicSubscription.inteface";

// interface for mongoose schema
export interface IClinicModel extends IClinic, Document {
  createdAt?: string;
  updatedAt?: string;
}

export interface IClinicAddress {
  address: string;
  pincode?: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  city: string;
  apartment?: string;
}

export interface IClinicContact {
  phoneNo: number;
  dialCode: number;
}

//basic schema for clinic
export interface IClinic {
  doctorName: string;
  clinicName: String;
  authProvider: authProviderEnum;
  email?: string;
  contact: IClinicContact;
  address: IClinicAddress;
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality: string[];
  isVerified: boolean;
  // subStartDate: string;
  // subEndDate: string;
  about?: string;
  publicNo?: number;
  notice?: string;
  hasClinicStarted: boolean;
}

// iterface for body parameter
export interface IClinicRegistrationDetails {
  doctorName: string;
  phoneNo: number;
  clinicName: string;
  apartment?: string;
  address: string;
  email?: string;
  coordinates: number[];
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality: string[];
  pincode?: string;
  city: string;
}

export interface IClinicUpdate {
  doctorName: string;
  clinicName: String;
  address: IClinicAddress;
  gender?: genderEnum;
  dateOfBirth?: string;
  profilePicUrl?: string;
  notice?: string;
  publicNo?: number;
  about?: string;
  speciality: string[];
}

export interface IFcmClinicTokenModel extends Document {
  clinicId: PopulatedDoc<IClinicModel>;
  fcm: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClinicNotification {
  clinicId: PopulatedDoc<IClinicModel>;
  title: string;
  isSeen: boolean;
  subtitle?: string;
}

export interface IClinicNotificationModel extends Document {
  createdAt?: string;
  updatedAt?: string;
}

