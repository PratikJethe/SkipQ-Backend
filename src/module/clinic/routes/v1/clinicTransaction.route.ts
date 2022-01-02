import { Router } from "express";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { clinicTransactionController } from "../../controller/clinicTransaction.controller";

const router = Router();

router.post("/generate-checksum", authMiddleware, clinicTransactionController.createChecksum);
router.post("/get-payment-status", clinicTransactionController.paymentStatus);

export default router;
