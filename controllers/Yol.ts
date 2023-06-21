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

export const getOneYol = async (req: Request, res: Response) => {
    prisma.yol.findUnique({        
        where: {
            id: parseInt(req.params.id, 10),
        },
        include: {
            species: true,
        },
    })
        .then((yol) => res.status(200).json({ yol }))
        .catch(error => res.status(404).json({ erreur: error }));
};

export const getAllYolByUserId = async (req: Request, res: Response) => {
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
            res.status(200).json({ yol })
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

export default {
    createYol,
    getOneYol,
    getAllYolByUserId,
};
