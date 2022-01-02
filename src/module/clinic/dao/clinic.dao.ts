import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IFcmClinicTokenModel } from "../interface/clinic.interface";
import { ClinicModel } from "../model/clinic.model";
import { FcmClinicModel } from "../model/clinicFcmTokenModel";

class ClinicDao {
  async register(clinicCredentials: IClinic): Promise<IClinicModel> {
    console.log("creds", clinicCredentials);
    const clinic: IClinicModel = await new ClinicModel(clinicCredentials).save();
    return clinic;
  }

  async findByNumber(phoneNo: number): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findOne({ "contact.phoneNo": phoneNo });

    return clinic;
  }
  async findByEmail(email: string): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findOne({ email: email });

    return clinic;
  }
  async findById(id: any): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findById(id);

    return clinic;
  }

  async updateClinicStart(id: string, hasStarted: boolean): Promise<IClinicModel | null> {
    const clinic: IClinicModel | null = await ClinicModel.findOneAndUpdate({ _id: id }, { $set: { hasClinicStarted: hasStarted } }, { new: true });

    return clinic;
  }

  async saveFcm(fcm: string, id: any): Promise<IFcmClinicTokenModel | null> {
    const savedFcm: IFcmClinicTokenModel | null = await new FcmClinicModel({ clinicId: id, fcm: fcm }).save();
    return savedFcm;
  }

  async getFcmTokens(id: any): Promise<IFcmClinicTokenModel[]> {
    const fcmTokenList: IFcmClinicTokenModel[] = await FcmClinicModel.find({
      clinicId: id
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return fcmTokenList;
  }

  async searchDoctor() {
    const clinic = ClinicModel.aggregate([]);
  }
}

export default new ClinicDao();
