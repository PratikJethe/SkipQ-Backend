import { Router } from "express";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { userProfileController } from "../../controller/userProfile.controller";
import { getUserByIdFromToken } from "../../middleware/user.middleware";
import { userUpdateValidation } from "../../validators/userRequest.validator";

const router = Router();

router.get("/privarcy-policy", userProfileController.userPrivarcyPolicy);
router.use(authMiddleware);
router.post("/update-profile", [...userUpdateValidation, validationError,getUserByIdFromToken], userProfileController.updateUser);

export default router;
