import { NextFunction, Request, Response } from "express";
import {
  IApiResponse
} from "../interfaces/apiResponse.interface";

class ApiResponseService {
//   responseError(
//     error: IApiErrorResponse,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     if (!error.status) {
//       error.status = 500;
//     }
//     return res.status(error.status).json(error);
//   }

  responseHandler(
    response: IApiResponse,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (response.status >= 400) {
      response.error = true;
      if (response.status >= 500) {
        response.errorMsg = "server error. try again later";
      }else{
        if(!response.errorMsg){
          response.errorMsg="error"
        }
      }
    }else{
        if(!response.data){
            response.data={}
        }
    }
    response.resId = req.requestId

    return res.status(response.status).json(response)


  }
}

export const apiResponseService = new ApiResponseService();
