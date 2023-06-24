import { Request, Response } from "express";
import { DailyTasks, PrismaClient, UserTasks } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { getRandomElements } from "../utils/getRandomElements";
import { newActiveDaily } from "../utils/switchActiveStatus";
import { AuthenticatedRequest } from "../middlewares/idValidation";

const prisma = new PrismaClient();

export const createUserCustomTask = (req: AuthenticatedRequest, res: Response) => {
    const userId: string = req.params.userId;
    const { title }: { title: string } = req.body;

    if (isNaN(parseInt(userId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userId doit être un nombre valide" });
        return;
    }

    if (!title) {
        res.status(400).json({ erreur: "le titre de la tâche est absent du corps de la requête" });
        return;
    }

    prisma.userTasks
        .create({
            data: {
                title,
                isDaily: false,
                isCompleted: false,
                completedAt: null,
                createdAt: new Date(),
                userId: parseInt(userId, 10),
                dailyTaskId: null,
            },
        })
        .then((userTask: Object) => {
            res.status(201).json({ userTask, message: "Tâche créée 🥳🎉" });
        })
        .catch((error: Object) => {
            res.status(500).json({ erreur: "Erreur lors de la création de la tâche 😕", error });
        });
};

export const changeTitleCustomTask = async (req: Request, res: Response) => {
    const taskId: string = req.params.taskId;
    const { title }: { title: string } = req.body;

    if (isNaN(parseInt(taskId, 10))) {
        res.status(400).json({ erreur: "Le paramètre taskId doit être un nombre valide" });
        return;
    }

    if (!title) {
        res.status(400).json({ erreur: "le titre de la tâche est absent du corps de la requête" });
        return;
    }

    try {
        const updatedTask = await prisma.userTasks.update({
            where: {
                id: parseInt(taskId, 10),
            },
            data: {
                title: title,
            },
        });

        res.status(200).json({ updatedTask, message: "Tâche modifiée 🥳🎉" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors du changement de titre 😕", error });
    }
};

export const deleteCustomTask = async (req: Request, res: Response) => {
    const taskId: string = req.params.taskId;

    if (isNaN(parseInt(taskId, 10))) {
        res.status(400).json({ erreur: "Le paramètre taskId doit être un nombre valide" });
        return;
    }

    try {
        await prisma.userTasks.delete({
            where: {
                id: parseInt(taskId, 10),
            },
        });

        res.status(200).json({ message: "Tâche supprimée 🔫" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors de la suppression de la tâche 😕", error });
    }
};

export const createUserDailyTasks = async (req: AuthenticatedRequest, res: Response) => {
    const userId: string = req.params.userId;

    if (isNaN(parseInt(userId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userId doit être un nombre valide" });
        return;
    }

    const today: Date = new Date();
    const startOfToday: number | Date = startOfDay(today);
    const endOfToday: number | Date = endOfDay(today);

    try {
        const existingDailyTasks = await prisma.userTasks.findFirst({
            where: {
                userId: parseInt(userId, 10),
                isDaily: true,
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        });

        if (existingDailyTasks) {
            res.status(500).json({ erreur: "L'utilisateur a déjà des tâches quotidiennes pour cette date 😕" });
            return;
        }

        const expiredDailytasks = await prisma.userTasks.findFirst({
            where: {
                userId: parseInt(userId, 10),
                isDaily: true,
                createdAt: {
                    lt: startOfToday,
                },
            },
        });

        if (expiredDailytasks) {
            const incompleteTasks = await prisma.userTasks.findMany({
                where: {
                    userId: parseInt(userId, 10),
                    isDaily: true,
                    isCompleted: false,
                    createdAt: {
                        lt: startOfToday,
                    },
                },
            });

            if (incompleteTasks.length > 0) {
                await prisma.userTasks.deleteMany({
                    where: {
                        userId: parseInt(userId, 10),
                        isDaily: true,
                        isCompleted: false,
                        createdAt: {
                            lt: startOfToday,
                        },
                    },
                });
            }
        }

        await newActiveDaily(6);

        const tasks: DailyTasks[] = await prisma.dailyTasks.findMany({
            where: {
                isActive: true,
            },
        });

        const userTasks: UserTasks[] = [];

        for (const task of tasks) {
            const userTask: UserTasks = await prisma.userTasks.create({
                data: {
                    title: task.title,
                    isDaily: true,
                    isCompleted: false,
                    completedAt: null,
                    userId: parseInt(userId, 10),
                    dailyTaskId: task.id,
                },
                include: {
                    dailyTask: true,
                },
            });

            userTasks.push(userTask);
        }

        res.status(200).json({ userTasks, message: "Tâches quotidiennes assignées 🥳🎉" });
    } catch (error) {
        res.status(500).json({ erreur: error });
    }
};

export const validateDailyTask = async (req: Request, res: Response) => {
    const userTaskId: string = req.params.userTaskId;
    const { yolId }: { yolId: number } = req.body;

    if (isNaN(yolId)) {
        res.status(400).json({ erreur: "yolId doit être un nombre valide" });
        return;
    }

    if (isNaN(parseInt(userTaskId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userTaskId doit être un nombre valide" });
        return;
    }

    if (!yolId) {
        res.status(400).json({ erreur: "yolId est absent du corps de la requête" });
        return;
    }

    try {
        const userTask = await prisma.userTasks.findUnique({
            where: {
                id: parseInt(userTaskId, 10),
            },
            include: {
                dailyTask: true,
            },
        });

        if (!userTask) {
            return res.status(404).json({ error: "Tâche non trouvée 😕" });
        }

        await prisma.yol.update({
            where: {
                id: yolId,
            },
            data: {
                xp: {
                    increment: userTask?.dailyTask?.xp,
                },
            },
        });

        const successId: number | null | undefined = userTask?.dailyTask?.successId;
        const userId = userTask?.userId;

        if (successId !== null) {
            const userSuccess = await prisma.userSuccess.findFirst({
                where: {
                    successId: successId as number,
                    isCompleted: false,
                    userId: userId,
                },
            });

            if (userSuccess) {
                await prisma.userSuccess.update({
                    where: {
                        id: userSuccess.id,
                    },
                    data: {
                        actualAmount: {
                            increment: 1,
                        },
                    },
                });
            }
        }

        const updatedTask = await prisma.userTasks.update({
            where: {
                id: userTask?.id,
            },
            data: {
                isCompleted: true,
            },
        });

        return res.status(200).json({ message: "Tâche validée 🥳🎉", yolXpGain: userTask?.dailyTask?.xp, updatedTask });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const validateCustomTask = async (req: Request, res: Response) => {
    const userTaskId: string = req.params.userTaskId;

    if (isNaN(parseInt(userTaskId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userTaskId doit être un nombre valide" });
        return;
    }

    try {
        const userTask = await prisma.userTasks.findUnique({
            where: {
                id: parseInt(userTaskId, 10),
            },
        });

        if (!userTask) {
            return res.status(404).json({ error: "Tâche non trouvée 😕" });
        }

        if (!userTask.isDaily) {
            if (userTask.isCompleted) {
                return res.status(400).json({ error: "Tâche déjà complétée" });
            }

            const firstTimeCompletingCustomTask = await prisma.userTasks.count({
                where: {
                    userId: userTask.userId,
                    isDaily: false,
                    isCompleted: true,
                },
            });

            if (firstTimeCompletingCustomTask !== 0) {
                await prisma.userTasks.update({
                    where: {
                        id: parseInt(userTaskId, 10),
                    },
                    data: {
                        isCompleted: true,
                    },
                });

                return res.status(200).json({ message: "Tâche complétée" });
            } else {
                const successId: number = 15;
                const successToValidate = await prisma.userSuccess.findFirst({
                    where: {
                        successId: successId,
                        userId: userTask.userId,
                    },
                });

                await prisma.userSuccess.update({
                    where: {
                        id: successToValidate?.id,
                    },
                    data: {
                        actualAmount: {
                            increment: 1,
                        },
                    },
                });

                await prisma.userTasks.update({
                    where: {
                        id: parseInt(userTaskId, 10),
                    },
                    data: {
                        isCompleted: true,
                    },
                });
                return res.status(200).json({ message: "Tâche complétée" });
            }
        } else {
            return res.status(400).json({ error: "Requête invalide" });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

export const removeActiveDaily = async (req: Request, res: Response) => {
    try {
        await prisma.dailyTasks.updateMany({
            where: {
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    } catch (error) {
        return res.status(400).json({ erreur: error });
    }

    return res.status(200).json({ message: "Les tâches quotidiennes actives ont bien été désactivée 🥳🎉" });
};

export const getUserTasks = async (req: AuthenticatedRequest, res: Response) => {
    const userId: string = req.params.userId;

    if (isNaN(parseInt(userId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userId doit être un nombre valide" });
        return;
    }

    try {
        const userTasks: UserTasks[] = await prisma.userTasks.findMany({
            where: {
                userId: parseInt(userId, 10),
            },
            include: {
                dailyTask: true,
            },
        });

        const customTasks: UserTasks[] = [];
        const dailyTasks: UserTasks[] = [];

        userTasks.forEach((task: UserTasks) => {
            if (task.isDaily) {
                dailyTasks.push(task);
            } else {
                customTasks.push(task);
            }
        });

        res.status(200).json({ customTasks, dailyTasks });
    } catch (error) {
        res.status(500).json({
            erreur: "Une erreur est survenue lors de la récupération des tâches de l'utilisateur 😕",
            error,
        });
    }
};

export default {
    createUserCustomTask,
    createUserDailyTasks,
    getUserTasks,
    changeTitleCustomTask,
    deleteCustomTask,
    removeActiveDaily,
    validateDailyTask,
    validateCustomTask,
};
