import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IClinicUpdate } from "../../interfaces/clinic/clinic.interface";
import { ClinicModel } from "../../models/clinic/clinic.model";

class ClinicProfile {
  async updatedClinic(clinicDetails: IClinicUpdate, clinicId: any): Promise<IClinicModel | null> {
    const clinicUpdated: IClinicModel | null = await ClinicModel.findByIdAndUpdate(clinicId, clinicDetails, { new: true });

    console.log();

    return clinicUpdated;
  }

  async searchClinicByKeyword(keyword: string, pageNo: number) {
    const searchedClinic: IClinicModel[] = await ClinicModel.find({ $text: { $search: keyword } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .skip(5 * pageNo)
      .limit(5);
    return searchedClinic;
  }
}

export default new ClinicProfile();
