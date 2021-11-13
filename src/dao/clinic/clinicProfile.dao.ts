import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IClinicUpdate } from "../../interfaces/clinic/clinic.interface";
import { ClinicModel } from "../../models/clinic/clinic.model";

class ClinicProfile {
  async updatedClinic(clinicDetails: IClinicUpdate, clinicId: any): Promise<IClinicModel | null> {
    const clinicUpdated: IClinicModel | null = await ClinicModel.findByIdAndUpdate(clinicId, clinicDetails, { new: true });

    console.log();

    return clinicUpdated;
  }

  async searchClinicByKeyword(keyword: string) {
    const searchedClinic: IClinicModel[] = await ClinicModel.find({ $text: { $search: keyword } });
    return searchedClinic;
  }
}

export default new ClinicProfile();
