import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import clinicDao from "../../dao/clinic/clinic.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { apiResponseService } from "../../services/apiResponse.service";
import { clinicService } from "../../services/clinic/clinic.service";
import { jwtService } from "../../services/jsonWebToken.service";

export async function getClinicByIdFromToken(req: Request, res: Response, next: NextFunction) {
  try {
    const clinic: IClinicModel | null = await clinicService.getClinicById(req.client.id);
    console.log(req.client.id);
    if (!clinic) {
      let response: IApiResponse = {
        status: 404,
        errorMsg: "clinic not found"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }
    req.clinic = clinic;
  } catch (error) {
    let response: IApiResponse = {
      status: 500,
      errorMsg: "clinic not found"
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}

export async function getClinicByIdFromBody(req: Request, res: Response, next: NextFunction) {
  try {
    const clinic: IClinicModel | null = await clinicService.getClinicById(req.body.clinicId);

    if (!clinic) {
      let response: IApiResponse = {
        status: 404,
        errorMsg: "clinic not found"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }
    req.clinic = clinic;
  } catch (error) {
    let response: IApiResponse = {
      status: 500,
      errorMsg: "clinic not found"
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}


export async function getClinicByIdFromParams(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.clinicId;
    console.log(id);
    if (id == undefined || typeof id != "string" || !isValidObjectId(id)) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "Invalid id"
      };

      return next(response);
    }

    const searchedClinic: IClinicModel | null = await clinicDao.findById(id);

    if (!searchedClinic) {
      let response: IApiResponse = {
        status: 404,
        errorMsg: "Clinic not found"
      };

      return next(response);
    }

    req.clinic = searchedClinic;
  } catch (error) {
    let response: IApiResponse = {
      status: 500,
      errorMsg: "clinic not found"
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}

export async function checkIfClinicEmailOrPhoneExist(req: Request, res: Response, next: NextFunction) {
  try {
    const clinicExist: boolean = await clinicService.checkIfEmailorPhoneExist(req.body.phoneNo, req.body.email);

    if (clinicExist) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "Email already registered"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }

    next();
  } catch (error) {
    console.log(error);
    let response: IApiResponse = {
      status: 500
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }
}
