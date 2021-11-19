import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { apiResponseService } from "../../services/apiResponse.service";

export function validationError(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
 

  if (!errors.isEmpty()) {

    let response:IApiResponse ={
      status:400,
      errorMsg:errors.array()[0].msg,
    } 

  console.log(errors);
    return apiResponseService.responseHandler(response,req,res,next)
  }



  next();
}
