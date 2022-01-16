import { Mongoose, Schema, model, Model } from "mongoose";
import { authProviderEnum } from "../../../constants/enums/authProvider.enum";
import { IClinic, IClinicModel } from "../interface/clinic.interface";
import { genderEnum } from "../../../constants/enums";
import { trim } from "lodash";
import { doctorSpecialty } from "../constants";
const clinicAddressSchema = new Schema({
  address: { type: String, required: true, trim: true },
  apartment: { type: String, trim: true },
  geometry: {
    type: { type: String },
    coordinates: { type: [Number], requied: true }
  },
  pincode: {
    type: String,
    trim:true,
    required: false
  },

  city: {
    type: String,
    required: true,
    trim: true
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
      required: true,
      trim: true
    },
    clinicName: {
      type: String,
      required: true,
      trim: true
    },
    publicNo: {
      type: Number
    },
    contact: clinicContactSchema,
    address: clinicAddressSchema,
    email: { type: String, unique: false, required: false, trim: true },
    notice: { type: String, required: false, trim: true },
    about: { type: String, trim: true },
    fcm: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    authProvider: {
      type: String,
      required: true,
      enum: authProviderEnum
    },
    gender: {
      type: String,
      enum: genderEnum
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
  
    hasClinicStarted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

ClinicSchema.index({ doctorName: "text", clinicName: "text", "address.apartment": "text", "address.address": "text", speciality: "text", "address.pincode": "text", "address.city": "text" });
ClinicSchema.index({ "address.geometry": "2dsphere" });
export const ClinicModel: Model<IClinicModel> = model<IClinicModel>("clinic", ClinicSchema);
