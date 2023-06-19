import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSuccess = async (req: Request, res: Response) => {
    prisma.success.findMany()
        .then(success => {
            if (success === null) {
                return res.status(404).json({ message : 'Succès introuvables 😢' });
            }
            return res.status(200).json({ success });
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

export const getOneSuccess = async (req: Request, res: Response) => {
    prisma.success.findUnique({ where: { id: parseInt(req.params.id, 10) }})
        .then(success => {
          if (success === null) {
            return res.status(404).json({ message : 'Succès introuvable 😢' });
          }
          return res.status(200).json({ ...success });
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

export default {
    getAllSuccess,
    getOneSuccess,
};
