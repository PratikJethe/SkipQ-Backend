import { NextFunction, Request, Response } from "express";
import { Interface } from "readline";
import { Axios as axios } from "axios";
import { IApiResponse } from "../../../interfaces/apiResponse.interface";
import { paytmService } from "../../../services/transaction/paytm.service";
import { paytm_callback_url } from "../constants/clinic.constants";
import { isValidObjectId } from "mongoose";
import clinicSubscriptionDao from "../dao/clinicSubscription.dao";
import moment from "moment";
import * as crypto from "crypto";
import { json } from "stream/consumers";
import { stringify } from "querystring";
import clinicDao from "../dao/clinic.dao";
import { IClinicSubscription } from "../interface/clinicSubscription.inteface";
import { subscriptionType } from "../../../constants/enums/clinic.enum";
import { clinicSubscriptionService } from "../service/clinicSubscription.service";
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
          callbackUrl: paytm_callback_url, // no matter what u pass in frontend paytm will take callbackurl passed while creating txnToken. this is only for frontend sdk
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
  async paymentCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.query.planId);

      const planId = req.query.planId;
      const clinic = req.clinic;

      if (!planId || !isValidObjectId(planId)) {
        let response: IApiResponse = {
          status: 400,
          errorMsg: "invalid value of plan"
        };
        return next(response);
      }

      const plan = await clinicSubscriptionDao.getPlanByID(planId);

      const amount = process.env.STAGE == "DEV" ? 1 : plan?.amount;
      const email = clinic.email;
      const name = clinic.doctorName;
      const phone = clinic.contact.phoneNo;

      if (!plan) {
        let response: IApiResponse = {
          status: 404,
          errorMsg: "plan not found"
        };
        return next(response);
      }
      let txnId = `TxnId${moment().unix()}`;

      // const hashString = `${payU_merchant_key}|${txnId}|${plan.amount}|productinfo|firstname|email|||||||||||${payU_Salt}`;
      function sha512(str: string) {
        return crypto.createHash("sha512").update(str).digest("hex");
      }

      // var udf1 = JSON.stringify({
      //   uid: clinic.id,
      //   planId: plan.id
      // });

      let hash = sha512(`${process.env.PAYU_MERCHANT_KEY}|${txnId}|${amount}|clinic subscription|${name}|${email}|${clinic.id}|${plan.id}|||||||||${process.env.PAYU_MERCHANT_SALT}`);

      return res.send(`
      <body>
<form action='${process.env.PAYU_URI}' method='post'  name="checkout_form">
<input type="hidden" name="key" value="${process.env.PAYU_MERCHANT_KEY}" /> 
<input type="hidden" name="txnid" value="${txnId}" />
<input type="hidden" name="productinfo" value="clinic subscription" />
<input type="hidden" name="amount" value="${amount}" />
<input type="hidden" name="email" value="${email}" />
<input type="hidden" name="firstname" value="${name}" />
<input type="hidden" name="surl" value="https://8af4-183-87-154-180.ngrok.io/api/v1/clinic/transaction/success" />
<input type="hidden" name="furl" value="https://8af4-183-87-154-180.ngrok.io/api/v1/clinic/transaction/failed" />
<input type="hidden" name="udf1" value="${clinic.id}" />
<input type="hidden" name="udf2" value="${plan.id}" />
<input type="hidden" name="phone" value="${phone}" />
<input type="hidden" name="hash" value="${hash}" />
<script type="text/javascript">document.checkout_form.submit()</script>
</body>
</html>
      `);
    } catch (error) {
      console.log(error);
      let response: IApiResponse = {
        status: 500
      };

      return next(response);
    }
  }
  async paymentWebhook(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
  }
  async success(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);

    var { udf1, udf2 } = req.body;

    var clinic = await clinicDao.findById(udf1);
    var plan = await clinicSubscriptionDao.getPlanByID(udf2);
    if (!plan || !clinic) {
      return res.status(200).send("<h1>Error</h1>");
    }

    const { subStartDate, subEndDate } = clinicSubscriptionService.generateStartEndDate(plan.duration);

    var subscriptionPlan: IClinicSubscription = {
      clinic: udf1,
      plan: udf2,
      subscriptionType: subscriptionType.PAID,
      subEndDate: subEndDate,
      subStartDate: subStartDate
    };

    var createdSubscription = await clinicSubscriptionDao.createSubscription(subscriptionPlan);

    return res.status(200).send("<h1>Success</h1>");
  }
  async failure(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);

    return res.status(200).send("<h1>Failed</h1>");
  }
}

export const clinicTransactionController = new ClinicTransactionController();
