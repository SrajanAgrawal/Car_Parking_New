import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true

    },
    middleName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        // enum: ['MALE', 'FEMALE', 'OTHERS'],
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String
    },
    role: [{
        type: String,
        default: 'user'
    }],
    bookingHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            default: []
        }
    ],
    carsInfo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            default: []
        }
    ],
    refreshToken: {
        type: String
    },

}, { timestamps: true })




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(this.password, password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phoneNumber: this.phoneNumber,
            role: this.role

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)