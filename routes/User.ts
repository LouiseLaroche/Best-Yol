import express, { Router } from "express";

const router: Router = express.Router();

const userController = require("../controllers/User.ts");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
