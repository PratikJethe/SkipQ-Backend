import { PopulatedDoc,Document } from "mongoose"
import { subscriptionType } from "../../../constants/enums/clinic.enum"
import { IClinicModel } from "./clinic.interface"

export interface IClinicSubscriptionModel extends IClinicSubscription, Document{
    createdAt?:string,
    updatedAt?:string
}

export interface IClinicSubscription {
    clinic: PopulatedDoc<IClinicModel>
    plan:PopulatedDoc<IClinicPlan>
    subStartDate:string,
    subEndDate:string,
    subscriptionType:subscriptionType,
    paymentInfo?:object
   
}
export interface IClinicPlanModel extends IClinicPlan, Document{
    createdAt?:string,
    updatedAt?:string
}

export interface IClinicPlan {
    amount:number,
    isMonthly:boolean,
    duration:number,
    currency:string,

}