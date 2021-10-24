import { ObjectId } from "mongoose";
import clinicDao from "../../dao/clinic/clinic.dao";
import { IClinicModel } from "../../interfaces/clinic/clinic.interface";

class ClinicService {
  async getClinicById(id: string | ObjectId | any): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await clinicDao.findById(id);
    return clinic;
  }

  async checkIfEmailorPhoneExist(phoneNo: number, email?: string): Promise<boolean> {
    if (email) {
      const clinicByEmail: IClinicModel | null = await clinicDao.findByEmail(email.toLowerCase());
      if (clinicByEmail) {
        return true;
      }
    }

    const clinicByPhone: IClinicModel | null = await clinicDao.findByNumber(phoneNo);
    if (clinicByPhone) {
      return true;
    }

    return false;
  }
}

export const clinicService = new ClinicService();
