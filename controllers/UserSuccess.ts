import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserSuccess = async (userId: number) => {
    prisma.success.findMany()
        .then(allSuccess => {
            return allSuccess.forEach(success => {
                prisma.userSuccess.create({
                    data: {
                        actualAmount: 0,
                        isCompleted: false,
                        userId: userId,
                        successId: success.id
                    },
                })
                .catch(error => console.log("error create:", error));
            });
        })
        .catch(error => console.log("error findMany:", error));
};

export const getAllUserSuccessByUserId = async (req: Request, res: Response) => {    
    prisma.userSuccess.findMany({
        where: {
          userId: parseInt(req.params.userId, 10),
        },
        include: {
            success: true,
        },
    })
        .then(userSuccess => {
            if (userSuccess.length === 0) {
                return res.status(404).json({ message : 'Succès introuvables pour cet utilisateur 😢' });
            }
            return res.status(200).json({ userSuccess });
        })
        .catch(error => res.status(404).json({ erreur: error }));
};

export const getOneUserSuccess = async (req: Request, res: Response) => {
    // prisma.userSuccess.findUnique({ where: { id: parseInt(req.params.id, 10) }})
    //     .then(userSuccess => {
    //       if (userSuccess === null) {
    //         return res.status(404).json({ message : 'Succès introuvable pour cet utilisateur 😢' });
    //       }
    //       return res.status(200).json({ ...userSuccess });
    //     })
    //     .catch(error => res.status(404).json({ erreur: error }));
};

export default {
    createUserSuccess,
    getAllUserSuccessByUserId,
    getOneUserSuccess,
};
