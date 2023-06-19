import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUsername = await prisma.users.findUnique({ where: { username } });
    const existingEmail = await prisma.users.findUnique({ where: { email } });

    if (existingUsername != null) {
        return res.status(400).json({ erreur: "Le nom d'utilisateur existe déjà" });
    }

    if (existingEmail != null) {
        return res.status(400).json({ erreur: "L'email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    prisma.users.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    })
        .then(() => res.status(201).json({ user: username, email: email, message: "Inscription réussie! 🥳🎊" }))
        .catch(error => res.status(500).json({ erreur: error }));
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    prisma.users.findUnique({ where: { username } })
        .then(user => {
            if (user === null) {
                return res.status(401).json({ erreur: "Identifiants non valides 😢" });
            }
    
            bcrypt.compare(password, user.password)
                .then(passwordMatch => {
                    if (passwordMatch) {
                        return res.status(200).json({ 
                            userId: user.id, 
                            token: jwt.sign({ userId: user.id }, process.env.JWT_TOKEN as string, {
                                expiresIn: "12h",
                            }),
                            message: "Connexion réussie! 🥳" });
                    } else {
                        return res.status(401).json({ erreur: "Identifiants non valides 😢" });
                    }
                })
                .catch(error => res.status(500).json({ erreur: error }));
        })
        .catch(error => res.status(500).json({ erreur: error }));
};

export const getUser = async (req: Request, res: Response) => {
    prisma.users.findUnique({ where: { id: parseInt(req.params.id, 10) }})
        .then(user => {
            if (user === null) {
                return res.status(404).json({ erreur: "Utilisateur non trouvé 😢" });
            }
            res.status(200).json({
                id: user.id,
                pp: user.pp,
                banner: user.banner,
                email: user.email,
                username: user.username,
            });
        })
        .catch(error => res.status(404).json({ error }));
};

export default {
    signup,
    login,
    getUser,
};
