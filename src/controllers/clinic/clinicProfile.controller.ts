import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { genderEnum } from "../../constants/enums";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import clinicDao from "../../dao/clinic/clinic.dao";
import clinicProfileDao from "../../dao/clinic/clinicProfile.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IClinicUpdate } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";

import { apiResponseService } from "../../services/apiResponse.service";
import { jwtService } from "../../services/jsonWebToken.service";

class ClinicProfileController {
  async searchClinic() {}

  async updateClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = req.clinic;
      const { address, clinicName, coordinates, doctorName, pincode, apartment, dateOfBirth, gender, profilePicUrl, speciality, city } = req.body;
      const clinicUpadteData: IClinicUpdate = {
        address: {
          address,
          city,
          geometry: {
            type: "Point",
            coordinates: coordinates
          },
          pincode,
          apartment
        },
        clinicName,
        doctorName,
        speciality,
        dateOfBirth,
        gender,
        profilePicUrl
      };

      const updatedClinic: IClinicModel | null = await clinicProfileDao.updatedClinic(clinicUpadteData, clinic.id);

      if (!updatedClinic) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updatedClinic
      };

      return next(response);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new ClinicProfileController();
