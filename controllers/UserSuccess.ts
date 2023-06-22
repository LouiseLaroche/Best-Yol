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

export const validateSuccess = async (req: Request, res: Response) => {
    const userSuccessId = req.params.id;
    const yolId = req.body.yolId;

    // Vérifier que le UserSuccess n'a pas déjà été validé
    prisma.userSuccess.findUnique({ where: { id: parseInt(userSuccessId, 10) }})
        .then((userSuccess) => {
            if (userSuccess === null) {
                return res.status(404).json({ message: "Succès utilisateur introuvable 😢" });
            } else if (userSuccess.isCompleted === true) {
                return res.status(500).json({ message: "Le succès utilisateur a déjà été complété" });
            }
            // Récupérer le succès correspondant au successId dans la table Success
            prisma.success.findUnique({ where: { id: userSuccess.successId }})
                .then((matchingSuccess) => {
                    if (userSuccess.actualAmount !== matchingSuccess?.amountNeeded) {
                        return res.status(500).json({ message: 
                            "Le montant requis pour valider le succès n'a pas été atteint",
                            "montant actuel": userSuccess.actualAmount,
                            "montant requis": matchingSuccess?.amountNeeded
                        })
                    }
                    // Passer isCompleted de UserSuccess à true
                    prisma.userSuccess.update({
                        where: {
                            id: parseInt(userSuccessId, 10),
                        },
                        data: {
                            isCompleted: true,
                        },
                    })
                        .then(() => {
                            // Update l'xp du Yol en ajoutant la valeur de successXp
                            prisma.yol.update({
                                where : {
                                    id: yolId
                                },
                                data: {
                                    xp: {
                                        increment: matchingSuccess.successXp,
                                      },
                                },
                            })
                                .then((yol) => {
                                    return res.status(200).json({ message: "Votre Yol a gagné de l'expérience !", yol });
                                })
                                .catch((error) => {
                                    res.status(500).json({ erreur: "Erreur lors de l'attribution de l'xp du succès au Yol", error });
                                });
                        })
                        .catch((error) => {
                            res.status(500).json({ erreur: "Erreur lors de la mise à jour du succès utilisateur", error });
                        });

                })
                .catch((error) => {
                    res.status(500).json({ erreur: "Erreur au moment de trouver le succès correspondant", error });
                });
        })
        .catch((error) => res.status(500).json({ erreur: "Erreur au moment de trouver le succès utilisateur", error }));
}

export default {
    createUserSuccess,
    getAllUserSuccessByUserId,
    validateSuccess,
};
