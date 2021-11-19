import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { authProviderEnum, genderEnum } from "../../constants/enums";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import clinicDao from "../../dao/clinic/clinic.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IFcmClinicTokenModel } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";

import { apiResponseService } from "../../services/apiResponse.service";
import { clinicSubscriptionService } from "../../services/clinic/clinicSubscription.service";
import { jwtService } from "../../services/jsonWebToken.service";

class ClinicController {
  async registerClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorName, clinicName, speciality, fcm, address, apartment, coordinates, gender, phoneNo, email, profilePicUrl, dateOfBirth, pincode, city }: IClinicRegistrationDetails = req.body;

      const { subStartDate, subEndDate } = clinicSubscriptionService.generateStartEndDate(1);
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
        isSubscribed: true,
        subEndDate,
        subStartDate,
        hasClinicStarted: false
      };

      const clinic: IClinicModel = await clinicDao.register(userCredentials);

      console.log(clinic.id);
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
      console.log(error)
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
}

export default new ClinicController();
