
import { Router } from "express";
import  userController  from "../../../controllers/user/userAuth.controller";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { checkIfUserEmailOrPhoneExist, getUserByIdFromToken } from "../../../middlewares/user/user.middleware";
import { userRegisterValidation,phoneLoginValidation } from "../../../validators/user/userRequest.validator";

const router = Router()





router.post('/register',[...userRegisterValidation,validationError,checkIfUserEmailOrPhoneExist], userController.registerUser)
router.post('/phone-login',[...phoneLoginValidation,validationError], userController.phoneLogin)
router.get('/get-by-id',[authMiddleware,getUserByIdFromToken] ,userController.getUserById)


export  default router