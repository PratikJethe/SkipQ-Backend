import { NextFunction, Request, Response } from "express";
import { Interface } from "readline";
import { Axios as axios } from "axios";
import { paytmService } from "../../services/transaction/paytm.service";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
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
          callbackUrl: "https://webhook.site/6ff4ae54-b9bb-4ee4-9587-f965bb2c4f1e",
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
}
export const clinicTransactionController = new ClinicTransactionController();
