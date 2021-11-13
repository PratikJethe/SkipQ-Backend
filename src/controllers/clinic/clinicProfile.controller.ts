import { NextFunction, Request, Response } from "express";
import { pick, pickBy } from "lodash";
import { isValidObjectId } from "mongoose";
import { type } from "os";
import clinicDao from "../../dao/clinic/clinic.dao";

import clinicProfileDao from "../../dao/clinic/clinicProfile.dao";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { IClinicModel, IClinicUpdate } from "../../interfaces/clinic/clinic.interface";
import { ClinicModel } from "../../models/clinic/clinic.model";

class ClinicProfileController {
  async getClinicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      console.log(id);
      if (id == undefined || typeof id != "string" || !isValidObjectId(id)) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid id"
        };

        return next(response);
      }

      const searchedClinic: IClinicModel | null = await clinicDao.findById(id);

      if (!searchedClinic) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "Clinic not found"
        };

        return next(response);
      }

      let response: IApiResponse = {
        status: 200,
        data: searchedClinic
      };

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
  async searchClinicByKeyword(req: Request, res: Response, next: NextFunction) {
    console.log('here')
    try {
      const keyword = req.query.keyword;

      if (keyword == undefined || typeof keyword != "string") {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid search query"
        };

        return next(response);
      }

      const searchedClinic: IClinicModel[] = await clinicProfileDao.searchClinicByKeyword(keyword);

      let response: IApiResponse = {
        status: 200,
        data: searchedClinic
      };

      return next(response);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }

  async updateClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = req.clinic;
      const { address, clinicName, coordinates, doctorName, pincode, apartment, dateOfBirth, gender, profilePicUrl, speciality, city, about, publicNo } = req.body;
      const clinicUpadteData: IClinicUpdate = {
        address: {
          address,
          city,
          geometry: {
            type: "Point",
            coordinates: coordinates
          },
          pincode,
          apartment
        },
        publicNo: publicNo ? publicNo : undefined,
        about: about ? about : undefined,
        clinicName,
        doctorName,
        speciality,
        dateOfBirth,
        gender,
        profilePicUrl
      };
      console.log(clinicUpadteData);

      const updatedClinic: IClinicModel | null = await clinicProfileDao.updatedClinic(clinicUpadteData, clinic.id);

      console.log(updatedClinic);

      if (!updatedClinic) {
        throw new Error("unknown error");
        return;
      }

      let response: IApiResponse = {
        status: 200,
        data: updatedClinic
      };

      return next(response);
    } catch (e) {
      console.log(e);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
}

export default new ClinicProfileController();
