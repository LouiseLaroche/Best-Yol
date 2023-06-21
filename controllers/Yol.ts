import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export default {
    createYol,
};
