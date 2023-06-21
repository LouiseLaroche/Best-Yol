import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import speciesController from "../controllers/Species"

router.get("/", authToken, speciesController.getAllSpecies);

export default router;
