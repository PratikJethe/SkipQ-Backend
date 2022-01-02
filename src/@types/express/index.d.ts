import { IClinicModel } from "../../module/clinic/interface/clinic.interface";
import { IClinicQueueModel } from "../../module/clinic/interface/clinicQueue.interface";
import { IUserModel } from "../../module/user/interface/user.interface";

export{};
declare global {
    namespace Express {
      interface Request {
        requestId:string 
        client:{
          id:string
        }
        clinic:IClinicModel
        user:IUserModel
        clinictoken:IClinicQueueModel

      }
    }
  }