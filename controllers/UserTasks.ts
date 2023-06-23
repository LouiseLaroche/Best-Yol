import { Request, Response } from "express";
import { DailyTasks, PrismaClient, UserTasks } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { getRandomElements } from "../utils/getRandomElements";
import { newActiveDaily } from "../utils/switchActiveStatus";

const prisma = new PrismaClient();

export const createUserCustomTask = (req: Request, res: Response) => {
    const userId: string = req.params.userId;
    const { title }: { title: string } = req.body;

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

export const changeTitleCustomTask = (req: Request, res: Response) => {
    const taskId: string = req.params.taskId;
    const { title }: { title: string } = req.body;

    prisma.userTasks
        .update({
            where: {
                id: parseInt(taskId, 10),
            },
            data: {
                title: title,
            },
        })
        .then((updatedTask: Object) => {
            res.status(200).json({ updatedTask, message: "Tâche modifiée 🥳🎉" });
        })
        .catch((error: Object) => {
            res.status(500).json({ erreur: "Erreur lors du changement de titre 😕", error });
        });
};

export const deleteCustomTask = (req: Request, res: Response) => {
    const taskId: string = req.params.taskId;

    prisma.userTasks
        .delete({
            where: {
                id: parseInt(taskId, 10),
            },
        })
        .then(() => res.status(200).json({ message: "Tâche supprimée 🔫" }))
        .catch((error: Object) => res.status(500).json({ erreur: "Erreur lors de la suppression de la tâche 😕", error }));
};

export const createUserDailyTasks = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

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
    const { yolId } = req.body;
    const userTaskId: string = req.params.userTaskId;

    try {
        const userTask = await prisma.userTasks.findUnique({
            where: {
                id: parseInt(userTaskId, 10),
            },
            include: {
                dailyTask: true,
            },
        });

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
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An internal server error occurred" });
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
        return error;
    }

    return res.status(200).json({ message: "Les tâches quotidiennes actives ont bien été désactivée 🥳🎉" });
};

export const getUserTasks = (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    prisma.userTasks
        .findMany({
            where: {
                userId: parseInt(userId, 10),
            },
            include: {
                dailyTask: true,
            },
        })
        .then((userTasks: UserTasks[]) => {
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
        })
        .catch((error: Object) => {
            res.status(500).json({ erreur: "Une erreur est survenue lors de la récupération des tâches de l'utilisateur 😕", error });
        });
};

export default {
    createUserCustomTask,
    createUserDailyTasks,
    getUserTasks,
    changeTitleCustomTask,
    deleteCustomTask,
    removeActiveDaily,
    validateDailyTask,
};
