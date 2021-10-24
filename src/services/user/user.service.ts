import { ObjectId } from "mongoose";
import clinicDao from "../../dao/clinic/clinic.dao";
import userDao from "../../dao/user/user.dao";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { IUserModel } from "../../interfaces/user/user.interface";

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
}

export const userService = new UserService();
