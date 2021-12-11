import { Mongoose } from "mongoose";
import { IFcmUserTokenModel, IUser, IUserModel } from "../../interfaces/user/user.interface";
import { UserModel } from "../../models/user/user.model";
import { FcmUserModel } from "../../models/user/userFcmToken.model";
class UserDao {
  async register(userCredentials: IUser): Promise<IUserModel> {
    console.log("creds", userCredentials);
    const user: IUserModel = await new UserModel(userCredentials).save();
    return user;
  }

  async findByNumber(phoneNo: number): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findOne({ "contact.phoneNo": phoneNo });

    return user;
  }
  async findById(id: any): Promise<IUserModel | null> {
    const IUserModel: IUserModel | null = await UserModel.findById(id);
    return IUserModel;
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findOne({ email: email });
    return user;
  }
  async saveFcm(fcm: string, id: any): Promise<IFcmUserTokenModel | null> {
    const savedFcm: IFcmUserTokenModel | null = await new FcmUserModel({ userId: id, fcm: fcm }).save();
    return savedFcm;
  }
  async getFcmTokens(id: any): Promise<IFcmUserTokenModel[]> {
    const fcmTokenList: IFcmUserTokenModel[] = await FcmUserModel.find({
      userId: id
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return fcmTokenList;
  }
}

export default new UserDao();
