import { Router } from "express";
import { getClinicByIdFromBody, getClinicByIdFromParams, getClinicByIdFromToken } from "../../middleware/clinic.middleware";
import { checkIfTokenExistForClinic, checkIfTokenExistForUser, checkIfUserHasToken, hasClinicStarted } from "../../middleware/clinicQueue.middleware";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { getUserByIdFromParams, getUserByIdFromToken } from "../../../user/middleware/user.middleware";
import { ClinicQueueModel } from "../../model/clinicQueue.model";
import { offlineTokenCreateValidation, onlineTokenCreateValidation, onlineTokenUpdateValidation } from "../../validators/clinicQueue.validator";
import { clinicQueueController } from "../../controller/clinicQueue.controller";

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
router.get("/get-user-tokens", [getUserByIdFromToken], clinicQueueController.getUserTokens);

//clinic actions for online user
router.post("/accept-request", commonMiddleWareForDoctorActions, clinicQueueController.acceptRequest);
router.post("/reject-request", commonMiddleWareForDoctorActions, clinicQueueController.rejectRequest);
router.post("/reject-token", commonMiddleWareForDoctorActions, clinicQueueController.rejectToken);
router.post("/complete-token", commonMiddleWareForDoctorActions, clinicQueueController.completeToken);

//General
router.get("/get-pending-tokens/:clinicId", getClinicByIdFromParams, clinicQueueController.getPendingTokens);
router.get("/get-requests", getClinicByIdFromToken, clinicQueueController.getRequests);

export default router;
