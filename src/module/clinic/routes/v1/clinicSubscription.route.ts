import { Router } from "express";
import { validationError } from "../../../../middlewares/request";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { clinicSubscriptionControlller } from "../../controller/clinicSubscription.controller";
import { clinicTransactionController } from "../../controller/clinicTransaction.controller";
import { getClinicByIdFromToken } from "../../middleware/clinic.middleware";

const router = Router();

router.post("/create-clinic-plan", clinicSubscriptionControlller.createClinicPlans);
router.get("/get-clinic-subscriptions",[authMiddleware,validationError,getClinicByIdFromToken], clinicSubscriptionControlller.getClinicSubscription);

export default router;
