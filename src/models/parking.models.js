import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
    buildingName: {
        type: String,
        required: true
    },
    floors: [{
        floorNumber: {
            type: Number,
            min: 0,
            required: true
        },
        spots: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParkingSpot'
            // Add more spot-related fields as needed
        }]
    }]
});

const parkingSchema = new mongoose.Schema({
    spotName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'India'
    },
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    spotType: {
        type: String,
        enum: ['Indoor', 'Outdoor', 'Covered', 'Uncovered'],
        required: true
    },
    capacity: { // how many slots are available
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ['Available', 'Occupied', 'Reserved', 'Out of Service'],
        default: 'Available'
    },
    
    ratePerHour: {
        type: Number,
        required: true
    
    },
    rateOfPeakHour: {
        type: Number,
        required: true
    },
    facilities: [String], // Array of strings for facilities
    operatingHours: {
        type: String,
        required: true
    },
    accessibility: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    buildings: [buildingSchema],
    levelOfParking: {
        type: String,
        enum: ['Basement', 'Ground', 'Multi-Level'],
    },
    securityRating: {
        type: Number,
        min: 1,
        max: 5
    },
    searchingSpaceRating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5
    },
    images: [String], // Array of strings for image URLs
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    },

    
    

}, { timestamps: true });

const Parking = mongoose.model('Parking', parkingSchema);

export default Parking;