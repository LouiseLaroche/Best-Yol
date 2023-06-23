import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* POST
export const createYol = async (req: Request, res: Response) => {
    prisma.yol.create({
        data: {
            name: req.body.name,
            xp: 0,
            userId: req.body.userId,
            speciesId: req.body.speciesId,
        },
        include: {
            species: true,
        },
    })
    .then((yol) => res.status(200).json({ yol }))
    .catch(error => res.status(404).json({ erreur: error }));
};

//* GET
export const getOneYol = async (req: Request, res: Response) => {
    prisma.yol.findUnique({        
        where: {
            id: parseInt(req.params.yolId, 10),
        },
        include: {
            species: true,
        },
    })
        .then((yol) => res.status(200).json({ yol }))
        .catch(error => res.status(404).json({ erreur: error }));
};

export const getOneYolByUserId = async (req: Request, res: Response) => {
    prisma.yol.findMany({        
        where: {
            userId: parseInt(req.params.userId, 10),
        },
        include: {
            species: true,
        },
    })
        .then((yol) => {
            if (yol.length === 0) {
                return res.status(404).json({ message : 'Cet utilisateur ne possède pas de Yol !' });
            }
            res.status(200).json(yol[0])
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

//* PATCH
export const evolve = async (req: Request, res: Response) => {
    const yolId: string = req.params.yolId;

    try {
        const yolInfo = await prisma.yol.findUnique({
            where: {
                id: parseInt(yolId, 10),
            },
            include: {
                species: true
            }
        });

        switch (yolInfo?.species.stage) {
            case "Egg":
                const matchingSpeciesBabyStage = await prisma.species.findFirst({
                    where: {
                        name: yolInfo?.species.name,
                        stage: "Baby"
                    }
                })
                
                const yolBaby = await prisma.yol.update({
                    where: {
                        id: parseInt(yolId, 10),
                    },
                    data: {
                        speciesId: matchingSpeciesBabyStage?.id,
                    },
                });
                
                res.json({ message: "Votre Yol a éclos !!" });
              break;

            case "Baby":
                const matchingSpeciesAdolescentStage = await prisma.species.findFirst({
                    where: {
                        name: yolInfo?.species.name,
                        stage: "Adolescent"
                    }
                })
                
                const yolAdo = await prisma.yol.update({
                    where: {
                        id: parseInt(yolId, 10),
                    },
                    data: {
                        speciesId: matchingSpeciesAdolescentStage?.id,
                    },
                    include: {
                        species: true
                    }
                });

              res.json({ message: "Votre Yol est passé au stade d'adolescent !!" });
              break;

            case "Adolescent":
                const matchingSpeciesFinalStage = await prisma.species.findFirst({
                    where: {
                        name: yolInfo?.species.name,
                        stage: "Final"
                    }
                })
                
                const yolFinal = await prisma.yol.update({
                    where: {
                        id: parseInt(yolId, 10),
                    },
                    data: {
                        speciesId: matchingSpeciesFinalStage?.id,
                    },
                    include: {
                        species: true
                    }
                });

                res.json({ message: "Votre Yol est passé au stade final !!" });
              break;

            case "Final":
                res.json({ message: "Votre Yol est au stade final, il ne peut plus évoluer !!" });
                break;

            default:
              res.json({ message: "default case"});
          }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An internal server error occurred" });
    }
}

export default {
    createYol,
    getOneYol,
    getOneYolByUserId,
    evolve,
};
