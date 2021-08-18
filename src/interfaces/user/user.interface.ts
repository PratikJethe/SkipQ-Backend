import { authProviderEnum ,genderEnum} from "../../constants/enums";


export interface IGeometry{
    type?:String
  coordinates?:number[]
}

export interface IUser {
  fullName:String,
  phoneNo:number,
  authProvider:authProviderEnum,
  apartment?:String,
  address?:String,
  email?:String,
  geometry?:{
    type?:String,
    coordinates?:number[]
  },
  gender?:genderEnum,
  fcm:String
}

export interface IUserRegistrationDetails{
  fullName:String,
  phoneNo:number,
  authProvider:authProviderEnum,
  apartment?:String,
  address?:String,
  email?:String,
  coordinates?:number[],
  gender?:genderEnum,
  fcm:String
}

