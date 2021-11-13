import axios, { Axios } from "axios";
const https = require("https");
import { body, header } from "express-validator";
const paytmchecksum = require("paytmchecksum");

class PaytmService {
  async generateTransactionToken(id: string, value: number, orderId: string) {
    interface LooseObject {
      [key: string]: any;
    }

    var paytmParams: LooseObject = {};
    paytmParams.body = {
      requestType: "Payment",
      mid: "OdCdmt83472104874643",
      websiteName: "WEBSTAGING",
      orderId: orderId,
      callbackUrl: "https://webhook.site/64c2017e-201c-46b0-a886-51812a4622fe",
      txnAmount: {
        value: "1.00",
        currency: "INR"
      },
      userInfo: {
        custId: id
      },
      extendInfo: {
        udf1: JSON.stringify({
          uid: id,
          months: 6,
          name: "pratik"
        })
      }
    };
    const checksum: string = await paytmchecksum.generateSignature(JSON.stringify(paytmParams.body), "J@zBHlToGBLQlPbu");

    console.log(checksum);
    var url = `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=OdCdmt83472104874643&orderId=${orderId}`;

    paytmParams.head = {
      signature: checksum
    };

    // var postData = JSON.stringify(paytmParams);

    const result = await axios.post(url, paytmParams);

    if (result.data["body"]["resultInfo"]["resultCode"] != "0000") {
      throw new Error("Generating token");
    }

    var body = result.data["body"];

    return body["txnToken"];
  }
}
export const paytmService = new PaytmService();
