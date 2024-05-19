import { asyncHandler } from "../utils/asyncHandler.js";
import Parking from "../models/parking.models.js";
import { faker } from '@faker-js/faker';
import ParkingSpot from "../models/parkingSpot.models.js";

const citiesArray = [
  "Agra",
  "Aligarh",
  "Allahabad",
  "Ambedkar Nagar",
  "Amroha (Jyotiba Phule Nagar)",
  "Auraiya",
  "Azamgarh",
  "Baghpat",
  "Bahraich",
  "Ballia",
  "Balrampur",
  "Banda",
  "Bara Banki",
  "Bareilly",
  "Basti",
  "Bijnor",
  "Budaun",
  "Bulandshahr",
  "Chandauli",
  "Chitrakoot",
  "Deoria",
  "Etah",
  "Etawah",
  "Faizabad",
  "Farrukhabad",
  "Fatehpur",
  "Firozabad",
  "Gautam Buddha Nagar",
  "Ghaziabad",
  "Ghazipur",
  "Gonda",
  "Gorakhpur",
  "Hamirpur",
  "Hardoi",
  "Hathras (Mahamaya Nagar)",
  "Jalaun",
  "Jaunpur",
  "Jhansi",
  "Kannauj",
  "Kanpur Dehat",
  "Kanpur Nagar",
  "Kasganj (Kanshiram Nagar)",
  "Kaushambi",
  "Kheri (Lakhimpur Kheri)",
  "Kushinagar",
  "Lalitpur",
  "Lucknow",
  "Mahoba",
  "Mahrajganj (Maharajganj)",
  "Mainpuri",
  "Mathura",
  "Mau",
  "Meerut",
  "Mirzapur",
  "Moradabad",
  "Muzaffarnagar",
  "Pilibhit",
  "Pratapgarh",
  "Rae Bareli",
  "Rampur",
  "Saharanpur",
  "Sant Kabir Nagar",
  "Sant Ravidas Nagar (Bhadohi)",
  "Shahjahanpur",
  "Shrawasti (Shravasti)",
  "Siddharthnagar",
  "Sitapur",
  "Sonbhadra",
  "Sultanpur",
  "Unnao",
  "Varanasi"
];
const buildingNames = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]


const generateRandomParkingData = asyncHandler(async (req, res) => {
  try {
    const mockParkingData = [];

    for (let i = 0; i < 30; i++) {
      var ratePerHour = faker.number.int({ min: 50, max: 100 });

      const parkingSpot = new Parking({
        spotName: faker.company.name(),
        city: faker.helpers.arrayElement(citiesArray),
        state: 'Uttar Pradesh',
        country: 'India',
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        spotType: faker.helpers.arrayElement(['Indoor', 'Outdoor', 'Covered', 'Uncovered']),
        // capacity: faker.number.int({ min: 10, max: 100 }),
        availability: faker.helpers.arrayElement(['Available', 'Occupied', 'Reserved', 'Out of Service']),
        
        ratePerHour: ratePerHour,
        rateOfPeakHour: ratePerHour + 20,
        facilities: [ 
          faker.helpers.arrayElement(['Security Cameras', 'Charging Stations', 'Accessible Parking', 'Valet Service'])
        ],
        operatingHours: faker.helpers.arrayElement(['24/7', '8 AM - 8 PM', '9 AM - 5 PM']),
        accessibility: faker.datatype.boolean(),
        description: faker.lorem.paragraph(),
        images: [
          "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHx8MA%3D%3D",

          "https://images.unsplash.com/photo-1604063165585-e17e9c3c3f0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmtpbmd8ZW58MHx8MHx8fDA%3D",

          "https://images.unsplash.com/photo-1526626607369-f89fe1ed77a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBhcmtpbmd8ZW58MHx8MHx8fDA%3D"
        ],

        levelOfParking: faker.helpers.arrayElement(['Basement', 'Ground']),
        securityRating: faker.number.int({ min: 1, max: 5 }),
        searchingSpaceRating: faker.number.int({ min: 1, max: 5 }),
        ratings: faker.number.int({ min: 1, max: 5 }),
        owner: faker.database.mongodbObjectId()

      });

      const noOfBuildings = 1 // faker.number.int({ min: 1, max: 2 });
      const buildings = [];
      var capacity = 0; // capacity
      for (let j = 0; j < noOfBuildings; j++) {

        const building = {
          buildingName: buildingNames[j],
          floors: []
        };

        for (let k = 1; k <= 1; k++) {
          building.floors.push({
            floorNumber: k,
            spots: []
          });
        }

        for (let l = 1; l <= building.floors.length; l++) {
          const capacityTemp = faker.number.int({ min: 5, max: 15 });
          capacity += capacityTemp;
          for (let m = 1; m <= capacityTemp; m++) {
            const spot = new ParkingSpot({
              parkingId: parkingSpot._id,
              parkingSpotNumber: `${building.buildingName}${building.floors[l-1].floorNumber}00${m}`,
              isOccupied: faker.datatype.boolean(),
              
              history: []
            })
            await spot.save();
            building.floors[l].spots.push(spot);
          }
        }
        buildings.push(building);
      }

      parkingSpot.buildings = buildings;
      parkingSpot.capacity = capacity;
      mockParkingData.push(parkingSpot);
    }


    await Parking.insertMany(mockParkingData);
    console.log('Mock data generated successfully');
    res.status(201).json({ message: 'Mock data generated successfully' });
  } catch (error) {
    console.error('Error generating mock data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const searchParkingByQuery = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const parkingSpots = await Parking.find({
      ...(req.query.id && { _id: req.query.id }),
      ...(req.query.city && { city: req.query.city }),
      ...(req.query.state && { state: req.query.state }),
      ...(req.query.country && { country: req.query.country }),
      ...(req.query.spotType && { spotType: req.query.spotType }),
      ...(req.query.availability && { availability: req.query.availability }),
      ...(req.query.accessibility && { accessibility: req.query.accessibility }),
      ...(req.query.searchTerm && {
        $or: [
          { spotName: { $regex: req.query.searchTerm, $options: 'i' } },
          { address: { $regex: req.query.searchTerm, $options: 'i' } },
          {city: {$regex: req.query.searchTerm, $options: 'i'}},
          
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit).populate('buildings.floors.spots');

    const totalParkingSpots = await Parking.countDocuments();

    res.status(200).json({
      parkingSpots,
      totalParkingSpots,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { generateRandomParkingData, searchParkingByQuery }