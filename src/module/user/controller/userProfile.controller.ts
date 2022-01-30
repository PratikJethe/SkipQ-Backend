import { NextFunction, Request, Response } from "express";
import { pickBy } from "lodash";
import { join } from "path";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { userProfileDao } from "../dao/userProfile.dao";
import { IUserModel, IUserUpdate } from "../interface/user.interface";


class UserProfileController {
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = req.user;
      const { fullName, address, apartment, coordinates, gender, profilePicUrl, dateOfBirth, pincode, city } = req.body;
      const userUpdateData: IUserUpdate = {
        fullName: fullName,
        profilePicUrl: profilePicUrl,
        address: {
          address: address ? address : undefined,
          city: city ? city : undefined,
          geometry: coordinates
            ? {
                type: "Point",
                coordinates: coordinates
              }
            : undefined,
          pincode: pincode ? pincode : undefined,
          apartment: apartment ? apartment : undefined
        },
        dateOfBirth: dateOfBirth ? dateOfBirth : undefined,
        gender: gender ? gender : undefined
      };
      console.log(dateOfBirth);
      console.log("here");
      console.log(userUpdateData);

      const updatedUser: IUserModel | null = await userProfileDao.updateUserProfile(userUpdateData as IUserUpdate, user.id);

      console.log(updatedUser);

      if (!updatedUser) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updatedUser
      };

      return next(response);
    } catch (e) {
      console.log(e);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
  async userPrivarcyPolicy(req: Request, res: Response, next: NextFunction) {
    
      
      return res.sendFile(join(__dirname + "../../../../views/privarcy/privarcy.html"));

  }
   
}

export const userProfileController = new UserProfileController();
