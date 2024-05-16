import { asyncHandler } from "./asyncHandler";
import otpGenerator from "otp-generator";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = new twilio(accountSid, authToken);

const sendOtp = asyncHandler(async (res, status, message, data) => {
    try {
        const otp = otpGenerator.generate(6, {
            upperCase: false,
            specialChars: false,
            alphabets: false
        });

        const message = await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioPhoneNumber,
            to: `+91${data.phone}`
        });

        if (message) {
            return res.status(status).json({
                status: "success",
                message,
                data: {
                    otp
                }
            });
        } else {
            return res.status(500).json({
                status: "fail",
                message: "Message not sent"
            });
        }
    } catch (error) {
        
    }
});

const sendMessage = asyncHandler(async(req,res) => {
    try {
        const { phone, message } = req.body;

        const sentMessage = await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: `+91${phone}`
        });

        if (sentMessage) {
            return res.status(200).json({
                status: "success",
                sentMessage
            });
        } else {
            return res.status(500).json({
                status: "fail",
                message: "Message not sent"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
})

export { sendOtp , sendMessage};