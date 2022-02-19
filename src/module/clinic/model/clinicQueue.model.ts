import mongoose, { Mongoose, Schema, model, Model } from "mongoose";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { TokenStatusEnum, UserTypeEnum } from "../../../constants/enums/clinic.enum";
const ClinicQueueSchema: Schema<IClinicQueueModel> = new Schema<IClinicQueueModel>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true,index:true },
    clinicId: { type: mongoose.Types.ObjectId, ref: "clinic", required: true,index:true },
    tokenStatus: { type: String, enum: TokenStatusEnum, required: true },
    userType: { type: String, enum: UserTypeEnum, required: true },
    userName :{type:String,required:false},
    tokenNumber:{type:Number,required:false}
  },

  { timestamps: true }
);

export const ClinicQueueModel: Model<IClinicQueueModel> = model<IClinicQueueModel>("clinicQueue", ClinicQueueSchema);
