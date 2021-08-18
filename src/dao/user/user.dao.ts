
import { Mongoose } from "mongoose";
import { IUser } from "../../interfaces/user/user.interface";
import { UserModel } from "../../models/user/user.model";
 class UserDao{

     async register(userCredentials:IUser):Promise<IUser>{

      console.log('creds',userCredentials)
       const user:IUser =  await new UserModel(userCredentials).save()
       return user
   }

   async findByNumber(phoneNo:number):Promise<IUser|null>{

    const user:IUser|null = await  UserModel.findOne({phoneNo:phoneNo})

    return user

   }
}

export default new UserDao()