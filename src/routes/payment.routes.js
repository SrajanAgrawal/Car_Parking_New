import { Router } from "express";
import { checkout, paymentVerification } from "../controllers/booking.controllers.js";

const router = Router();

router.route("/checkout").post(checkout)
router.route("/paymentVerification").post(paymentVerification)

export {router as paymentRouter}