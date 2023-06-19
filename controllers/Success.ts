import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSuccess = async (req: Request, res: Response, next: NextFunction) => {
    prisma.success.findMany()
        .then(success => res.status(200).json({ success }))
        .catch(error => res.status(404).json({ message : 'Succès introuvables 😢', error }));
};

export default {
    getAllSuccess,
};
