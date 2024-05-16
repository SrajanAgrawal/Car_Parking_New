import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = new twilio(accountSid, authToken);

export const sendMessage = async (message, phone) => {
    try {
        const sentMessage = await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: `+91${phone}`
        });

        if(sentMessage){
            console.log("Message Sent Successfully")
            return "Message Sent Successfully"
        }
        console.log("Message Not Sent Successfully")
        return "Message Not Sent Successfully"
    } catch (error) {
        console.log(error);
        return "Message Not Sent Successfully"
    }
}