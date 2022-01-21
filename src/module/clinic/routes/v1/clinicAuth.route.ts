
import { Router } from "express";
import  userController  from "../../../user/controller/userAuth.controller";
import { checkIfClinicEmailOrPhoneExist } from "../../middleware/clinic.middleware";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { clinicRegisterValidation } from "../../validators/clinicRequest.validator";
import { userRegisterValidation,phoneLoginValidation } from "../../../user/validators/userRequest.validator";
import { clinicAuthController } from "../../controller";

const router = Router()





router.post('/register',[...clinicRegisterValidation,validationError,checkIfClinicEmailOrPhoneExist], clinicAuthController.registerClinic)
router.post('/phone-login',[...phoneLoginValidation,validationError], clinicAuthController.phoneLogin)
router.get('/get-by-id',authMiddleware, clinicAuthController.getCliicById)


export default router