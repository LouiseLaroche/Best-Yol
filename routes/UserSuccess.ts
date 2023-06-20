import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userSuccessController from "../controllers/UserSuccess"

// router.get("/:userId", authToken, userSuccessController.getAllUserSuccess);
// router.get("/:userId/:id", authToken, userSuccessController.getOneUserSuccess);

export default router;
