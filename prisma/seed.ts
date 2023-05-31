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

    const physicalActivity = await prisma.dailyTasks.upsert({
        where: { title: "Faire 10 minutes d'activités physique" },
        update: {},
        create: {
            title: "Faire 10 minutes d'activités physique",
            category: "Sport",
            difficulty: 3,
            xp: 40,
        },
    })

    const readSomePages = await prisma.dailyTasks.upsert({
        where: { title: "Lire quelques pages d'un livre" },
        update: {},
        create: {
            title: "Lire quelques pages d'un livre",
            category: "Apprentissage",
            difficulty: 2,
            xp: 20,
        },
    })

    const meditate = await prisma.dailyTasks.upsert({
        where: { title: "Méditer pendant 10 minutes" },
        update: {},
        create: {
            title: "Méditer pendant 10 minutes",
            category: "Relaxation",
            difficulty: 1,
            xp: 10,
        },
    })

    const learnSomethingNew = await prisma.dailyTasks.upsert({
        where: { title: "Apprendre quelque chose de nouveau" },
        update: {},
        create: {
            title: "Apprendre quelque chose de nouveau",
            category: "Apprentissage",
            difficulty: 3,
            xp: 40,
        },
    })

    const walkOutside = await prisma.dailyTasks.upsert({
        where: { title: "Sortir dehors 30 minutes" },
        update: {},
        create: {
            title: "Sortir dehors 30 minutes",
            category: "Sport",
            difficulty: 4,
            xp: 60,
        },
    })

    const stayInTouch = await prisma.dailyTasks.upsert({
        where: { title: "Contacter un proche" },
        update: {},
        create: {
            title: "Contacter un proche",
            category: "Besoin vitaux",
            difficulty: 1,
            xp: 10,
        },
    })

    const cookSomethingNew = await prisma.dailyTasks.upsert({
        where: { title: "Cuisiner quelque chose de nouveau" },
        update: {},
        create: {
            title: "Cuisiner quelque chose de nouveau",
            category: "Apprentissage",
            difficulty: 3,
            xp: 40,
        },
    })

    const stretchYourself = await prisma.dailyTasks.upsert({
        where: { title: "Faire des étirements" },
        update: {},
        create: {
            title: "Faire des étirements",
            category: "Relaxation",
            difficulty: 2,
            xp: 20,
        },
    })

    const cleanTheHouse = await prisma.dailyTasks.upsert({
        where: { title: "Faire un brin de ménage" },
        update: {},
        create: {
            title: "Faire un brin de ménage",
            category: "Corvée",
            difficulty: 4,
            xp: 60,
        },
    })

    const treatYourself = await prisma.dailyTasks.upsert({
        where: {
            title: "Prendre un moment pour s'occuper de soi",
        },
        update: {},
        create: {
            title: "Prendre un moment pour s'occuper de soi",
            category: "Relaxation",
            difficulty: 3,
            xp: 40,
        },
    })

    const doSomethingCreative = await prisma.dailyTasks.upsert({
        where: {
            title: "Faire quelque chose de créatif",
        },
        update: {},
        create: {
            title: "Faire quelque chose de créatif",
            category: "Relaxation",
            difficulty: 4,
            xp: 60,
        },
    })

    const musicListening = await prisma.dailyTasks.upsert({
        where: {
            title: "Écouter de la musique",
        },
        update: {},
        create: {
            title: "Écouter de la musique",
            category: "Relaxation",
            difficulty: 1,
            xp: 10,
        },
    })

    // success
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

    const bodybuilder = await prisma.success.upsert({
        where: { title: "Bodybuilder" },
        update: {},
        create: {
            title: "Bodybuilder",
            description: 'Accomplir la tâche "Faire 10 minutes d\'activité physique" 15 fois',
            amountNeeded: 15,
            successXp: 200,
        },
    })

    const bookworm = await prisma.success.upsert({
        where: { title: "Rat de bibliothèque" },
        update: {},
        create: {
            title: "Rat de bibliothèque",
            description: 'Accomplir la tâche "Lire quelques pages d\'un livre" 20 fois',
            amountNeeded: 20,
            successXp: 200,
        },
    })

    const meditationPro = await prisma.success.upsert({
        where: { title: "Pro de la méditation" },
        update: {},
        create: {
            title: "Pro de la méditation",
            description: 'Accomplir la tâche "Méditer 10 minutes" 25 fois',
            amountNeeded: 25,
            successXp: 200,
        },
    })

    const curiousScholar = await prisma.success.upsert({
        where: { title: "Savant curieux.se" },
        update: {},
        create: {
            title: "Savant curieux.se",
            description: "Apprendre quelque chose de nouveau 15 fois",
            amountNeeded: 15,
            successXp: 200,
        },
    })

    const closeToNature = await prisma.success.upsert({
        where: { title: "Proche de la Nature" },
        update: {},
        create: {
            title: "Proche de la Nature",
            description: 'Accomplir la tâche "Sortir dehors 30 minutes" 10 fois',
            amountNeeded: 10,
            successXp: 200,
        },
    })

    const perfectFriend = await prisma.success.upsert({
        where: { title: "L'Ami·e idéal·e" },
        update: {},
        create: {
            title: "L'Ami·e idéal·e",
            description: "Prendre contact avec un ami ou un membre de la famille 25 fois",
            amountNeeded: 25,
            successXp: 200,
        },
    })

    const stretchinator = await prisma.success.upsert({
        where: { title: "Stretchinator" },
        update: {},
        create: {
            title: "Stretchinator",
            description: 'Accomplir la tâche "S\'étirer pendant 5 minutes" 20 fois',
            amountNeeded: 20,
            successXp: 200,
        },
    })

    const broomMaster = await prisma.success.upsert({
        where: { title: "Domination du balai" },
        update: {},
        create: {
            title: "Domination du balai",
            description: "Faire le ménage 10 fois",
            amountNeeded: 10,
            successXp: 200,
        },
    })

    const relaxationGuru = await prisma.success.upsert({
        where: { title: "Gourou de la Relaxation" },
        update: {},
        create: {
            title: "Gourou de la Relaxation",
            description: "Prendre un moment pour soi 15 fois",
            amountNeeded: 15,
            successXp: 200,
        },
    })

    const virtuoso = await prisma.success.upsert({
        where: { title: "Virtuose" },
        update: {},
        create: {
            title: "Virtuose",
            description: "Pratiquer une compétence artistique 10 fois",
            amountNeeded: 10,
            successXp: 200,
        },
    })

    const absolutePitch = await prisma.success.upsert({
        where: { title: "Oreille absolue" },
        update: {},
        create: {
            title: "Oreille absolue",
            description: "Avoir écouté de la musique 25 fois",
            amountNeeded: 25,
            successXp: 200,
        },
    })

    const questMaster = await prisma.success.upsert({
        where: { title: "Quest Master" },
        update: {},
        create: {
            title: "Quest Master",
            description: "Finir un total de 100 tâches quotidiennes",
            amountNeeded: 100,
            successXp: 300,
        },
    })

    const selfRuling = await prisma.success.upsert({
        where: { title: "Autonome" },
        update: {},
        create: {
            title: "Autonome",
            description: "Créer et compléter une première tâche personnalisée",
            amountNeeded: 1,
            successXp: 20,
        },
    })

    const perfectionist = await prisma.success.upsert({
        where: { title: "Perfectionniste" },
        update: {},
        create: {
            title: "Perfectionniste",
            description: "Terminer toutes les tâches quotidiennes d'une journée",
            amountNeeded: 1,
            successXp: 100,
        },
    })

    const buddingBond = await prisma.success.upsert({
        where: { title: "Lien naissant" },
        update: {},
        create: {
            title: "Lien naissant",
            description: "Passer son Yol au niveau 3",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    const growingComplicity = await prisma.success.upsert({
        where: { title: "Complicité grandissante" },
        update: {},
        create: {
            title: "Complicité grandissante",
            description: "Passer son Yol au niveau 10",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    const faithfulCompanion = await prisma.success.upsert({
        where: { title: "Compagnon fidèle" },
        update: {},
        create: {
            title: "Compagnon fidèle",
            description: "Passer son Yol au niveau 20",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    const unshakableFriendship = await prisma.success.upsert({
        where: { title: "Amitié inébranlable" },
        update: {},
        create: {
            title: "Amitié inébranlable",
            description: "Passer son Yol au niveau 30",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    const eternalFriendship = await prisma.success.upsert({
        where: { title: "Amitié éternelle" },
        update: {},
        create: {
            title: "Amitié éternelle",
            description: "Passer son Yol au niveau 40",
            amountNeeded: 1,
            successXp: 0,
        },
    })

    const hatching = await prisma.success.upsert({
        where: { title: "Sorti de l'oeuf" },
        update: {},
        create: {
            title: "Sorti de l'oeuf",
            description: "Faire éclore son Yol",
            amountNeeded: 1,
            successXp: 10,
        },
    })

    const miniYol = await prisma.success.upsert({
        where: { title: "Mini Yol" },
        update: {},
        create: {
            title: "Mini Yol",
            description: "Evoluer une première fois son Yol",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    const greatYol = await prisma.success.upsert({
        where: { title: "Grand Yol" },
        update: {},
        create: {
            title: "Grand Yol",
            description: "Evoluer une seconde fois son Yol",
            amountNeeded: 1,
            successXp: 50,
        },
    })

    console.log(
        {
            hydrationControl,
            chef,
            bodybuilder,
            bookworm,
            meditationPro,
            curiousScholar,
            closeToNature,
            perfectFriend,
            stretchinator,
            broomMaster,
            relaxationGuru,
            virtuoso,
            absolutePitch,
            questMaster,
            selfRuling,
            perfectionist,
            buddingBond,
            growingComplicity,
            faithfulCompanion,
            unshakableFriendship,
            eternalFriendship,
            hatching,
            miniYol,
            greatYol,
        },
        {
            water,
            healthyCooking,
            physicalActivity,
            readSomePages,
            meditate,
            learnSomethingNew,
            walkOutside,
            stayInTouch,
            cookSomethingNew,
            stretchYourself,
            cleanTheHouse,
            treatYourself,
            doSomethingCreative,
            musicListening,
        }
    )
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
