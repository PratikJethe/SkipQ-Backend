import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../clinic/interface/clinic.interface";
import { IUserModel } from "../interface/user.interface";
import { apiResponseService } from "../../../services/apiResponse.service";
import { clinicService } from "../../clinic/service/clinic.service";
import { jwtService } from "../../../services/jsonWebToken.service";
import { userService } from "../service/user.service";

export async function getUserByIdFromToken(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUserModel | null = await userService.getUserById(req.client.id);

    if (!user) {
      let response: IApiResponse = {
        status: 404,
        errorMsg: "user not found"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }
    req.user = user;
  } catch (error) {
    console.log(error);
    let response: IApiResponse = {
      status: 500
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}
export async function getUserByIdFromParams(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.userId;

    if (id == undefined || typeof id != "string" || !isValidObjectId(id)) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "Invalid id"
      };

      return next(response);
    }

    const user: IUserModel | null = await userService.getUserById(req.client.id);

    if (!user) {
      let response: IApiResponse = {
        status: 404,
        errorMsg: "user not found"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }
    req.user = user;
  } catch (error) {
    console.log(error);
    let response: IApiResponse = {
      status: 500
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}

export async function checkIfUserEmailOrPhoneExist(req: Request, res: Response, next: NextFunction) {
  try {
    const userExist: boolean = await userService.checkIfEmailorPhoneExist(req.body.phoneNo, req.body.email);
    console.log(userExist);
    if (userExist) {
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

// export async function getUserByIdFromBody(req: Request, res: Response, next: NextFunction) {
//   try {
//     const user: IUserModel | null = await userService.getUserById(req.body.clinicId);

//     if (!user) {
//       let response: IApiResponse = {
//         status: 404,
//         errorMsg: "user not found"
//       };

//       return apiResponseService.responseHandler(response, req, res, next);
//     }
//     req.user = user;
//   } catch (error) {
//     let response: IApiResponse = {
//       status: 500,
//       errorMsg: "clinic not found"
//     };
//     return apiResponseService.responseHandler(response, req, res, next);
//   }

//   next();
// }
