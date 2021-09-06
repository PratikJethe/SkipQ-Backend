import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails } from "../../interfaces/clinic/clinic.interface";
import { ClinicModel } from "../../models/clinic/clinic.model";

class ClinicDao {
  async register(clinicCredentials: IClinic): Promise<IClinicModel> {
    console.log("creds", clinicCredentials);
    const clinic: IClinicModel = await new ClinicModel(clinicCredentials).save();
    return clinic;
  }

  async findByNumber(phoneNo: number): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findOne({ phoneNo: phoneNo });

    return clinic;
  }
  async findByEmail(email: string): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findOne({ email: email});

    return clinic;
  }
  async findById(id: any): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findById(id);

    return clinic;
  }
}

export default new ClinicDao();
