import { prisma } from "./prismaClient";

export async function incrementEvolveSuccess(userId: number, formerStage: string) {
    switch (formerStage) {
        case "Egg":
            try {
                const matchingEggEvolutionSuccess = await prisma.success.findFirst({
                    where: {
                        title: "Sorti de l'oeuf",
                    },
                });

                const matchingEggEvolutionUserSuccess = await prisma.userSuccess.findFirst({
                    where: {
                        successId: matchingEggEvolutionSuccess?.id,
                        userId: userId,
                    },
                });

                if (matchingEggEvolutionUserSuccess?.actualAmount !== undefined && matchingEggEvolutionSuccess?.amountNeeded !== undefined) {
                    if (matchingEggEvolutionUserSuccess.actualAmount < matchingEggEvolutionSuccess.amountNeeded) {
                        await prisma.userSuccess.update({
                            where: {
                                id: matchingEggEvolutionUserSuccess?.id,
                            },
                            data: {
                                actualAmount: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                }
            } catch (error: any) {
                return {
                    message: "Erreur au moment d'incrémenter le succès utilisateur 'Sorti de l'oeuf'",
                    error,
                };
            }
            break;

        case "Baby":
            try {
                const matchingBabyEvolutionSuccess = await prisma.success.findFirst({
                    where: {
                        title: "Mini Yol",
                    },
                });

                const matchingBabyEvolutionUserSuccess = await prisma.userSuccess.findFirst({
                    where: {
                        successId: matchingBabyEvolutionSuccess?.id,
                        userId: userId,
                    },
                });

                if (matchingBabyEvolutionUserSuccess?.actualAmount !== undefined && matchingBabyEvolutionSuccess?.amountNeeded !== undefined) {
                    if (matchingBabyEvolutionUserSuccess.actualAmount < matchingBabyEvolutionSuccess.amountNeeded) {
                        await prisma.userSuccess.update({
                            where: {
                                id: matchingBabyEvolutionUserSuccess?.id,
                            },
                            data: {
                                actualAmount: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                }
            } catch (error: any) {
                return {
                    message: "Erreur au moment d'incrémenter le succès utilisateur 'Mini Yol'",
                    error,
                };
            }
            break;

        case "Adolescent":
            try {
                const matchingAdoEvolutionSuccess = await prisma.success.findFirst({
                    where: {
                        title: "Grand Yol",
                    },
                });

                const matchingAdoEvolutionUserSuccess = await prisma.userSuccess.findFirst({
                    where: {
                        successId: matchingAdoEvolutionSuccess?.id,
                        userId: userId,
                    },
                });

                if (matchingAdoEvolutionUserSuccess?.actualAmount !== undefined && matchingAdoEvolutionSuccess?.amountNeeded !== undefined) {
                    if (matchingAdoEvolutionUserSuccess.actualAmount < matchingAdoEvolutionSuccess.amountNeeded) {
                        await prisma.userSuccess.update({
                            where: {
                                id: matchingAdoEvolutionUserSuccess?.id,
                            },
                            data: {
                                actualAmount: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                }
            } catch (error: any) {
                return {
                    message: "Erreur au moment d'incrémenter le succès utilisateur 'Grand Yol'",
                    error,
                };
            }
            break;
        default:
            return { message: "Aucun succès pour ce stade de Yol" };
    }
}
