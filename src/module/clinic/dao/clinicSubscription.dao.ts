import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IClinicUpdate } from "../interface/clinic.interface";
import { IClinicPlan, IClinicPlanModel, IClinicSubscription } from "../interface/clinicSubscription.inteface";
import { ClinicModel } from "../model/clinic.model";
import { ClinicPlanModel } from "../model/clinicPlan";
import { ClinicSubscriptionModel } from "../model/clinicSubscription.model";

class ClinicSubscriptionDao {
  async createPlan(plan: IClinicPlan): Promise<IClinicPlanModel> {
    const createdPlan = await ClinicPlanModel.create(plan);
    return createdPlan;
  }

  async getPlanByID(id:any):Promise<IClinicPlanModel|null>{
    const plan: IClinicPlanModel|null = await ClinicPlanModel.findOne({'_id':id})
    return plan;
  }

  async createSubscription(subscription:IClinicSubscription){
      const createdSubscription = await ClinicSubscriptionModel.create(subscription)
      return createdSubscription
  }

  async getAllPlans(){
    const plans = await ClinicPlanModel.find({}).sort('amount');
    return plans
  }
  async getLastClinicPlan(id:any){
    const subscription = await ClinicSubscriptionModel.find({clinic:id}).sort({'createdAt':-1}).populate('plan');
    return subscription

  }
}

export default new ClinicSubscriptionDao();
