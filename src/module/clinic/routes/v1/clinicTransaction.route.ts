import { Router } from "express";
import { authMiddleware } from "../../../../middlewares/request/authentication.middleware";
import { clinicTransactionController } from "../../controller/clinicTransaction.controller";
import { getClinicByIdFromToken } from "../../middleware/clinic.middleware";

const router = Router();

router.post("/generate-checksum", authMiddleware, clinicTransactionController.createChecksum);
router.post("/get-payment-status", clinicTransactionController.paymentStatus);
router.get("/get-payment-checkout",[authMiddleware,getClinicByIdFromToken], clinicTransactionController.paymentCheckout);
router.get("/webhook/payment-status",[authMiddleware,getClinicByIdFromToken], clinicTransactionController.paymentCheckout);
router.post("/success", clinicTransactionController.success);
router.post("/failed", clinicTransactionController.failure);

export default router;
