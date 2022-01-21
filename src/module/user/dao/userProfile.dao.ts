import { IUserModel, IUserUpdate } from "../interface/user.interface";
import { UserModel } from "../model/user.model";


class UserProfileDao {
  async updateUserProfile(details: IUserUpdate, id: any) {

    console.log(details);
    const updateUserModel: IUserModel | null = await UserModel.findByIdAndUpdate(id, details, { new: true });

    return updateUserModel;
  }
}

export const  userProfileDao = new UserProfileDao()
