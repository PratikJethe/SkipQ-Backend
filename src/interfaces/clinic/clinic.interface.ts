import { ObjectId,Document } from "mongoose";
import { authProviderEnum, genderEnum } from "../../constants/enums";


// interface for mongoose schema
export interface IClinicModel extends IClinic,Document{
  createdAt?:string,
  updatedAt?:string
}

//basic schema for clinic
export interface IClinic{
  doctorName: string;
  phoneNo: number;
  clinicName:String;
  authProvider: authProviderEnum;
  apartment?: string;
  address: string;
  email?: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality:string[],
  isVerified:boolean,
  isSubscribed:boolean,
  subStartDate:string,
  subEndDate:string
}


// iterface for body parameter
export interface IClinicRegistrationDetails {
  doctorName: string;
  phoneNo: number;
  clinicName:string;
  authProvider: authProviderEnum;
  apartment?: string;
  address: string;
  email?: string;
  coordinates: number[];
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality:string[];
}

