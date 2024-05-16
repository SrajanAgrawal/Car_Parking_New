import Router from "express";
import { changeSpotAvailability, getParkingInfo } from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.route("/getParkingInfo").get(verifyJWT, getParkingInfo);
adminRouter.route("/changeSpotAvailability").post(verifyJWT, changeSpotAvailability);

export {adminRouter}