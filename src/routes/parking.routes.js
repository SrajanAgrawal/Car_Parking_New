import router from 'express';
import { generateRandomParkingData, searchParkingByQuery } from '../controllers/parking.controllers.js';

const parkingRouter = router.Router();

parkingRouter.get("/generateRandomParkingData", generateRandomParkingData)
parkingRouter.route("/searchParking").post(searchParkingByQuery)

export { parkingRouter }