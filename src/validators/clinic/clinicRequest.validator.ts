import { check, query } from "express-validator";
import { doctorSpecialty } from "../../constants/clinic";
import { authProviderEnum, genderEnum } from "../../constants/enums";

export const clinicRegisterValidation = [
  check("doctorName", "doctorName is required").exists({ checkFalsy: true }).isString().withMessage("Invalid doctor name"),
  check("clinicName", "clinicName is required").exists({ checkFalsy: true }).isString().withMessage("Invalid clinic name"),
  check("phoneNo", "phoneNo is required").exists({ checkFalsy: true }).isNumeric().withMessage("Invalid phone number").isLength({ min: 10, max: 10 }).withMessage("Invalid phone number"),
  check("city", "Invalid city value").exists({ checkFalsy: true }).isString().withMessage("Invalid city"),
  check("uid", "number not verified").exists({ checkFalsy: true }).bail().isString().withMessage("number not verified"),
  check("apartment", "Invalid apartment value").optional().exists({ checkFalsy: true }).isString(),
  check("address", "Invalid address value").exists({ checkFalsy: true }).isString().withMessage("Invalid address"),
  check("pincode", "Pincode required")
    .optional()
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Invalid pincode")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid 6 digit pincode"),
  check("email", "Invalid email value").optional().exists({ checkFalsy: true }).isString().isEmail().withMessage("Invalid email"),
  check("coordinates", "Invalid coordinates")
    .exists({ checkFalsy: true })
    .isArray({ min: 2, max: 2 })
    .bail()
    .custom((coordinates) => {
      console.log(coordinates);
      return coordinates[0] >= -180 && coordinates[0] <= 180 && coordinates[1] >= -90 && coordinates[1] <= 90;
    }),
  check("gender", "Invalid gender value")
    .optional()
    .exists({ checkFalsy: true })
    .isString()
    .bail()
    .custom((gender) => {
      return Object.values(genderEnum).includes(gender);
    }),
  check("fcm", "fcm token required").exists({ checkFalsy: true }).bail().isString().withMessage("Invalid fcm token"),
  check("dateOfBirth", "Invalid Date of birth").optional().exists({ checkFalsy: true }).bail().isString().bail().isISO8601(),
  check("profilePicUrl", "Invalid profile pic url").optional().exists({ checkFalsy: true }).bail().isString().bail(),
  check("speciality", "speciality is required ")
    .exists({ checkFalsy: true })
    .bail()
    .isArray({ max: 3, min: 1 })
    .withMessage("Max 3 and Min 1 speciality is allowed")
    .bail()
    .custom((speciality) => {
      const checkArray = speciality.filter((element: any) => {
        return typeof element !== "string";
      });

      if (checkArray?.length) {
        return false;
      }

      const checkIfValid = speciality.filter((element: any) => {
        return !doctorSpecialty.includes(element);
      });

      if (checkIfValid?.length) {
        return false;
      }
      return true;
    })
    .withMessage("Invalid specialities")

  // custom((apartment)=>{
  //     console.log('aprt',apartment)
  //     if(!apartment){
  //      return true
  //     }else{
  //         console.log('ala')

  //       if(typeof apartment !=="string") return 'Invalid apartment 2'
  //     }
  //   return true
  // }
];
export const clinicUpdateValidation = [
  check("doctorName", "doctorName is required").exists({ checkFalsy: true }).isString().withMessage("Invalid doctor name"),
  check("clinicName", "clinicName is required").exists({ checkFalsy: true }).isString().withMessage("Invalid clinic name"),
  check("apartment", "Invalid apartment value").optional().exists({ checkFalsy: true }).isString(),
  check("about", "Invalid about value").optional().exists({ checkFalsy: true }).isString(),
  check("address", "Invalid address value").exists({ checkFalsy: true }).isString().withMessage("Invalid address"),
  check("city", "Invalid city value").exists({ checkFalsy: true }).isString().withMessage("Invalid city"),
  check("publicNo", "Invalid public no").optional().exists({ checkFalsy: true }).isNumeric().withMessage("Invalid public phone number").isLength({ min: 10, max: 10 }).withMessage("Invalid phone number"),

  check("pincode", "Pincode required")
    .optional()
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Invalid pincode")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid 6 digit pincode"),
  check("coordinates", "Invalid coordinates")
    .exists({ checkFalsy: true })
    .isArray({ min: 2, max: 2 })
    .bail()
    .custom((coordinates) => {
      console.log(coordinates);
      return coordinates[0] >= -180 && coordinates[0] <= 180 && coordinates[1] >= -90 && coordinates[1] <= 90;
    }),
  check("gender", "Invalid gender value")
    .optional()
    .exists({ checkFalsy: true })
    .isString()
    .bail()
    .custom((gender) => {
      return Object.values(genderEnum).includes(gender);
    }),
  check("dateOfBirth", "Invalid Date of birth").optional().exists({ checkFalsy: true }).bail().isString().bail().isISO8601(),
  check("profilePicUrl", "Invalid profile pic url").optional().exists({ checkFalsy: true }).bail().isString().bail(),

  check("speciality", "speciality is required ")
    .exists({ checkFalsy: true })
    .bail()
    .isArray({ max: 3, min: 1 })
    .withMessage("Max 3 and Min 1 speciality is allowed")
    .bail()
    .custom((speciality) => {
      const checkArray = speciality.filter((element: any) => {
        return typeof element !== "string";
      });

      if (checkArray?.length) {
        return false;
      }

      const checkIfValid = speciality.filter((element: any) => {
        return !doctorSpecialty.includes(element);
      });

      if (checkIfValid?.length) {
        return false;
      }
      return true;
    })
    .withMessage("Invalid specialities")
];

export const clinicSerchValidation = [check("keyword", "Invaid keyword").exists({ checkFalsy: true }).isString(), check("pageNo", "Inavid PageNo").exists({ checkFalsy: true }).isNumeric()];

export const clinicSerchLocationValidation = [
  check("longitude", "invalid longitude").exists({ checkFalsy: true }),

  check("lattitude", "invalid lattitude").exists({ checkFalsy: true }),
  check("pageNo", "Inavid PageNo").exists({ checkFalsy: true }).isNumeric()

  // check("coordinates", "Invalid coordinates")
  //   .exists({ checkFalsy: true })
  //   .isArray({ min: 2, max: 2 })
  //   .bail()
  //   .custom((coordinates) => {
  //     console.log(coordinates);
  //     return coordinates >= -180 && coordinates[0] <= 180 && coordinates[1] >= -90 && coordinates[1] <= 90;
  //   })
];
