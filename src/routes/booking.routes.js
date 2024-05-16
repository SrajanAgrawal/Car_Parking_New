import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { makeBookingByUser, getAllBookings, deleteBooking, editBooking } from "../controllers/booking.controllers.js";

const router = Router();

router.route("/makeBooking").post(verifyJWT, makeBookingByUser);
router.route("/getAllBookings").get(verifyJWT, getAllBookings);
router.route("/deleteBooking").post(verifyJWT, deleteBooking);
router.route("/editBooking").post(verifyJWT, editBooking);

export { router as bookingRouter }
