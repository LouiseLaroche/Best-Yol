import { NextFunction, Request, Response } from "express";
import { DailyTasks, PrismaClient, UserTasks } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

import { getRandomElements } from "../utils/getRandomElements";

const prisma = new PrismaClient();

export const createUserCustomTask = async (req: Request, res: Response) => {
    const { title } = req.body;
    const { userId } = req.params;

    prisma.userTasks
        .create({
            data: {
                title,
                isDaily: false,
                isCompleted: false,
                completedAt: null,
                createdAt: new Date(),
                userId: parseInt(userId, 10),
            },
        })
        .then((userTask) => {
            res.status(201).json({ userTask, message: "Tâche créée 🥳🎉" });
        })
        .catch(() => {
            res.status(500).json({ erreur: "Erreur lors de la création de la tâche 😕" });
        });
};

export const createUserDailyTasks = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    let responseSent = false; // Variable pour suivre si une réponse a déjà été envoyée

    prisma.userTasks
        .findFirst({
            where: {
                userId: parseInt(userId, 10),
                isDaily: true,
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        })
        .then((existingDailyTasks: any | null): Promise<any> => {
            if (existingDailyTasks) {
                responseSent = true; // Mettre la variable à true pour indiquer qu'une réponse a été envoyée
                res.status(500).json({ erreur: "Les tâches quotidiennes ont déjà été assignées à cet utilisateur aujourd'hui" });
                throw new Error("Response sent"); // Lancer une erreur pour sauter les blocs `then` suivants
            }

            return prisma.dailyTasks.findMany();
        })
        .then((dailyTasks: DailyTasks[]): Promise<any[]> => {
            const randomTasks = getRandomElements(dailyTasks, 6);
            const userTasks = randomTasks.map((task) => {
                return prisma.userTasks.create({
                    data: {
                        userId: parseInt(userId, 10),
                        title: task.title,
                        isDaily: true,
                        createdAt: new Date(),
                        isCompleted: false,
                        completedAt: null,
                        dailyTaskId: task.id,
                    },
                });
            });

            return Promise.all(userTasks);
        })
        .then((createdTasks: UserTasks[]) => {
            if (!responseSent) {
                // Vérifier si une réponse a déjà été envoyée avant de renvoyer une réponse réussie
                res.status(201).json({ message: "Tâches quotidiennes assignées 🥳🎉", createdTasks });
            }
        })
        .catch((error) => {
            if (error.message !== "Response sent") {
                // Vérifier si l'erreur est due à une réponse déjà envoyée
                res.status(500).json({ erreur: error });
            }
        });
};

export const getUserTasks = async (req: Request, res: Response) => {
    const { userId } = req.params;

    prisma.userTasks
        .findMany({
            where: {
                userId: parseInt(userId, 10),
            },
            include: {
                dailyTask: true,
            },
        })
        .then((userTasks) => {
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
        .catch(() => {
            res.status(500).json({ erreur: "Une erreur est survenue lors de la récupération des tâches de l'utilisateur 😕" });
        });
};

export default {
    createUserCustomTask,
    createUserDailyTasks,
    getUserTasks,
};
