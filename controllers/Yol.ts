import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

import { incrementEvolveSuccess } from "../utils/incrementEvolveSuccess";

//* POST
export const createYol = async (req: Request, res: Response) => {
    const { name, userId, speciesId }: { name: string; userId: number; speciesId: number } = req.body;

    if (!name || !userId || !speciesId) {
        return res.status(400).json({
            erreur: "Certains champs requis sont absents du corps de la requête",
            example: {
                name: "Pierre",
                userId: 327,
                speciesId: 3,
            },
        });
    }

    try {
        const yol = await prisma.yol.create({
            data: {
                name: req.body.name,
                xp: 0,
                userId: req.body.userId,
                speciesId: req.body.speciesId,
            },
            include: {
                species: true,
            },
        });

        return res.status(200).json({ yol });
    } catch (error: any) {
        return res.status(404).json({ erreur: error });
    }
};

//* GET
export const getOneYol = async (req: Request, res: Response) => {
    const yolId: string = req.params.yolId;

    if (!yolId) {
        return res.status(400).json({ erreur: "yolId est absent des paramètres de la requête" });
    }

    if (isNaN(parseInt(yolId, 10))) {
        return res.status(400).json({ erreur: "yolId doit être un nombre valide" });
    }

    try {
        const yol = await prisma.yol.findUnique({
            where: {
                id: parseInt(yolId, 10),
            },
            include: {
                species: true,
            },
        });

        return res.status(200).json({ yol });
    } catch (error: any) {
        return res.status(404).json({ erreur: error });
    }
};

export const getOneYolByUserId = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    if (!userId) {
        res.status(400).json({ erreur: "userId est absent des paramètres de la requête" });
        return;
    }

    if (isNaN(parseInt(userId, 10))) {
        res.status(400).json({ erreur: "yolId doit être un nombre valide" });
        return;
    }

    try {
        const yol = await prisma.yol.findMany({
            where: {
                userId: parseInt(userId, 10),
            },
            include: {
                species: true,
            },
        });

        if (yol.length === 0) {
            return res.status(404).json({ message: "Cet utilisateur ne possède pas de Yol !" });
        }

        return res.status(200).json(yol[0]);
    } catch (error: any) {
        return res.status(404).json({ erreur: error });
    }
};

//* PATCH
export const evolve = async (req: Request, res: Response) => {
    const yolId: string = req.params.yolId;

    if (!yolId) {
        res.status(400).json({ erreur: "yolId est absent des paramètres de la requête" });
        return;
    }

    if (isNaN(parseInt(yolId, 10))) {
        res.status(400).json({ erreur: "yolId doit être un nombre valide" });
        return;
    }

    try {
        const yolInfo = await prisma.yol.findFirst({
            where: {
                id: parseInt(yolId, 10),
            },
            include: {
                species: true,
            },
        });

        switch (yolInfo?.species.stage) {
            case "Egg":
                try {
                    const matchingSpeciesBabyStage = await prisma.species.findFirst({
                        where: {
                            name: yolInfo?.species.name,
                            stage: "Baby",
                        },
                    });

                    const yolBaby = await prisma.yol.update({
                        where: {
                            id: parseInt(yolId, 10),
                        },
                        data: {
                            speciesId: matchingSpeciesBabyStage?.id,
                        },
                    });

                    const successUpdateResponse = await incrementEvolveSuccess(yolInfo.userId, "Egg");

                    res.json({ message: "Votre Yol a éclos !", successUpdateResponse });
                } catch (error: any) {
                    return res.status(500).json({ erreur: "Espèce introuvable", error });
                }
                break;

            case "Baby":
                try {
                    const matchingSpeciesAdolescentStage = await prisma.species.findFirst({
                        where: {
                            name: yolInfo?.species.name,
                            stage: "Adolescent",
                        },
                    });

                    const yolAdo = await prisma.yol.update({
                        where: {
                            id: parseInt(yolId, 10),
                        },
                        data: {
                            speciesId: matchingSpeciesAdolescentStage?.id,
                        },
                        include: {
                            species: true,
                        },
                    });

                    const successUpdateResponse = await incrementEvolveSuccess(yolInfo.userId, "Baby");

                    res.json({ message: "Votre Yol est passé au stade d'adolescent !", successUpdateResponse });
                } catch (error: any) {
                    return res.status(500).json({ erreur: "Espèce introuvable", error });
                }
                break;

            case "Adolescent":
                try {
                    const matchingSpeciesFinalStage = await prisma.species.findFirst({
                        where: {
                            name: yolInfo?.species.name,
                            stage: "Final",
                        },
                    });

                    const yolFinal = await prisma.yol.update({
                        where: {
                            id: parseInt(yolId, 10),
                        },
                        data: {
                            speciesId: matchingSpeciesFinalStage?.id,
                        },
                        include: {
                            species: true,
                        },
                    });

                    const successUpdateResponse = await incrementEvolveSuccess(yolInfo.userId, "Adolescent");

                    res.json({ message: "Votre Yol est passé au stade final !", successUpdateResponse });
                } catch (error: any) {
                    return res.status(500).json({ erreur: "Espèce introuvable", error });
                }
                break;

            case "Final":
                res.json({ message: "Votre Yol est au stade final, il ne peut plus évoluer !" });
                break;

            default:
                res.json({ message: "default case" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An internal server error occurred" });
    }
};

export default {
    createYol,
    getOneYol,
    getOneYolByUserId,
    evolve,
};
