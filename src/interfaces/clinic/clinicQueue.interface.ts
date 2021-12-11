import { ObjectId,Document, PopulatedDoc} from "mongoose";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import { IUserModel } from "../user/user.interface";
import { IClinicModel } from "./clinic.interface";

export interface IClinicQueueModel extends IClinicQueue, Document{
    createdAt?:string,
    updatedAt?:string
}

export interface IClinicQueue {
    userId:PopulatedDoc<IUserModel> 
    clinicId: PopulatedDoc<IClinicModel>
    tokenStatus:TokenStatusEnum
    userType:UserTypeEnum
    userName?:string
    tokenNumber?:number
}