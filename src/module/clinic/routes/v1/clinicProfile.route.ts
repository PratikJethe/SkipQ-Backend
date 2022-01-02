import { Router } from "express";
import userController from "../../../user/controller/userAuth.controller";
import { checkIfClinicEmailOrPhoneExist, getClinicByIdFromToken } from "../../middleware/clinic.middleware";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { getUserByIdFromToken } from "../../../user/middleware/user.middleware";
import { clinicRegisterValidation, clinicSerchLocationValidation, clinicSerchValidation, clinicUpdateValidation } from "../../validators/clinicRequest.validator";
import { userRegisterValidation, phoneLoginValidation } from "../../../user/validators/userRequest.validator";
import { clinicProfileController } from "../../controller";

const router = Router();

router.use(authMiddleware);
router.get("/search-by-keyword", [...clinicSerchValidation,validationError,getUserByIdFromToken], clinicProfileController.searchClinicByKeyword);
router.get("/search-by-location", [...clinicSerchLocationValidation,validationError,getUserByIdFromToken], clinicProfileController.searchClinicByLocation);
router.get("/get-notifications", [validationError,getClinicByIdFromToken], clinicProfileController.getClinicNotifications);
router.post("/update-profile", [...clinicUpdateValidation, validationError, getClinicByIdFromToken], clinicProfileController.updateClinic);
router.get("/is-subscription-required",authMiddleware,clinicProfileController.isSubscriptionRequired)
router.get("/:id", [getUserByIdFromToken], clinicProfileController.getClinicProfile);

export default router;
