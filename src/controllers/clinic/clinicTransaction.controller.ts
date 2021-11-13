import { NextFunction, Request, Response } from "express";
import { Interface } from "readline";
import { Axios as axios } from "axios";
import { paytmService } from "../../services/transaction/paytm.service";
import { IApiResponse } from "../../interfaces/apiResponse.interface";
const paytmchecksum = require("paytmchecksum");
class ClinicTransactionController {
  async createChecksum(req: Request, res: Response, next: NextFunction) {
    try {
      var orderId: string = `ORDER_ID_${Date.now()}`;

      var txnToken = await paytmService.generateTransactionToken(req.client.id, 10, orderId);

      let response: IApiResponse = {
        status: 200,
        data: {
          orderId: orderId,
          txnToken: txnToken
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
