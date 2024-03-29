import { IClinicNotification, IClinicNotificationModel } from "../interface/clinic.interface";
import { ClinicNotificationModel } from "../model/clinicNotification";

class ClinicNotificatinDao {
  async createNotification(notification: IClinicNotification) {
    return await ClinicNotificationModel.create(notification);
  }
  async getNotification(clinicId:any,pageNo:number) {
    const fcmTokenList: IClinicNotificationModel[] = await ClinicNotificationModel.find({
        clinicId
      })
        .sort({ createdAt: -1 })
        .skip(pageNo*10)
        .limit(10).populate('clinicId')
        ;
  
      return fcmTokenList;
  }
}
export default new ClinicNotificatinDao();
