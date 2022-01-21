import { ObjectId } from "mongoose";
import { UserTypeEnum } from "../../../constants/enums/clinic.enum";
import clinicDao from "../../clinic/dao/clinic.dao";
import userDao from "../dao/user.dao";
import { IClinicModel, IFcmClinicTokenModel } from "../../clinic/interface/clinic.interface";
import { IClinicQueue } from "../../clinic/interface/clinicQueue.interface";
import { IFcmUserTokenModel, IUserModel } from "../interface/user.interface";
import { clinicService } from "../../clinic/service/clinic.service";
import { clinicQueueService } from "../../clinic/service/clinicQueue.service";
import { fcmService } from "../../../services/firebase/fcm.service";

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
        await this.sendNotificationToSingleUser(token.userId.id, {
          title: i == 0 ? `Get Ready` : `Token Update`,
          body: i == 0 ? `It's your turn..please proceed in` : `you are ${i} token number away`
        });
      }
    }
  }
}

export const userService = new UserService();
