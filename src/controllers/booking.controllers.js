import { asyncHandler } from "../utils/asyncHandler.js";
import Booking from "../models/booking.models.js";
import { instance } from "../index.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import { sendMessage } from "../utils/sendMessage.js";
import { User } from "../models/user.models.js";
import ParkingSpot from "../models/parkingSpot.models.js";
import Parking from "../models/parking.models.js";


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



        const parking = await Parking.findById(parkingSpot).populate({
            path: 'buildings.floors.spots',
            model: 'ParkingSpot'
        });
        if (!parking) {
            return res.status(404).json({
                status: "fail",
                message: "Parking spot not found"
            });
        }

        let availableSpot = null;
        for (const building of parking.buildings) {
            for (const floor of building.floors) {
                for (const spot of floor.spots) {
                    if (!spot.isOccupied) {
                        availableSpot = spot;
                        spot.isOccupied = true;
                        await spot.save({ validateBeforeSave: false});

                        break;
                    }
                }
                if (availableSpot) break;
            }
            if (availableSpot) break;
        }

        if (!availableSpot) {
            return res.status(400).json({
                status: "fail",
                message: "No available spots"
            });
        }



        const user = req.user;
        // save the booking in the user account
        await Booking.create({
            userID: req.user._id,

            carID,
            parkingSpot,
            mainParkingSpot: availableSpot._id,
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

        const booking = await Booking.findOne({ _id: bookingId }).populate("userID").populate("carID").populate("parkingSpot").populate("mainParkingSpot");
        console.log(booking);
        booking.payment_id = razorpay_payment_id;
        booking.order_id = razorpay_order_id;
        booking.paymentStatus = "Paid";
        console.log(booking)
        await booking.save({ validateBeforeSave: false });

        // Send the Sms to the user

        const message1 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
        }
        .email-body {
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
        .button {
            display: inline-block;
            background-color: #28a745;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .button:hover {
            background-color: #218838;
        }
        .info {
            margin: 10px 0;
        }
        .info-title {
            font-weight: bold;
        }
        .info-detail {
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Thanks For Booking With Us!</h2>
        </div>
        <div class="email-body">
            <p class="info"><span class="info-title">Your Booking Reference:</span><span class="info-detail">${razorpay_order_id}</span></p>
            <p class="info"><span class="info-title">Your Payment of:</span><span class="info-detail">Rs.${booking.totalAmount} has been received successfully.</span></p>
            <p class="info"><span class="info-title">Your CheckIn Time:</span><span class="info-detail">${booking.checkInTime}</span></p>
            <p class="info"><span class="info-title">Your CheckOut Time:</span><span class="info-detail">${booking.checkOutTime}</span></p>
            <p class="info"><span class="info-title">Your Parking Spot:</span><span class="info-detail">${booking.mainParkingSpot.parkingSpotNumber}</span></p>
            <p class="info"><span class="info-title">Your Parking Address:</span><span class="info-detail">${booking.parkingSpot.address}</span></p>
            <p class="info"><span class="info-title">Your Car:</span><span class="info-detail">${booking.carID.vehicleNumber}</span></p>
            <p class="info"><span class="info-title">Parking Spot Link:</span><span class="info-detail"><a href="https://www.google.com/maps/search/?api=1&query=${booking.parkingSpot.latitude}%2C-${booking.parkingSpot.longitude}" class="button">View Address</a></span></p>
            <p class="info"><span class="info-title">Navigation For Parking Location:</span><span class="info-detail"><a href="https://car-parking-new.vercel.app/${booking.parkingSpot._id}/${booking.mainParkingSpot.parkingSpotNumber}.jpeg" class="button">View on Map</a></span></p>
        </div>
        <div class="email-footer">
            <p>love.mittal@mangalayatan.edu.in</p>
            <p>For any query contact us at: +91-8006251300</p>
        </div>
    </div>
</body>
</html>
`;

        // send the mail
        sendMail(booking.userID.email, "Booking Confirmation", message1);


        const message = `Thanks For Booking With Us! \n Your Booking Reference is ${razorpay_order_id} \n Your Payment of Rs.${booking.totalAmount} has been received successfully. \n Your CheckIn Time is ${booking.checkInTime} \n Your CheckOut Time is ${booking.checkOutTime} \n Your Parking Spot is ${booking.parkingSpot.address} \n Your Car is ${booking.carID.vehicleNumber} \n Additional Details : Parking Spot Address: https://www.google.com/maps/search/?api=1&query=${booking.parkingSpot.latitude}%2C-${booking.parkingSpot.longitude} \n Navigation For Parking Location: https://car-parking-new.vercel.app/${booking.parkingSpot._id}/${booking.mainParkingSpot.parkingSpotNumber}.jpeg \n For any query contact us at: +91-8006251300`;

        // send the phone message

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

