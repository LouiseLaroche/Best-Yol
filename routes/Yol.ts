import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import yolController from "../controllers/Yol";

const router: Router = express.Router();

router.post("/create", authToken, yolController.createYol);
router.get("/:id", authToken, yolController.getOneYol);
router.get("/user/:userId", authToken, yolController.getOneYolByUserId);

export default router;
