import { Router } from "express";
import userController from "../../../controllers/user/userAuth.controller";
import { userProfileController } from "../../../controllers/user/userProfile.controller";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { checkIfUserEmailOrPhoneExist, getUserByIdFromToken } from "../../../middlewares/user/user.middleware";
import { userRegisterValidation, phoneLoginValidation, userUpdateValidation } from "../../../validators/user/userRequest.validator";

const router = Router();

router.use(authMiddleware);
router.post("/update-profile", [...userUpdateValidation, validationError,getUserByIdFromToken], userProfileController.updateUser);

export default router;
