// species - dailytasks - success

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

//daily tasks
async function main() {
    const water = await prisma.dailyTasks.upsert({
        where: { title: "Boire de l'eau" },
        update: {},
        create: {
            title: "Boire de l'eau",
            category: "Besoin vitaux",
            difficulty: 1,
            xp: 10,
        },
    })

    const healthyCooking = await prisma.dailyTasks.upsert({
        where: { title: "Préparer et manger un repas sain" },
        update: {},
        create: {
            title: "Préparer et manger un repas sain",
            category: "Besoin vitaux",
            difficulty: 3,
            xp: 40,
        },
    })

    const hydrationControl = await prisma.success.upsert({
        where: { title: "Maîtrise de l'hydratation" },
        update: {},
        create: {
            title: "Maîtrise de l'hydratation",
            description: "Boire de l'eau 25 fois",
            amountNeeded: 25,
            successXp: 200,
        },
    })

    const chef = await prisma.success.upsert({
        where: { title: "Chef·fe cuistot" },
        update: {},
        create: {
            title: "Chef·fe cuistot",
            description: "Préparer un repas sain et équilibré 15 fois",
            amountNeeded: 15,
            successXp: 200,
        },
    })

    console.log({ hydrationControl, chef }, { water, healthyCooking })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
