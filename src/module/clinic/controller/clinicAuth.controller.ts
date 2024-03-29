import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { authProviderEnum, genderEnum } from "../../../constants/enums";
import { subscriptionType, TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
import clinicDao from "../dao/clinic.dao";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IFcmClinicTokenModel } from "../interface/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";

import { apiResponseService } from "../../../services/apiResponse.service";
import { clinicSubscriptionService } from "../service/clinicSubscription.service";
import { jwtService } from "../../../services/jsonWebToken.service";
import { ClinicPlanModel } from "../model/clinicPlan";
import clinicSubscriptionDao from "../dao/clinicSubscription.dao";
import { IClinicPlanModel, IClinicSubscription } from "../interface/clinicSubscription.inteface";
import { doctorSpecialty } from "../constants";

class ClinicController {
  async registerClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorName, clinicName, speciality, fcm, address, apartment, coordinates, gender, phoneNo, email, profilePicUrl, dateOfBirth, pincode, city }: IClinicRegistrationDetails = req.body;

      const freePlanId = "61e3ca023350a60e34942ec3"; // 1 month free plan Id

      const freePlan: IClinicPlanModel | null = await clinicSubscriptionDao.getPlanByDuration(process.env.FREE_TRIAL_PERIOD as any);

      if (!freePlan) {
        throw "No matching plan found";
        return;
      }

      const { subStartDate, subEndDate } = clinicSubscriptionService.generateStartEndDate(freePlan.duration);

      console.log(pincode);
      var userCredentials: IClinic = {
        doctorName,
        authProvider: authProviderEnum.PHONE,
        fcm,
        isVerified: false,
        address: {
          address: address,
          city: city,
          pincode: pincode,
          geometry: {
            type: "Point",
            coordinates: coordinates
          },
          apartment
        },
        contact: {
          phoneNo: phoneNo,
          dialCode: 91 //hardcoded for india, if changed also include an validation
        },
        gender,
        email: email?.toLowerCase(),
        profilePicUrl,
        dateOfBirth,
        clinicName,
        speciality,
        hasClinicStarted: false
      };

      const clinic: IClinicModel = await clinicDao.register(userCredentials);

      const subscriptionPlan: IClinicSubscription = {
        clinic: clinic.id,
        plan: freePlan.id,
        subEndDate,
        subStartDate,
        subscriptionType: subscriptionType.FREE_TRIAL
      };
      const subscription = await clinicSubscriptionDao.createSubscription(subscriptionPlan);
      const saveFcm: IFcmClinicTokenModel | null = await clinicDao.saveFcm(fcm, clinic.id);

      let response: IApiResponse = {
        status: 200,
        data: clinic
      };

      const token = jwtService.createJwt({ id: clinic._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000,
        httpOnly: true
      });

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async phoneLogin(req: Request, res: Response, next: NextFunction) {
    console.log("called");
    const { phoneNo, fcm, uid } = req.body; //verify firebase id
    try {
      const clinic: IClinicModel | null = await clinicDao.findByNumber(phoneNo);

      if (!clinic) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "clinic not found"
        };

        return next(response);
      }

      const saveFcm: IFcmClinicTokenModel | null = await clinicDao.saveFcm(fcm, clinic.id);
      const response: IApiResponse = {
        data: clinic,
        status: 200
      };

      const token = jwtService.createJwt({ id: clinic._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000,
        httpOnly: true
      });

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async getCliicById(req: Request, res: Response, next: NextFunction) {
    //verify firebase id
    try {
      const clinic: IClinicModel | null = await clinicDao.findById(req.client.id);

      if (!clinic) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "clinic not found"
        };

        return next(response);
      }
      console.log(clinic);

      const response: IApiResponse = {
        data: clinic,
        status: 200
      };

      const token = jwtService.createJwt({ id: clinic._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000, //30 days in miliseconds
        // maxAge: 600, //  60 sec for test
        httpOnly: true
      });

      return next(response);
    } catch (error) {
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async getSpecialities(req: Request, res: Response, next: NextFunction) {
    //verify firebase id
    try {
    

      const response: IApiResponse = {
        data: doctorSpecialty,
        status: 200
      };

  

      return next(response);
    } catch (error) {
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
}

export default new ClinicController();
