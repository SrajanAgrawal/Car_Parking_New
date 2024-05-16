import { asyncHandler } from "../utils/asyncHandler.js";
import Booking from "../models/booking.models.js";
import { instance } from "../index.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import { sendMessage } from "../utils/sendMessage.js";


const makeBookingByUser = asyncHandler(async (req, res) => {
    // logic to make booking
    try {
        if (!req.user) {
            res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            })

        }

        const { carID, parkingSpot, totalAmount, checkInTime, checkOutTime } = req.body

        if (![carID, parkingSpot, totalAmount, checkInTime, checkOutTime].every(field => field)) {
            return res.status(400).json({
                status: "fail",
                message: "All fields are required"
            })
        }

        

        const user = req.user;
        // save the booking in the user account
        await Booking.create({
            userID: req.user._id,

            carID,
            parkingSpot,
            totalAmount,
            checkInTime,
            checkOutTime,

        }).then(booking => {
            user.bookingHistory.push(booking._id);
            user.save({ validateBeforeSave: false });

            return res.status(201).json({
                status: "success",
                message: "Booking created successfully",
                data: {
                    booking
                }
            })

        }).catch(error => {
            return res.status(400).json({
                status: "fail",
                message: error.message,
            })
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
})

// get all booking for the user

const getAllBookings = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            })
        }
        const bookings = await Booking.find({ userID: req.user._id }).populate("carID parkingSpot")
        res.status(200).json({
            status: "success",
            data: {
                bookings
            },
            message: "Bookings fetched successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
})

const deleteBooking = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            })
        }
        const user = await User.findById(req.user._id);

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                status: "fail",
                message: "Booking not found"
            })
        }

        if (booking.userID.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                status: "fail",
                message: "You are not authorized to delete this booking"
            })
        }

        await booking.remove();

        user.bookingHistory = user.bookingHistory.filter(bookingID => bookingID.toString() !== req.params.id.toString());
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Booking deleted successfully",
            data: {
                booking
            }
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
})

const editBooking = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            })
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                status: "fail",
                message: "Booking not found"
            })
        }

        if (booking.userID.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                status: "fail",
                message: "You are not authorized to edit this booking"
            })
        }

        const { carID, parkingSpot, totalAmount, checkInTime, checkOutTime } = req.body

        if (![carID, parkingSpot, totalAmount, checkInTime, checkOutTime].every(field => field)) {
            return res.status(400).json({
                status: "fail",
                message: "All fields are required"
            })
        }

        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, {
            carID,
            parkingSpot,
            totalAmount,
            checkInTime,
            checkOutTime
        }, { new: true, runValidators: true })

        res.status(200).json({
            status: "success",
            message: "Booking updated successfully",
            data: {
                booking: updatedBooking
            }
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}
)

const checkout = asyncHandler(async (req, res) => {
    console.log("Checkout")
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
        // receipt: "receipt#1",
        // payment_capture: 0,
    };

    const order = await instance.orders.create(options);

    console.log(order);

    res.status(200).json({
        status: "success",
        order,
        message: "Order created successfully"

    })
})

const paymentVerification = asyncHandler(async (req, res) => {
    try {

        const { bookingId } = req.query;

        // const bookingId = "6640bf015ffcefe7cd029b2e";
        console.log(req.query);

        console.log(bookingId)
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.rzp_key_secret)
            .update(body.toString())
            .digest("hex");

        console.log(expectedSignature, razorpay_signature);

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {

            return res.redirect(`https://car-parking-new.vercel.app/paymentFail?reference=${razorpay_order_id}`)
        }

        const booking = await Booking.findOne({ _id: bookingId }).populate("userID").populate("carID").populate("parkingSpot");
        console.log(booking);
        booking.payment_id = razorpay_payment_id;
        booking.order_id = razorpay_order_id;
        booking.paymentStatus = "Paid";
        console.log(booking)
        await booking.save({ validateBeforeSave: false });

        // Send the Sms to the user

        const message = `Thanks For Booking With Us! \n Your Booking Reference is ${razorpay_order_id} \n Your Payment of Rs.${booking.totalAmount} has been received successfully. \n Your CheckIn Time is ${booking.checkInTime} \n Your CheckOut Time is ${booking.checkOutTime} \n Your Parking Spot is ${booking.parkingSpot.address} \n Your Car is ${booking.carID.vehicleNumber} \n Additional Details : Parking Spot Link: https://www.google.com/maps/search/?api=1&query=${booking.parkingSpot.latitude}%2C-${booking.parkingSpot.longitude} \n For any query contact us at: 1234567890
        `

        // send the mail
        sendMail(booking.userID.email, "Booking Confirmation", message)

        const sms = await sendMessage(message, booking.userID.phoneNumber)

        res.redirect(`https://car-parking-new.vercel.app/paymentSuccess?reference=${razorpay_order_id}`)

        console.log(req.body);
        // const { orderID } = req.body;
        // const response = await instance.orders.fetch(orderID);
        // console.log(response);
        res.status(200).json({
            status: "success",
            sms,
            message: "Payment verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
})




export { makeBookingByUser, getAllBookings, checkout, paymentVerification, deleteBooking, editBooking }

