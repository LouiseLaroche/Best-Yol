import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import idValidation from "../middlewares/idValidation";
import validateSchema from "../middlewares/validateSchema";

const router: Router = express.Router();

import userController from "../controllers/User";
import { SignUpSchema, LoginSchema } from "../schemas/User";

router.post("/signup", validateSchema(SignUpSchema), userController.signup);
router.post("/login", validateSchema(LoginSchema), userController.login);
router.get("/:userId", [authToken, idValidation], userController.getUser);
router.post("/refreshTokens", userController.refreshAccessToken);

export default router;
