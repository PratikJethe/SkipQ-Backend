
import { Router } from "express";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { checkIfUserEmailOrPhoneExist, getUserByIdFromToken } from "../../middleware/user.middleware";
import { phoneLoginValidation, userRegisterValidation } from "../../validators/userRequest.validator";
import userAuthController from "../../controller/userAuth.controller";
const router = Router()





router.post('/register',[...userRegisterValidation,validationError,checkIfUserEmailOrPhoneExist], userAuthController.registerUser)
router.post('/phone-login',[...phoneLoginValidation,validationError], userAuthController.phoneLogin)
router.get('/get-by-id',[authMiddleware,getUserByIdFromToken] ,userAuthController.getUserById)


export  default router