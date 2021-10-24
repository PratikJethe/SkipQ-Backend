import { Mongoose, Schema, model, Model } from "mongoose";
import { authProviderEnum } from "../../constants/enums/authProvider.enum";
import { IClinic, IClinicModel } from "../../interfaces/clinic/clinic.interface";
import { doctorSpecialty } from "../../constants/clinic";
const clinicAddressSchema = new Schema({
  address: { type: String, required: true },
  apartment: { type: String },
  geometry: {
    type: { type: String },
    coordinates: { type: [Number], requied: true }
  },
  pincode: {
    type: Number,
    required: false
  },
  city: {
    type: String,
    required: true
  }
});
const clinicContactSchema = new Schema({
  phoneNo: { type: Number, required: true, unique: true },
  dialCode: { type: Number, required: true }
});

const ClinicSchema: Schema<IClinicModel> = new Schema<IClinicModel>(
  {
    doctorName: {
      type: String,
      required: true
    },
    clinicName: {
      type: String,
      required: true
    },
    contact: clinicContactSchema,
    address: clinicAddressSchema,
    email: { type: String, unique: false, required: false },

    fcm: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    profilePicUrl: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    speciality: [{ type: String, enum: doctorSpecialty, required: true }],
    isSubscribed: {
      type: Boolean,
      required: true
    },
    subStartDate: {
      type: Date,
      required: true
    },
    subEndDate: {
      type: Date,
      required: true
    },
    hasClinicStarted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

ClinicSchema.index({ doctorName: "text", clinicName: "text", apartment: "text", address: "text", speciality: "text", pincode: "text" });
ClinicSchema.index({ geometry: "2dsphere" });
export const ClinicModel: Model<IClinicModel> = model<IClinicModel>("clinic", ClinicSchema);
