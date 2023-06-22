import { PrismaClient, DailyTasks, UserTasks } from "@prisma/client";
import { getRandomElements } from "./getRandomElements";

const prisma = new PrismaClient();

export async function newActiveDaily(count: number): Promise<DailyTasks[]> {
    const tasks: DailyTasks[] = await prisma.dailyTasks.findMany();
    const selectedTasks: DailyTasks[] = getRandomElements(tasks, count);

    await prisma.dailyTasks.updateMany({
        where: {
            id: {
                in: selectedTasks.map((task) => task.id),
            },
        },
        data: {
            isActive: true,
        },
    });

    const updatedTasks = await prisma.dailyTasks.findMany({
        where: {
            isActive: true,
        },
    });

    return updatedTasks;
}

export async function reverseIsActiveDaily(): Promise<string> {
    await prisma.dailyTasks.updateMany({
        where: {
            isActive: true,
        },
        data: {
            isActive: false,
        },
    });

    return "Les tâches quotidiennes actives ont bien été désactivée 🥳🎉";
}
