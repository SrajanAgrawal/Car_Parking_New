import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true
    },
    checkOutTime: {
      type: Date, 
      default: null
    },
    parkingSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    mainParkingSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: true,
    },
    
    status: {
      type: String,
      enum: ["Booked", "Checked-in", "Checked-out"],
      default: "Booked",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    payment_id: {
      type: String,
      default: null
    },
    order_id: {
      type: String,
      default: null
    
    },
    totalAmount: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
