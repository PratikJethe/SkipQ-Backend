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
import { jwtService } from "../../services/jsonWebToken.service";

class ClinicProfileController {
    
  async searchClinic(text:string){

  }

}

export default new ClinicProfileController();
