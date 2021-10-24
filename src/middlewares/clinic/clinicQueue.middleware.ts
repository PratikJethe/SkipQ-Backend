import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { TokenStatusEnum } from "../../constants/enums/clinic.enum";
import clinicQueueDao from "../../dao/clinic/clinicQueue.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { apiResponseService } from "../../services/apiResponse.service";


//check if user has already a token requested/pending
export async function checkIfUserHasToken(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.client.id;
    const userToken = await clinicQueueDao.getTokenForRequiredStatusbyUserId(userId,[TokenStatusEnum.REQUESTED,TokenStatusEnum.PENDING_TOKEN]);

    if (userToken.length != 0) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "you already have a token requested or pending"
      };

      console.log(userToken);

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

//checks if token exist for user which is to be updated

export async function checkIfTokenExistForUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const tokenId = req.body.tokenId
    const userToken = await clinicQueueDao.getTokenByIdForUser(tokenId,userId);

    if (!userToken) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "token not found"
      };

      console.log(userToken);

      return apiResponseService.responseHandler(response, req, res, next);
    }

    req.clinictoken = userToken
    next();
  } catch (error) {
      console.log(error)
    let response: IApiResponse = {
      status: 500
    };

    return apiResponseService.responseHandler(response, req, res, next);
  }
}


//checks if token exist for clinic which is to be updated

export async function checkIfTokenExistForClinic(req: Request, res: Response, next: NextFunction) {
  try {
    const clinicId = req.clinic.id;
    const tokenId = req.body.tokenId
    const userToken = await clinicQueueDao.getTokenByIdForClinic(tokenId,clinicId);

    if (!userToken) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "token not found"
      };

      console.log(userToken);

      return apiResponseService.responseHandler(response, req, res, next);
    }


    req.clinictoken = userToken
    next();
  } catch (error) {
      console.log(error)
    let response: IApiResponse = {
      status: 500
    };

    return apiResponseService.responseHandler(response, req, res, next);
  }
}
export async function hasClinicStarted(req: Request, res: Response, next: NextFunction) {
  try {
    const clinic:IClinicModel = req.clinic
    if (!clinic.hasClinicStarted) {
      let response: IApiResponse = {
        status: 400,
        errorMsg: "Clinic not opened"
      };


      return apiResponseService.responseHandler(response, req, res, next);
    }


    next();
  } catch (error) {
      console.log(error)
    let response: IApiResponse = {
      status: 500
    };

    return apiResponseService.responseHandler(response, req, res, next);
  }
}


// export async function checkIfTokenRequestedByUser(req: Request, res: Response, next: NextFunction) {
//     try {
//       const userId = req.user.id;
//       const tokenId = req.body.tokenId
//       const userToken = await clinicQueueDao.getTokenByIdForUser(tokenId,userId);
  
//       if (!userToken) {
//         let response: IApiResponse = {
//           status: 400,
//           errorMsg: "token not found"
//         };
  
//         console.log(userToken);
  
//         return apiResponseService.responseHandler(response, req, res, next);
//       }
  
  
//       req.clinictoken = userToken
//       next();
//     } catch (error) {
//         console.log(error)
//       let response: IApiResponse = {
//         status: 500
//       };
  
//       return apiResponseService.responseHandler(response, req, res, next);
//     }
//   }
