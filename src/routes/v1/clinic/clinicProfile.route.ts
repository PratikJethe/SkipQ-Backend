
import { Router } from "express";
import { clinicAuthController ,clinicProfileController} from "../../../controllers/clinic";
import  userController  from "../../../controllers/user/userAuth.controller";
import { checkIfClinicEmailOrPhoneExist, getClinicByIdFromToken } from "../../../middlewares/clinic/clinic.middleware";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { clinicRegisterValidation, clinicUpdateValidation } from "../../../validators/clinic/clinicRequest.validator";
import { userRegisterValidation,phoneLoginValidation } from "../../../validators/user/userRequest.validator";

const router = Router()




router.use(authMiddleware)
router.post('/update-profile',[...clinicUpdateValidation,validationError,getClinicByIdFromToken], clinicProfileController.updateClinic)


export default router