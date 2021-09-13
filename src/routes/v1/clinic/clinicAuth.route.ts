
import { Router } from "express";
import { clinicAuthController } from "../../../controllers/clinic";
import  userController  from "../../../controllers/user/userAuth.controller";
import { checkIfClinicEmailOrPhoneExist } from "../../../middlewares/clinic/clinic.middleware";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { clinicRegisterValidation } from "../../../validators/clinic/clinicRequest.validator";
import { userRegisterValidation,phoneLoginValidation } from "../../../validators/user/userRequest.validator";

const router = Router()





router.post('/register',[...clinicRegisterValidation,validationError,checkIfClinicEmailOrPhoneExist], clinicAuthController.registerClinic)
router.post('/phone-login',[...phoneLoginValidation,validationError], clinicAuthController.phoneLogin)


export default router