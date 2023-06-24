import express, { Router } from "express";
import authToken from "../middlewares/authToken";

const router: Router = express.Router();

import userTasksController from "../controllers/UserTasks";
import idValidation from "../middlewares/idValidation";

router.get("/:userId", [authToken, idValidation], userTasksController.getUserTasks);
router.post("/:userId", [authToken, idValidation], userTasksController.createUserCustomTask);
router.put("/:taskId", authToken, userTasksController.changeTitleCustomTask);
router.put("/daily/active", authToken, userTasksController.removeActiveDaily);
router.patch("/daily/:userTaskId", authToken, userTasksController.validateDailyTask);
router.patch("/custom/:userTaskId", authToken, userTasksController.validateCustomTask);
router.delete("/:taskId", authToken, userTasksController.deleteCustomTask);
router.post("/daily/:userId", [authToken, idValidation], userTasksController.createUserDailyTasks);

export default router;
