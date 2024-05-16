import { asyncHandler } from '../utils/asyncHandler.js'
import { Car } from '../models/car.models.js';
import { User } from '../models/user.models.js';

// add a car for a user
const addCar = asyncHandler(async (req, res) => {
    try {
        if(!req.user) {
            res.status(401).json({message: "Unauthorized"})
        }
        console.log(req.user)

        const { registrationNumber, model, type, color, vehicleNumber } = req.body;
        console.log(req.body);
        if ([ model, type, color, vehicleNumber].some((field) => field?.trim() === "")) {
            res.status(400).json({ message: "All fields are required" })
        }

        if(!registrationNumber) {
            registrationNumber = "NA";
        }
        const existedCar = await Car.findOne({ registrationNumber });
        if (existedCar) {
            res.status(400).json({ message: "Car already exists" })
        }


        console.log("Car not exists")
        const car = new Car({ registrationNumber,vehicleNumber,  model, type, color, user: req.user._id});
        await car.save();

        console.log("Car saved")
        // add the car to the user's account also
        const user = await User.findById(req.user._id);

        console.log("User found")
        user.carsInfo.push(car._id);
        
        console.log("Car added to user" + user.carsInfo);
        // await user.save();
        await user.save({ validateBeforeSave: false });

        console.log("Car added to user")

        res.status(201).json({ message: "Car added successfully" , data: car})

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while adding the car" })
    }
})

// get all the cars for a user
const getAllCars = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("carsInfo");
        res.status(200).json({data: user.carsInfo, message: "All cars fetched successfully"})
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching the cars" })

    }
})

// delete car by car Id number for a user
const deleteCar = asyncHandler(async (req, res) => {
    try {
        if(!req.user) {
            res.status(401).json({message: "Unauthorized"})
        }

        console.log("User found")
        console.log(req.query)

        const { carId } = req.query;
        if (!carId) {
            res.status(400).json({ message: "Car ID is required" })
        }

        const user = await User.findById(req.user.id);

        const index = user.carsInfo.indexOf(carId);
        if (index === -1) {
            res.status(404).json({ message: "Car not found in user's account" })
        }
        else {
            const car = await Car.findByIdAndDelete(carId);
            if (!car) {
                res.status(404).json({ message: "Car not found" })
            }
            user.carsInfo.splice(index, 1);

            await user.save({ validateBeforeSave: false });

        }
        res.status(200).json({ message: "Car deleted successfully", data: user })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the car" })
    }
})


export { addCar , deleteCar, getAllCars}