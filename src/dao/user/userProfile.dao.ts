import { IUserModel, IUserUpdate } from "../../interfaces/user/user.interface";
import { UserModel } from "../../models/user/user.model";

class UserProfileDao {
  async updateUserProfile(details: IUserUpdate, id: any) {

    console.log(details);
    const updateUserModel: IUserModel | null = await UserModel.findByIdAndUpdate(id, details, { new: true });

    return updateUserModel;
  }
}

export const  userProfileDao = new UserProfileDao()
