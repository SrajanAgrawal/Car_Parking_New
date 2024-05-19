import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadFileOnCloudinary } from '../utils/cloudinary.js'
import { sendMail } from '../utils/sendMail.js'
import { model } from 'mongoose'

// get access and refresh token
const getAccessAndRefreshToken = async function (id) {
    // fetch the user
    try {
        const user = await User.findById(id);
        console.log(user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log(accessToken + "" + refreshToken)

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        console.log("hi")
        return { accessToken, refreshToken }
    } catch (error) {
        // res.status(500).json({message: "Something went wrong while generating referesh and access token"})
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
        console.log(error);
    }

}

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            res.status(400).json({ message: "User not found" })
        }

        if(req.user.isVerified === false){
            res.status(400).json({ message: "Please verify your email" , data: req.user})
        }
        const user
            = await User.findById(req.user._id).populate("carsInfo").populate({
                path: 'bookingHistory',
                populate: [
                    {
                        path: 'parkingSpot',
                        model: 'Parking'
                    },
                    {
                        path: 'carID',
                        model: 'Car'
                    }
                ]
            });
        res.status(200).json({ data: user, message: "User fetched successfully" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching the user" })
    }
})

// register the user
const registerUser = asyncHandler(async (req, res) => {

    try {


        console.log(req.file);


        const { firstName, middleName, lastName, email, password, phoneNumber, gender, dob } = req.body;

        if ([firstName, lastName, email, password, phoneNumber, gender, dob].some((field) => field?.trim() === "")) {
            res.status(400).json({ message: "All fields are required" })
        }

        const existedUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { phoneNumber }]
        })
        console.log(existedUser);

        if (existedUser) {
            res.status(400).json({ message: "User already exists" })
        }
        var avatar;

        if (req.file) {
            const avatarLocalPath = req.file?.path;
            console.log(avatarLocalPath);

            const fileName = req.file.originalname;
            const response = await uploadFileOnCloudinary(avatarLocalPath);
            // const avatar = await uploadOnCloudinary(avatarLocalPath)
            console.log(response.url)

            if (!response.url) {
                res.status(500).json({ message: "Something went wrong while uploading the image" })
            }
            avatar = response.url;
        }
        else {
            avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=200&rounded=true`
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        const user = await User.create(
            {
                firstName: firstName.trim(),
                middleName,
                lastName: lastName.trim(),
                email: email.toLowerCase(),
                password,
                phoneNumber,
                avatar,
                emailOtp: otp,
                gender,
                dob
            }
        );
        const subject = "Verify Your Email || Car Parking System"
        const text = `Hello ${user.firstName}, OTP is ${otp}. Please verify your email by entering this OTP.`
        sendMail(user.email, subject, text)
        await user.save();
        res.status(201).json({ message: "User created successfully", data: user })

    } catch (error) {

        res.status(500).json({ message: "Something went wrong while creating the user" })
    }


})

// verify email otp
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase(), emailOtp: otp })

    if (!user) {
        throw new ApiError(400, "Invalid OTP or Email");
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully", data: user });
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    // validate if all the fields are there or not
    if (!(email && password)) {
        return res.status(400).json({ message: "All fields are required" })
    }

    // make sure the email exists.
    const existedUser = await User.findOne({ email }).populate("carsInfo").populate({
        path: 'bookingHistory',
        populate: [
            {
                path: 'parkingSpot',
                model: 'Parking'
            },
            {
                path: 'carID',
                model: 'Car'
            }
        ]
    });


    if(existedUser.isVerified === false){
        res.status(200).json({ message: "Please verify your email" , data: existedUser, isVerified: existedUser.isVerified})
    }

    if (!existedUser) {
        res.status(400).json({ message: "Email does not exist" })
    }
    console.log(existedUser.password);
    const storedPassword = existedUser.password
    const isValidPassword = existedUser.isPasswordCorrect(password);
    // const isValidPassword = await existedUser.isPasswordCorrect(password);

    // const isValidPassword = await existedUser.isPasswordCorrect(password);

    if (!isValidPassword) {
        res.status(400).json({ message: "Invalid Password" })
    }

    // generate tokens and store in the cookies
    const { accessToken, refreshToken } = await getAccessAndRefreshToken(existedUser._id);

    // cookies can only be changed or updated by server 
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ data: existedUser, message: "USER LOGGED IN SUCCESSFULLY" })
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );
    
        const cookieOptions = {
            httpOnly: true,
            sameSite: 'None', // or 'Lax', depending on your requirements
            secure: process.env.NODE_ENV === 'production', // ensure this is only true in production
        };
    
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
    
        res.status(200).json({ message: "User logged out successfully" });
        
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while logging out the user", error: error.message})
    }
});

const updateUserAvatar = asyncHandler(async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" })
        }

        const avatarLocalPath = req.file?.path;
        console.log(avatarLocalPath);

        const fileName = req.file.originalname;
        const response = await uploadFileOnCloudinary(avatarLocalPath);
        // const avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log(response.url)

        if (!response.url) {
            res.status(500).json({ message: "Something went wrong while uploading the image" })
        }
        const avatar = response.url;

        const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
        res.status(200).json({ message: "Avatar updated successfully", data: user });

    } catch (err) {
        return res.status(400).json({ message: "Please upload an image", error: err.message })
    }
})

const updateUserAccount = asyncHandler(async (req, res) => {
    try {
        const { firstName, middleName, lastName, phoneNumber
        } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { firstName, middleName, lastName, phoneNumber }, { new: true })
        res.status(200).json({ message: "User updated successfully", data: user });


    } catch (error) {

        return res.status(400).json({ message: "Please fill all the fields", error: error.message })
    }


})

export { registerUser, loginUser, verifyOTP, logoutUser, updateUserAvatar, updateUserAccount, getCurrentUser }