import express, { Router } from "express";
import authToken from "../middlewares/authToken";
import idValidation from "../middlewares/idValidation";

const router: Router = express.Router();

import userController from "../controllers/User";

//* POST
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refreshTokens", userController.refreshAccessToken);

//* GET
router.get("/:userId", [authToken, idValidation], userController.getUser);

//* PATCH
router.patch("/edit/username_email/:userId", [authToken, idValidation], userController.editUsernameOrEmail);

export default router;
