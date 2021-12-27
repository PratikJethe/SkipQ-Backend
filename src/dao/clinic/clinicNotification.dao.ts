import { IClinicNotification, IClinicNotificationModel } from "../../interfaces/clinic/clinic.interface";
import { ClinicNotificationModel } from "../../models/clinic/clinicNotification";

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
