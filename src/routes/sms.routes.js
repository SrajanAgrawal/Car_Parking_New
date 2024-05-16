import Router from "express"
import { sendMessage, sendOtp } from "../controllers/sms.controllers.js";

const router = Router()

router.route("/send-otp").post(sendOtp);
router.route("/send-message").post(sendMessage);

export default router;