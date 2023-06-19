import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSuccess = async (req: Request, res: Response) => {
    prisma.success.findMany()
        .then(success => {
            if (success === null) {
            return res.status(404).json({ message : 'Succès introuvables 😢' });
            }
            res.status(200).json({ success });
        })
        .catch(error => res.status(404).json({ error }));
};

export const getOneSuccess = async (req: Request, res: Response) => {
    prisma.success.findUnique({ where: { id: parseInt(req.params.id, 10) }})
        .then(success => {
          if (success === null) {
            return res.status(404).json({ message : 'Succès introuvable 😢' });
          }
          res.status(200).json({ ...success });
        })
        .catch(error => res.status(404).json({ error }));
};

export default {
    getAllSuccess,
    getOneSuccess,
};
