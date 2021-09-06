import { IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { IUserModel } from "../../interfaces/user/user.interface";

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