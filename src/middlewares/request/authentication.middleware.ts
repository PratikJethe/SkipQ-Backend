import { Request, Response, NextFunction } from "express";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { apiResponseService } from "../../services/apiResponse.service";
import { jwtService } from "../../services/jsonWebToken.service";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    let response: IApiResponse = {
      status: 401,
      errorMsg: "Unauthorized access"
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  try {
    let client = jwtService.verfiyJwt(req.cookies.token);
    req.client = client;
  } catch (error) {
      console.log(error)
    let response: IApiResponse = {
      status: 401,
      errorMsg: "Unauthorized access"
    };
    return apiResponseService.responseHandler(response, req, res, next);
  }

  next();
}
