import { Request, Response, NextFunction } from "express";
import { pickBy } from "lodash";
import moment from "moment";
import mongoose, { Mongoose, startSession } from "mongoose";
import { TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { fcmService } from "../../../services/firebase/fcm.service";
import { IUserModel } from "../../user/interface/user.interface";
import { userService } from "../../user/service/user.service";
import { isActiveSubscriptionRequired } from "../constants/clinic.constants";
import clinicDao from "../dao/clinic.dao";
import clinicSubscriptionDao from "../dao/clinicSubscription.dao";
import { IClinicModel, IClinicNotification } from "../interface/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { IClinicSubscriptionModel } from "../interface/clinicSubscription.inteface";
import { clinicNotificationService } from "../service/clinicNotification.service";
import { clinicQueueService } from "../service/clinicQueue.service";

class ClinicQueueController {
  async startClinic(req: Request, res: Response, next: NextFunction) {
    try {

      var clinicSubscriptionList:IClinicSubscriptionModel[] =await clinicSubscriptionDao.getLastClinicPlan(req.clinic.id)

      if(clinicSubscriptionList.length==0){
        let response: IApiResponse = {
          status: 400,
          errorMsg: "subscription record not found"
        };
        return next(response);
      }

      if (!moment(clinicSubscriptionList[0].subEndDate).isAfter(moment()) && isActiveSubscriptionRequired) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "you don't have an active subscription.please activate to use service"
        };
        return next(response);
      }

      const clinic: IClinicModel | null = await clinicDao.updateClinicStart(req.client.id, true);

      if (!clinic) {
        throw "clinic failed to start";
      }

      // const notification: IClinicNotification = {
      //   title: "Clinic Started",
      //   isSeen: false,
      //   clinicId: clinic.id
      // };
      // await clinicNotificationService.createNotification(notification);

      let response: IApiResponse = {
        status: 200,
        data: clinic
      };

      // setTimeout(() => { //TODO : remove this
      //   return next(response);
      //   }, 4000);

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
        throw "failed to stop clinic";
      }
      // const notification: IClinicNotification = {
      //   title: "Clinic Started",
      //   isSeen: false,
      //   clinicId: clinic.id
      // };

      // await clinicNotificationService.createNotification(notification);

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
    console.log("here");
    try {
      if (!req.clinic.hasClinicStarted) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "clinic not started yet"
        };
        return next(response);
      }

      var clinicSubscriptionList:IClinicSubscriptionModel[] =await clinicSubscriptionDao.getLastClinicPlan(req.clinic.id)

      if(clinicSubscriptionList.length==0){
        let response: IApiResponse = {
          status: 400,
          errorMsg: "subscription record not found"
        };
        return next(response);
      }



      if (!moment(clinicSubscriptionList[0].subEndDate).isAfter(moment()) && isActiveSubscriptionRequired) {
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

      await createdToken.populate("userId").populate("clinicId").execPopulate();

      let response: IApiResponse = {
        status: 200,
        data: createdToken
      };

      const tokens = await clinicDao.getFcmTokens(req.clinic.id);

      await fcmService.sendNotifications(
        tokens.map((token) => token.fcm),
        {
          title: `${req.user.fullName} has requested for token`
        }
      );

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

      let tokenNumber: number = 1;
      const pendindTokens: IClinicQueueModel[] = await clinicQueueService.getPendingTokens(req.clinic.id);

      if (pendindTokens.length != 0) {
        tokenNumber = (pendindTokens[pendindTokens.length - 1].tokenNumber as any) + 1;
      }

      console.log("prev", clinicToken);
      const updateToken: IClinicQueueModel | null = await clinicQueueService.acceptRequest(clinicToken.id, tokenNumber);
      console.log("after", updateToken);

      if (!updateToken) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };

      await userService.sendNotificationToSingleUser(updateToken.userId.id, { title: `Dr. ${req.clinic.doctorName} has accepted your token request` });

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
        
      }

      let response: IApiResponse = {
        status: 200,
        data: updateToken
      };
      await userService.sendNotificationToSingleUser(updateToken.userId.id, { title: `Dr.${req.clinic.doctorName} has rejected your token request` });

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

      if (updateToken.userType == UserTypeEnum.ONLINE) {
        await userService.sendNotificationToSingleUser(updateToken.userId.id, { title: `Hope you had good experience. get well soon!` });
      }
      await userService.sendTokenUpdateNotification(req.clinic.id);

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
      if (updateToken.userType == UserTypeEnum.ONLINE) {
        await userService.sendNotificationToSingleUser(updateToken.userId.id, { title: `Dr. ${req.clinic.doctorName} has rejected your token` });
      }
      await userService.sendTokenUpdateNotification(req.clinic.id);

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

      await userService.sendTokenUpdateNotification(updateToken.clinicId.id);

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

      var clinicSubscriptionList:IClinicSubscriptionModel[] =await clinicSubscriptionDao.getLastClinicPlan(req.clinic.id)

      if(clinicSubscriptionList.length==0){
        let response: IApiResponse = {
          status: 400,
          errorMsg: "subscription record not found"
        };
        return next(response);
      }



      if (!moment(clinicSubscriptionList[0].subEndDate).isAfter(moment()) && isActiveSubscriptionRequired) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "you don't have an active subscription.please activate to use service"
        };
        return next(response);
      }
      let tokenNumber: number = 1;
      const pendindTokens: IClinicQueueModel[] = await clinicQueueService.getPendingTokens(req.clinic.id);

      if (pendindTokens.length != 0) {
        tokenNumber = (pendindTokens[pendindTokens.length - 1].tokenNumber as any) + 1;
      }
      const token: IClinicQueue = {
        userId: mongoose.Types.ObjectId(),
        clinicId: req.clinic.id,
        tokenStatus: TokenStatusEnum.PENDING_TOKEN,
        userType: UserTypeEnum.OFFLINE,
        userName: req.body.userName,
        tokenNumber: tokenNumber
      };

      const createdToken: IClinicQueueModel | null = await clinicQueueService.requestToken(token);

      await createdToken.populate("userId").populate("clinicId").execPopulate();

      if (!createdToken) {
        throw new Error("unknown error");
        return;
      }

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

  async getUserTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = req.user;
      const tokens: IClinicQueueModel[] = await clinicQueueService.getTokenForRequiredStatusByUserId(user.id, [TokenStatusEnum.REQUESTED, TokenStatusEnum.PENDING_TOKEN]);

      let response: IApiResponse = {
        status: 200,
        data: tokens
      };
// throw 'ddd'
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
  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic: IClinicModel = req.clinic;
      const pendindTokens: IClinicQueueModel[] = await clinicQueueService.getRequests(clinic.id);

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
  async getRejectedTokens(req: Request, res: Response, next: NextFunction) {}
  async getCompletedTokens(req: Request, res: Response, next: NextFunction) {}
}

export const clinicQueueController = new ClinicQueueController();
