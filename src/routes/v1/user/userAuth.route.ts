
import { Router } from "express";
import  userController  from "../../../controllers/authentication/userAuth.controller";
import { validationError } from "../../../middlewares/request";
import { userRegisterValidation,phoneLoginValidation } from "../../../validators/request/userRequest.validator";

const router = Router()





router.post('/register',userRegisterValidation,validationError, userController.registerUser)
router.post('/phoneLogin',[...phoneLoginValidation,validationError], userController.phoneLogin)


export default router