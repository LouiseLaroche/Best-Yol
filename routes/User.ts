import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

const userController = require("../controllers/User.ts");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/:id", authToken, userController.getUser);

module.exports = router;
