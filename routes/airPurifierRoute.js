import express from "express";
import { preCleanController, scheduleController } from "../controller/airPurifierController.js";

const airPurifierRoute = express.Router();

airPurifierRoute.post("/schedule", scheduleController);
airPurifierRoute.post("/pre-clean", preCleanController);

export default airPurifierRoute;