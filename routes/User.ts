import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import idValidation from "../middlewares/idValidation";
import validateSchema from "../middlewares/validateSchema";

const router: Router = express.Router();

import userController from "../controllers/User";
import { SignUpSchema, LoginSchema } from "../schemas/User";

//* POST
router.post("/signup", validateSchema(SignUpSchema), userController.signup);
router.post("/login", validateSchema(LoginSchema), userController.login);
router.post("/refreshTokens", userController.refreshAccessToken);

//* GET
router.get("/:userId", [authToken, idValidation], userController.getUser);

//* PATCH
router.patch("/edit/username_email/:userId", [authToken, idValidation], userController.editUsernameOrEmail);

export default router;
