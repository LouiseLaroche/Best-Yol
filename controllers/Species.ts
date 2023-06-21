import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSpecies = async (req: Request, res: Response) => {
    prisma.species.findMany()
        .then(species => {
            if (species === null) {
                return res.status(404).json({ message : 'Espèces introuvables 😢' });
            }
            return res.status(200).json({ species });
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

export default {
    getAllSpecies
};
