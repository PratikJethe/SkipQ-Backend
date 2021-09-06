import { Mongoose } from "mongoose";
import { IUser, IUserModel,  } from "../../interfaces/user/user.interface";
import { UserModel } from "../../models/user/user.model";
class UserDao {
  async register(userCredentials: IUser): Promise<IUserModel> {
    console.log("creds", userCredentials);
    const user: IUserModel = await new UserModel(userCredentials).save();
    return user;
  }

  async findByNumber(phoneNo: number): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findOne({ phoneNo: phoneNo });

    return user;
  }
  async findById(id: any): Promise<IUserModel | null> {
    const IUserModel: IUserModel | null = await UserModel.findById(id);
    return IUserModel;
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findOne({ email:email});
    return user;
  }

}

export default new UserDao();
