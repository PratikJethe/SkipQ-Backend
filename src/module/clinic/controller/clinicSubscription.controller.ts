import { Request, Response, NextFunction } from "express";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { isActiveSubscriptionRequired } from "../constants/clinic.constants";
import clinicSubscriptionDao from "../dao/clinicSubscription.dao";
import { IClinicPlan } from "../interface/clinicSubscription.inteface";
import { ClinicPlanModel } from "../model/clinicPlan";

class ClinicSubscriptionControlller {
  async createClinicPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, duration, isMonthly } = req.body;

      if (![1, 3, 6, 12].includes(duration)) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "invalid value of months"
        };
        return next(response);
      }

      const plan: IClinicPlan = {
        amount,
        duration,
        isMonthly,
        currency: "INR"
      };
      const createdPlan = await clinicSubscriptionDao.createPlan(plan);
      let response: IApiResponse = {
        status: 200,
        data: createdPlan
      };

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
  async getClinicSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = req.clinic;

      const plans = await clinicSubscriptionDao.getAllPlans();

      console.log(clinic.id)
      const lastSubscription = await clinicSubscriptionDao.getLastClinicPlan(clinic.id);
      let data = {
        isSubscriptionRequired: isActiveSubscriptionRequired,
        availablePlans: plans,
        lastClinicSubscription: lastSubscription[0]
      };

      let response: IApiResponse = {
        status: 200,
        data: data
      };

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
}
export const clinicSubscriptionControlller = new ClinicSubscriptionControlller();
