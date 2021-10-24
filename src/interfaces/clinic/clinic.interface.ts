import { ObjectId,Document } from "mongoose";
import { authProviderEnum, genderEnum } from "../../constants/enums";


// interface for mongoose schema
export interface IClinicModel extends IClinic,Document{
  createdAt?:string,
  updatedAt?:string
}

export interface IClinicAddress {
  address:string,
  pincode:number,
  geometry: {
    type: string;
    coordinates: number[];
  },
  city:string,
  apartment?:string,

}

export interface IClinicContact{
phoneNo:number,
dialCode:number
}

//basic schema for clinic
export interface IClinic{
  doctorName: string;
  clinicName:String;
  authProvider: authProviderEnum;
  email?: string;
  contact:IClinicContact;
  address:IClinicAddress
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality:string[],
  isVerified:boolean,
  isSubscribed:boolean,
  subStartDate:string,
  subEndDate:string,
  hasClinicStarted:boolean,
}


// iterface for body parameter
export interface IClinicRegistrationDetails {
  doctorName: string;
  phoneNo: number;
  clinicName:string;
  apartment?: string;
  address: string;
  email?: string;
  coordinates: number[];
  gender?: genderEnum;
  fcm: string;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality:string[];
  pincode:number;
  city:string;

}


export interface IClinicUpdate {
  doctorName: string;
  clinicName:String;
  address:IClinicAddress
  gender?: genderEnum;
  dateOfBirth?: string;
  profilePicUrl?: string;
  speciality:string[],
  
}


