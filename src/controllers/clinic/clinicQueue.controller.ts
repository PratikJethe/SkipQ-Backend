import { Request, Response, NextFunction } from "express";
import mongoose, { Mongoose } from "mongoose";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { clinicQueueService } from "../../services/clinic/clinicQueue.service";

class ClinicQueueController {
  // Token Action By User
  async requestToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token: IClinicQueue = {
        userId: req.user.id,
        clinicId: req.clinic.id,
        tokenStatus: TokenStatusEnum.REQUESTED,
        userType: UserTypeEnum.ONLINE
      };

      const createdToken = await clinicQueueService.requestToken(token);

      let response: IApiResponse = {
        status: 200,
        data: createdToken
      };

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }

  async cancelRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.cancelRequest(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.acceptRequest(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async rejectRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.rejectRequest(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async completeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.completeToken(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async rejectToken(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.rejectToken(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async cancelTokne(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicToken: IClinicQueueModel = req.clinictoken;

      const updateToken: IClinicQueueModel | null = await clinicQueueService.cancelToken(clinicToken.id);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
  async createOfflineToken(req: Request, res: Response, next: NextFunction) {
    const clinic: IClinicModel = req.clinic;
    try {
      const token: IClinicQueue = {
        userId: mongoose.Types.ObjectId(),
        clinicId: req.clinic.id,
        tokenStatus: TokenStatusEnum.REQUESTED,
        userType: UserTypeEnum.OFFLINE,
        userName: req.body.userName
      };

      const updateToken: IClinicQueueModel | null = await clinicQueueService.requestToken(token);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      return next(response);
    } catch (error) {
      console.log(error);

      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async getPendingTokens(req: Request, res: Response, next: NextFunction){
    
  }
  async getRequests(req: Request, res: Response, next: NextFunction){

  }
  async getRejectedTokens(req: Request, res: Response, next: NextFunction){

  }
  async getCompletedTokens(req: Request, res: Response, next: NextFunction){

  }
}

export const clinicQueueController = new ClinicQueueController();