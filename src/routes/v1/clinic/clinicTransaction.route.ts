import { Router } from "express";
import { clinicAuthController } from "../../../controllers/clinic";
import {clinicTransactionController} from "../../../controllers/clinic/clinicTransaction.controller";
import { authMiddleware } from "../../../middlewares/request/authentication.middleware";

const router = Router();

router.post("/generate-checksum", authMiddleware, clinicTransactionController.createChecksum);

export default router;
