import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userSuccessController from "../controllers/UserSuccess";
import idValidation from "../middlewares/idValidation";

router.get("/:userId", [authToken, idValidation], userSuccessController.getAllUserSuccessByUserId);
router.patch("/validate/:id", [authToken, idValidation], userSuccessController.validateSuccess);

export default router;
