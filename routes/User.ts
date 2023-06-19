import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userController from "../controllers/User";

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/:id", authToken, userController.getUser);

export default router;
