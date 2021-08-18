import { NextFunction, Request, Response } from "express";
import { request } from "http";
import { REPLCommandAction } from "repl";
import { genderEnum } from "../../constants/enums";
import userDao from "../../dao/user/user.dao";
import { IapiResponse } from "../../interfaces/apiResponse.interface";
import { IUser, IUserRegistrationDetails } from "../../interfaces/user/user.interface";

class UserController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        fullName,
        authProvider,
        fcm,
        address,
        apartment,
        coordinates,
        gender,
        phoneNo,
        email,
      }: IUserRegistrationDetails = req.body;

    var userCredentials: IUser = {
        fullName,
        authProvider,
        fcm,
        address,
        apartment,
        gender,
        phoneNo,
        email,
        geometry:{
          type:"Point",
          coordinates:coordinates
        }
      };

      if(!coordinates){
        delete userCredentials.geometry
      }
      console.log('type',userCredentials)

      const user: IUser = await userDao.register(userCredentials);
      return res.status(200).json({ item: user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ item: error });
    }
  }

  async phoneLogin(req: Request, res: Response, next: NextFunction) {
    const {phoneNo} = req.body;
    console.log('type',typeof phoneNo)
    try {
      const user: IUser | null = await userDao.findByNumber(phoneNo);

      if(!user){
        return res.status(404).json({
          error:"invalid phone no."
        })
      }
    const response:IapiResponse = {
      resId:req.requestId,
      data:user
    }
    return res.status(200).json(response)

    } catch (error) {
      console.log(error);
      return res.status(500).json({ item: error });
    }
  }


}

export default new UserController();
