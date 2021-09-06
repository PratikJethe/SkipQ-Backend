import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { REPLCommandAction } from "repl";
import { genderEnum } from "../../constants/enums";
import userDao from "../../dao/user/user.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IUser, IUserModel, IUserRegistrationDetails } from "../../interfaces/user/user.interface";
import { apiResponseService } from "../../services/apiResponse.service";
import { jwtService } from "../../services/jsonWebToken.service";

class UserController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, authProvider, fcm, address, apartment, coordinates, gender, phoneNo, email, profilePicUrl, dateOfBirth }: IUserRegistrationDetails = req.body;

      var userCredentials: IUser = {
        fullName,
        authProvider,
        fcm,
        address,
        apartment,
        gender,
        phoneNo,
        email,
        profilePicUrl,
        dateOfBirth,
        geometry: {
          type: "Point",
          coordinates: coordinates
        }
      };

      if (!coordinates) {
        delete userCredentials.geometry;
      }
      const user: IUserModel = await userDao.register(userCredentials);

      let response: IApiResponse = {
        status: 200,
        data: user
      };

      console.log(user._id);
      const token = jwtService.createJwt({ id: user._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000,
        httpOnly: true,
      });
      // return res.json(user);

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };
      return next(response);
    }
  }

  async phoneLogin(req: Request, res: Response, next: NextFunction) {
    const { phoneNo } = req.body; //verify firebase id
    try {
      const user: IUserModel | null = await userDao.findByNumber(phoneNo);

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

      const token = jwtService.createJwt({ id: user._id }, 2629746);

      res.cookie("token", token, {
        maxAge: 2592000000,
        httpOnly: true,
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
