import { NextFunction, Request, Response } from "express";
import { Interface } from "readline";
import { Axios as axios } from "axios";
import { paytmService } from "../../services/transaction/paytm.service";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
import { paytm_callback_url } from "../../constants/clinic/clinic.constants";
const paytmchecksum = require("paytmchecksum");
class ClinicTransactionController {
  async createChecksum(req: Request, res: Response, next: NextFunction) {
    try {
      var months = req.body.months;

      const costPerMonth = 299; //TODO add in config / mid in configs

      if (![1, 3, 6, 12].includes(req.body.months)) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "invalid value of months"
        };
        return next(response);
      }

      var orderId: string = `ORDER_ID_${Date.now()}`;

      var txnToken = await paytmService.generateTransactionToken(req.client.id, costPerMonth, orderId, months);

      let response: IApiResponse = {
        status: 200,
        data: {
          mid: "OdCdmt83472104874643", //TODO put this urls into config
          callbackUrl: paytm_callback_url,// no matter what u pass in frontend paytm will take callbackurl passed while creating txnToken. this is only for frontend sdk
          orderId: orderId,
          txnToken: txnToken,
          ammount: costPerMonth * months
        }
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
  async paymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      return res.send("<h1>Success</h1>");
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
}
export const clinicTransactionController = new ClinicTransactionController();
