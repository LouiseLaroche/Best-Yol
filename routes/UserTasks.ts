import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userTasksController from "../controllers/UserTasks";

router.get("/:userId", authToken, userTasksController.getUserTasks);
router.post("/daily/:userId", authToken, userTasksController.createUserDailyTasks);
router.post("/", authToken, userTasksController.createUserCustomTask);

export default router;
