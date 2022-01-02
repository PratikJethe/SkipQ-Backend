import { Mongoose } from "mongoose";
import { IClinic, IClinicModel, IClinicRegistrationDetails, IClinicUpdate } from "../interface/clinic.interface";
import { ClinicModel } from "../model/clinic.model";

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
  async searchClinicByLocation(coordinates: number[], pageNo: number) {
    const searchedClinic: IClinicModel[] = await ClinicModel.aggregate([
      {
        $geoNear: {
    
          near: { type: "Point", coordinates },
          distanceField: "dist.calculated",
          maxDistance: 500 * 1000, // km to meter
          distanceMultiplier: 1 / 1000, // meter to km
          includeLocs: "dist.location",
          spherical: true
        }
      },

      { $sort: { "dist.calculated": 1 } },
      { $skip: pageNo * 5 },
      { $limit: 5 }
    ]);

    return searchedClinic;
  }
}

export default new ClinicProfile();
