import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import yolController from "../controllers/Yol";

const router: Router = express.Router();

router.post("/create", authToken, yolController.createYol);
router.get("/:id", authToken, yolController.getOneYol);

export default router;
