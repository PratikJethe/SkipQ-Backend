import { error } from "console";
import { Mongoose, startSession } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { REPLCommandAction } from "repl";
import { authProviderEnum, genderEnum } from "../../constants/enums";
import userDao from "../../dao/user/user.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IFcmUserTokenModel, IUser, IUserModel, IUserRegistrationDetails } from "../../interfaces/user/user.interface";
import { apiResponseService } from "../../services/apiResponse.service";
import { jwtService } from "../../services/jsonWebToken.service";
import { UserModel } from "../../models/user/user.model";

class UserController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const session = await startSession();
    await session.startTransaction();
    try {
      const { fullName, fcm, address, apartment, coordinates, gender, phoneNo, email, profilePicUrl, dateOfBirth, pincode, dialCode, city }: IUserRegistrationDetails = req.body;

      var userCredentials: IUser = {
        fullName,
        authProvider: authProviderEnum.PHONE,
        fcm,
        address: {
          address: address,
          pincode: pincode,
          geometry: coordinates
            ? {
                type: "Point",
                coordinates: coordinates
              }
            : undefined,
          apartment: apartment,
          city: city
        },
        contact: {
          phoneNo: phoneNo,
          dialCode: 91 // hardcoded for india if removed add an validator also
        },
        gender,
        email :email?.toLowerCase(),
        profilePicUrl,
        dateOfBirth
      };

      // if (!coordinates) {
      //   console.log('before',userCredentials)
      //   delete userCredentials.address?.geometry;
      //   console.log('after',userCredentials)
      // }
      const user: IUserModel = await userDao.register(userCredentials);

      const saveFcm: IFcmUserTokenModel | null = await userDao.saveFcm(fcm, user.id);

      await session.commitTransaction();
      await session.endSession();

      console.log(saveFcm);
      let response: IApiResponse = {
        status: 200,
        data: user
      };

      console.log(user._id);
      const token = jwtService.createJwt({ id: user._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000,
        httpOnly: true
      });
      // return res.json(user);

      return next(response);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async phoneLogin(req: Request, res: Response, next: NextFunction) {
    const { phoneNo, fcm } = req.body; //verify firebase id
    console.log(req.cookies);
    console.log(phoneNo);
    try {
      var user: IUserModel | null = await userDao.findByNumber(phoneNo);

      if (!user) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "user not found"
        };

        return next(response);
      }

      

      const response: IApiResponse = {
        data: user,
        status: 200
      };
      const saveFcm: IFcmUserTokenModel | null = await userDao.saveFcm(fcm, user.id);

      const token = jwtService.createJwt({ id: user._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000, //30 days in miliseconds
        // maxAge: 60000, //  60 sec for test
        httpOnly: true
      });

      return next(response);
    } catch (error) {
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel | null = await userDao.findById(req.client.id);

      if (!user) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "user not found"
        };

        return next(response);
      }
      console.log(user);

      const response: IApiResponse = {
        data: user,
        status: 200
      };

      const token = jwtService.createJwt({ id: user._id }, 2629746);

      res.cookie("token", token, {
        // maxAge: 2592000000, //30 days in miliseconds
        maxAge: 600, //  60 sec for test
        httpOnly: true
      });

      return next(response);
    } catch (error) {
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }
}

export default new UserController();
