import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    bookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['credit', 'debit'], required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    remarks: { type: String, default: ''},
    // paymentID: { type: String, default: ''},
    // paymentRequestID: { type: String, default: ''},
    // paymentResponse: { type: Object, default: {}

}, { timestamps: true });


const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;