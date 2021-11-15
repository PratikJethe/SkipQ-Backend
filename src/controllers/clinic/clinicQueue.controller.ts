import { Request, Response, NextFunction } from "express";
import moment from "moment";
import mongoose, { Mongoose, startSession } from "mongoose";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import clinicDao from "../../dao/clinic/clinic.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { IUserModel } from "../../interfaces/user/user.interface";
import { clinicService } from "../../services/clinic/clinic.service";
import { clinicQueueService } from "../../services/clinic/clinicQueue.service";

class ClinicQueueController {
  async startClinic(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinic.isSubscribed) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "you don't have an active subscription.please activate to use service"
        };
        return next(response);
      }

      const clinic: IClinicModel | null = await clinicDao.updateClinicStart(req.client.id, true);

      if (!clinic) {
        let response: IApiResponse = {
          status: 500
        };

        return next(response);
      }

      let response: IApiResponse = {
        status: 200,
        data: clinic
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

  async stopClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens: IClinicQueueModel[] = await clinicQueueService.getTokenForRequiredStatusByClinicId(req.client.id, [TokenStatusEnum.PENDING_TOKEN, TokenStatusEnum.REQUESTED]);

      if (tokens.length != 0) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "you have pending tokens or requests. cant close clinic before finishing them"
        };
        return next(response);
      }

      const clinic: IClinicModel | null = await clinicDao.updateClinicStart(req.client.id, false);

      if (!clinic) {
        let response: IApiResponse = {
          status: 500
        };

        return next(response);
      }

      let response: IApiResponse = {
        status: 200,
        data: clinic
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

  // Token Action By User
  async requestToken(req: Request, res: Response, next: NextFunction) {

    console.log('here');
    try {
      if (!req.clinic.hasClinicStarted) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "clinic not started yet"
        };
        return next(response);
      }

      if (!req.clinic.isSubscribed) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "clinic is out of service"
        };
        return next(response);
      }

      const token: IClinicQueue = {
        userId: req.user.id,
        clinicId: req.clinic.id,
        tokenStatus: TokenStatusEnum.REQUESTED,
        userType: UserTypeEnum.ONLINE
      };

      const createdToken = await clinicQueueService.requestToken(token);

     await  createdToken.populate('userId').populate('clinicId').execPopulate()

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

      if (clinicToken.tokenStatus != TokenStatusEnum.REQUESTED) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }
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

      if (clinicToken.tokenStatus != TokenStatusEnum.REQUESTED) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }

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

      if (clinicToken.tokenStatus != TokenStatusEnum.REQUESTED) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }

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

      if (clinicToken.tokenStatus != TokenStatusEnum.PENDING_TOKEN) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }

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
      if (clinicToken.tokenStatus != TokenStatusEnum.PENDING_TOKEN) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }

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

      if (clinicToken.tokenStatus != TokenStatusEnum.PENDING_TOKEN) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid token state"
        };

        return next(response);
      }

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
      if (!req.clinic.hasClinicStarted) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "clinic not started yet"
        };
        return next(response);
      }

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

  async getUserTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = req.user;
      const tokens: IClinicQueueModel[] = await clinicQueueService.getTokenForRequiredStatusByUserId(user.id, [TokenStatusEnum.REQUESTED, TokenStatusEnum.PENDING_TOKEN]);

      let response: IApiResponse = {
        status: 200,
        data: tokens
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
  async getPendingTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic: IClinicModel = req.clinic;
      const pendindTokens: IClinicQueueModel[] = await clinicQueueService.getPendingTokens(clinic.id);

      let response: IApiResponse = {
        status: 200,
        data: pendindTokens
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
  async getRequests(req: Request, res: Response, next: NextFunction) {}
  async getRejectedTokens(req: Request, res: Response, next: NextFunction) {}
  async getCompletedTokens(req: Request, res: Response, next: NextFunction) {}
}

export const clinicQueueController = new ClinicQueueController();
