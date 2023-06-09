import express, { Router } from "express";

const router: Router = express.Router();

const userController = require("../controllers/User.ts");
const auth = require('../middlewares/auth');

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/:id", auth, userController.getUser);

module.exports = router;
