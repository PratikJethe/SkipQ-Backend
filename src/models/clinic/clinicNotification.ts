import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../constants/enums/clinic.enum";
import { IClinicNotificationModel } from "../../interfaces/clinic/clinic.interface";
const ClinicNotification: Schema<IClinicNotificationModel> = new Schema<IClinicNotificationModel>(
  {
    clinicId: { type: mongoose.Types.ObjectId, ref: "clinic", required: true },
    subtitle: { type: String, trim: true, required: false },
    title: { type: String, trim: true, required: true },
    isSeen: { type: Boolean, trim: true, required: true, default: false }
  },

  { timestamps: true }
);

export const ClinicNotificationModel: Model<IClinicNotificationModel> = model<IClinicNotificationModel>("clinicNotification", ClinicNotification);
