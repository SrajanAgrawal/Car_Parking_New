import Parking from "../models/parking.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ParkingSpot from "../models/parkingSpot.models.js";

const getParkingInfo = asyncHandler(async (req, res) => {
    try {
        if (!req.user || !req.user.role || !req.user.role.includes('admin')) {
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }
        const parking = await Parking.findOne({owner: req.user._id}) .populate({
            path: 'buildings',
            populate: {
                path: 'floors.spots',
                model: 'ParkingSpot' // Assuming you have a ParkingSpot model
            }
        })
        .populate('owner') // Specify the fields you want to populate for the owner
        .exec();
        if(!parking) {
            return res.status(404).json({ message: 'Parking not found' });
        }
        res.status(200).json({ message: 'Admin route', parking});
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);

const changeSpotAvailability = asyncHandler(async (req, res) => {
    try {
        if (!req.user || !req.user.role || !req.user.role.includes('admin')) {
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }
        const { spotId, isOccupied } = req.body;
        console.log(spotId, isOccupied)
        const spot = await ParkingSpot.findById(spotId).populate({
            path: 'parkingId',
            populate: [
                {
                    path: 'buildings',
                    populate: {
                        path: 'floors.spots',
                        model: 'ParkingSpot' // Assuming you have a ParkingSpot model
                    }
                },
                {
                    path: 'owner',
                    model: 'User'
                }
            ]
        })
        .exec();

        if(!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }
        spot.isOccupied = isOccupied;
        await spot.save({validateBeforeSave: false});
        res.status(200).json({ message: 'Spot availability updated successfully', data: spot });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export { getParkingInfo, changeSpotAvailability }