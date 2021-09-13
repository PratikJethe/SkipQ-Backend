import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { genderEnum } from "../../constants/enums";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import clinicDao from "../../dao/clinic/clinic.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinic, IClinicModel, IClinicRegistrationDetails } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";

import { apiResponseService } from "../../services/apiResponse.service";
import { clinicSubscriptionService } from "../../services/clinic/clinicSubscription.service";
import { jwtService } from "../../services/jsonWebToken.service";

class ClinicController {
  async registerClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorName, authProvider, clinicName, speciality, fcm, address, apartment, coordinates, gender, phoneNo, email, profilePicUrl, dateOfBirth,pincode }: IClinicRegistrationDetails = req.body;

    
     const{subStartDate,subEndDate} =  clinicSubscriptionService.generateStartEndDate(1)
  console.log(pincode)
      var userCredentials: IClinic = {
        doctorName,
        authProvider,
        fcm,
        isVerified: false,
        address,
        apartment,
        gender,
        phoneNo,
        email,
        profilePicUrl,
        dateOfBirth,
        clinicName,
        speciality,
        geometry: {
          type: "Point",
          coordinates: coordinates
        },
        pincode,
        isSubscribed:true,
        subEndDate,
        subStartDate,
        hasClinicStarted:false,
      
      };

      const clinic: IClinicModel = await clinicDao.register(userCredentials);

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
      console.log(error)
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async phoneLogin(req: Request, res: Response, next: NextFunction) {
    const { phoneNo } = req.body; //verify firebase id
    try {
      const clinic: IClinicModel | null = await clinicDao.findByNumber(phoneNo);

      if (!clinic) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "clinic not found"
        };

        return next(response);
      }
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
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  
}

export default new ClinicController();
