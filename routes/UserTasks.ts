import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userTasksController from "../controllers/UserTasks";

router.get("/:userId", authToken, userTasksController.getUserTasks);
router.post("/:userId", authToken, userTasksController.createUserCustomTask);
router.put("/:taskId", authToken, userTasksController.changeTitleCustomTask);
router.put("/daily/active", authToken, userTasksController.removeActiveDaily);
router.patch("/daily/:userTaskId", authToken, userTasksController.validateDailyTask);
router.delete("/:taskId", authToken, userTasksController.deleteCustomTask);
router.post("/daily/:userId", authToken, userTasksController.createUserDailyTasks);

export default router;
