import Router from "express";


import { addCar, deleteCar } from "../controllers/car.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";




const carRouter = Router();

carRouter.route("/add").post(verifyJWT, addCar);
carRouter.route("/delete").delete(verifyJWT, deleteCar);

export { carRouter };