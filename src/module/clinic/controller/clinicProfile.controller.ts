import { NextFunction, Request, Response } from "express";
import { parseInt, pick, pickBy } from "lodash";
import { isValidObjectId } from "mongoose";
import { type } from "os";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { isActiveSubscriptionRequired } from "../constants/clinic.constants";
import clinicDao from "../dao/clinic.dao";
import clinicProfileDao from "../dao/clinicProfile.dao";
import { IClinicModel, IClinicNotificationModel, IClinicUpdate } from "../interface/clinic.interface";
import { clinicNotificationService } from "../service/clinicNotification.service";


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
  async getClinicNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNo = parseInt(req.query.pageNo as string)
      const id = req.client.id
      console.log(req.query.pageNo)
      if ( pageNo !==0 && !pageNo) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid pageNo"
        };

        return next(response);
      }

      const notifications:IClinicNotificationModel[] = await clinicNotificationService.getNotification(id,pageNo)

 

      let response: IApiResponse = {
        status: 200,
        data: notifications
      };
            // setTimeout(() => { //TODO : remove this
            //   return next(response);
            //   }, 4000);

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
    console.log("here");
    try {
      const keyword = req.query.keyword;
      const pageNo = parseInt(req.query.pageNo as string);

      // console.log(pageNo);
      // console.log(typeof pageNo);

      // if (keyword == undefined || typeof keyword != "string" || pageNo || typeof pageNo != "number") {
      //   let response: IApiResponse = {
      //     status: 400,
      //     errorMsg: "Invalid search query"
      //   };

      //   return next(response);
      // }

      const searchedClinic: IClinicModel[] = await clinicProfileDao.searchClinicByKeyword(keyword as string, pageNo);

      let response: IApiResponse = {
        status: 200,
        data: searchedClinic
      };

      // setTimeout(() => {
      return next(response);
      // }, 4000);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
  async searchClinicByLocation(req: Request, res: Response, next: NextFunction) {
    console.log("here");
    try {
      const longitude = parseFloat(req.query.longitude as string);
      const lattitude = parseFloat(req.query.lattitude as string);
      const pageNo = parseInt(req.query.pageNo as string);
      console.log(typeof longitude);
      console.log(longitude);
      console.log(typeof lattitude);
      console.log(lattitude);

      if (!(longitude >= -180 && longitude <= 180 && lattitude >= -90 && lattitude <= 90)) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "Invalid search query"
        };

        return next(response);
      }

      const searchedClinic: IClinicModel[] = await clinicProfileDao.searchClinicByLocation([longitude, lattitude], pageNo);

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
      const { address, clinicName, coordinates, doctorName, pincode, apartment, dateOfBirth, gender, profilePicUrl, speciality, city, about, publicNo,notice } = req.body;
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
        profilePicUrl,
        notice:notice?notice:undefined
      
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
  async isSubscriptionRequired(req: Request, res: Response, next: NextFunction) {
    try {
      let response: IApiResponse = {
        status: 200,
        data: { isActiveSubscriptionRequired }
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
