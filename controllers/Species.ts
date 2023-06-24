import { Request, Response } from "express";
import { PrismaClient, Species } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSpecies = async (_req: Request, res: Response) => {
    try {
        const species: Species[] = await prisma.species.findMany();

        if (species === null) {
            return res.status(404).json({ message: "Espèces introuvables 😢" });
        }

        return res.status(200).json({ species });
    } catch (error: any) {
        return res.status(404).json({ erreur: error });
    }
};

export default {
    getAllSpecies,
};
