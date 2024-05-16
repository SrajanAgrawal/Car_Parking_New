import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // to use crud operation on cookies.

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import {userRouter} from "./routes/user.routes.js"
import { parkingRouter } from "./routes/parking.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";

import { carRouter } from "./routes/car.routes.js";
import {paymentRouter} from "./routes/payment.routes.js"
import {adminRouter} from "./routes/admin.routes.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/parking", parkingRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/car", carRouter)
app.use("/api", paymentRouter)
app.use("/api/v1/admin", adminRouter);

app.get("/api/getKey", (req,res) => {
    res.status(200).json({
        status: "success",
        key: process.env.rzp_key_id
    })
})

export {app}