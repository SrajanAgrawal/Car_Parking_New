import mongoose from "mongoose";
import Booking from "./booking.models.js";

// const bookingHistorySchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     bookingStartTime: {
//         type: Date,
//         required: true
//     },
//     bookingEndTime: {
//         type: Date,
//         required: true
//     },
//     // You can add more fields as needed
// });

const parkingSpotSchema = new mongoose.Schema({
    parkingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parking',
        required: true
    },
    parkingSpotNumber: {
        type: String,
        required: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    occupiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    occupiedAt: {
        type: Date
    },
    releasedAt: {
        type: Date
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Booking,
        default: []
    }], // Array of booking history objects
    actualCheckInTime: {
        type: Date
    },
    actualCheckOutTime: {
        type: Date
    },
}, { timestamps: true });

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot;
