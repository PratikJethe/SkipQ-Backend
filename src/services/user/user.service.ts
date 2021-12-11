import { ObjectId } from "mongoose";
import { UserTypeEnum } from "../../constants/enums/clinic.enum";
import clinicDao from "../../dao/clinic/clinic.dao";
import userDao from "../../dao/user/user.dao";
import { IClinicModel, IFcmClinicTokenModel } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueue } from "../../interfaces/clinic/clinicQueue.interface";
import { IFcmUserTokenModel, IUserModel } from "../../interfaces/user/user.interface";
import { clinicService } from "../clinic/clinic.service";
import { clinicQueueService } from "../clinic/clinicQueue.service";
import { fcmService } from "../firebase/fcm.service";

class UserService {
  async getUserById(id: string | ObjectId | any): Promise<IUserModel | null> {
    const user: IUserModel | null = await userDao.findById(id);
    return user;
  }

  async checkIfEmailorPhoneExist(phoneNo: number, email?: string): Promise<boolean> {
    if (email) {
      const userByEmail: IUserModel | null = await userDao.findByEmail(email.toLowerCase());
      if (userByEmail) {
        return true;
      }
    }

    const userByPhone: IUserModel | null = await userDao.findByNumber(phoneNo);
    if (userByPhone) {
      return true;
    }

    return false;
  }

  async sendNotificationToSingleUser(userId: any, data: {}) {
    const tokens = await userDao.getFcmTokens(userId);
    await fcmService.sendNotifications(
      tokens.map((token) => token.fcm),
      data
    );
  }

  async sendTokenUpdateNotification(clinicId: any) {
    const pendingTokens = await clinicQueueService.getPendingTokens(clinicId);

    let length: number = pendingTokens.length;
    if (length > 10) {
      length = 10 + 1;
    }

    for (let i = 0; i < length; i++) {
      let token = pendingTokens[i];

      if (token.userType == UserTypeEnum.ONLINE) {
        await this.sendNotificationToSingleUser(token.userId.id, { title: i == 0 ? `its your turn..get ready` : `you are ${i} number away` });
      }
    }
  }
}

export const userService = new UserService();
