import { Router } from "express";
import { clinicQueueController } from "../../../controllers/clinic/clinicQueue.controller";
import { getClinicByIdFromBody, getClinicByIdFromParams, getClinicByIdFromToken } from "../../../middlewares/clinic/clinic.middleware";
import { checkIfTokenExistForClinic, checkIfTokenExistForUser, checkIfUserHasToken, hasClinicStarted } from "../../../middlewares/clinic/clinicQueue.middleware";
import { validationError } from "../../../middlewares/request";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";
import { getUserByIdFromParams, getUserByIdFromToken } from "../../../middlewares/user/user.middleware";
import { ClinicQueueModel } from "../../../models/clinic/clinicQueue.model";
import { offlineTokenCreateValidation, onlineTokenCreateValidation, onlineTokenUpdateValidation } from "../../../validators/clinic/clinicQueue.validator";

const router: Router = Router();

const commonMiddleWareForDoctorActions = [...onlineTokenUpdateValidation, validationError, getClinicByIdFromToken, checkIfTokenExistForClinic];

const commonMiddleWareForUserActions = [...onlineTokenUpdateValidation, validationError, getUserByIdFromToken, checkIfTokenExistForUser];

router.use([authMiddleware]);

//user actions
router.put("/start-clinic", [getClinicByIdFromToken], clinicQueueController.startClinic);
router.put("/stop-clinic", [getClinicByIdFromToken], clinicQueueController.stopClinic);
router.post("/request-token", [...onlineTokenCreateValidation, validationError, getClinicByIdFromBody, hasClinicStarted, getUserByIdFromToken, checkIfUserHasToken], clinicQueueController.requestToken);
router.post("/cancel-token", commonMiddleWareForUserActions, clinicQueueController.cancelTokne);
router.post("/cancel-request", commonMiddleWareForUserActions, clinicQueueController.cancelRequest);
router.post("/create-offline-token", [...offlineTokenCreateValidation, validationError, getClinicByIdFromToken, hasClinicStarted], clinicQueueController.createOfflineToken);
router.get("/get-user-tokens",[getUserByIdFromToken],clinicQueueController.getUserTokens,)


//clinic actions for online user
router.post("/accept-request", commonMiddleWareForDoctorActions, clinicQueueController.acceptRequest);
router.post("/reject-request", commonMiddleWareForDoctorActions, clinicQueueController.rejectRequest);
router.post("/reject-token", commonMiddleWareForDoctorActions, clinicQueueController.rejectToken);
router.post("/complete-token", commonMiddleWareForDoctorActions, clinicQueueController.completeToken);

//General
router.get("/get-pending-tokens/:clinicId",getClinicByIdFromParams,clinicQueueController.getPendingTokens,)


export default router;
