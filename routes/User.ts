import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import idValidation from "../middlewares/idValidation";

const router: Router = express.Router();

import userController from "../controllers/User";

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/:userId", [authToken, idValidation], userController.getUser);

export default router;
