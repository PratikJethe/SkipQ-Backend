import { Request, Response, NextFunction } from "express";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { IUserModel } from "../../interfaces/user/user.interface";
import { apiResponseService } from "../../services/apiResponse.service";
import { clinicService } from "../../services/clinic/clinic.service";
import { jwtService } from "../../services/jsonWebToken.service";
import { userService } from "../../services/user/user.service";

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
    console.log(error)
    let response: IApiResponse = {
      status: 500,
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}

export async function checkIfUserEmailOrPhoneExist(req: Request, res: Response, next: NextFunction){

  try {
    const userExist: boolean = await userService.checkIfEmailorPhoneExist(req.body.phoneNo,req.body.email);

    if (userExist) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "Email or Phone number already registered"
      };

      return apiResponseService.responseHandler(response, req, res, next);
    }

   next() 
  } catch (error) {
    console.log(error)
    let response: IApiResponse = {
      status: 500,
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
