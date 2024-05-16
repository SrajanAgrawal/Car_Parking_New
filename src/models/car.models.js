import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
    {
        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
        },
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
        },
        model: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Car = mongoose.model("Car", carSchema);