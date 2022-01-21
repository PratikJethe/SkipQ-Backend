import { body } from "express-validator";
import * as admin from "firebase-admin";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

class FcmService {
  async sendNotifications(fcmId: string[], data: any) {
    const message: MulticastMessage = {
      tokens: fcmId,
      data: data,
      // notification: {
      //   title: data["title"],
      //   // body: data["body"]
      // }
    };

    console.log(message);
    await admin.messaging().sendMulticast(message);
  }
}

export const fcmService = new FcmService();
