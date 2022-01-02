import clinicNotificationDao from "../dao/clinicNotification.dao";
import { IClinicNotification, IClinicNotificationModel } from "../interface/clinic.interface";

class ClinicNotificationService {
  //   sendNotification() {}

  async createNotification(notification: IClinicNotification) {
    try {
      return await clinicNotificationDao.createNotification(notification);
    } catch (error) {
      return null;
    }
  }
  async getNotification(clinicId:any,pageNo:number) {
      return await clinicNotificationDao.getNotification(clinicId,pageNo);

  }
}

export const clinicNotificationService = new ClinicNotificationService();
