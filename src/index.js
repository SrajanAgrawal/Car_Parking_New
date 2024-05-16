
import { app } from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import Razorpay from "razorpay";
dotenv.config();


export const instance = new Razorpay({
    key_id: process.env.rzp_key_id,
    key_secret: process.env.rzp_key_secret,
});

const port = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
}).catch((err) => {

    console.log(`DB Connection Error !! ${err}`);
})

