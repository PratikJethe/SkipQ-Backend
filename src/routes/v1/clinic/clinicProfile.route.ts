import { Router } from "express";
import { clinicAuthController, clinicProfileController } from "../../../controllers/clinic";
import userController from "../../../controllers/user/userAuth.controller";
import { checkIfClinicEmailOrPhoneExist, getClinicByIdFromToken } from "../../../middlewares/clinic/clinic.middleware";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { getUserByIdFromToken } from "../../../middlewares/user/user.middleware";
import { clinicRegisterValidation, clinicSerchLocationValidation, clinicSerchValidation, clinicUpdateValidation } from "../../../validators/clinic/clinicRequest.validator";
import { userRegisterValidation, phoneLoginValidation } from "../../../validators/user/userRequest.validator";

const router = Router();

router.use(authMiddleware);
router.get("/search-by-keyword", [...clinicSerchValidation,validationError,getUserByIdFromToken], clinicProfileController.searchClinicByKeyword);
router.get("/search-by-location", [...clinicSerchLocationValidation,validationError,getUserByIdFromToken], clinicProfileController.searchClinicByLocation);
router.get("/get-notifications", [validationError,getClinicByIdFromToken], clinicProfileController.getClinicNotifications);
router.post("/update-profile", [...clinicUpdateValidation, validationError, getClinicByIdFromToken], clinicProfileController.updateClinic);
router.get("/is-subscription-required",authMiddleware,clinicProfileController.isSubscriptionRequired)
router.get("/:id", [getUserByIdFromToken], clinicProfileController.getClinicProfile);

export default router;
