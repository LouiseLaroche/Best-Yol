import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const existingUsername = await prisma.users.findUnique({
        where: {
            username,
        },
    });

    const existingEmail = await prisma.users.findUnique({
        where: {
            email,
        },
    });

    if (existingUsername != null) {
        return res.status(400).json({ erreur: "Le nom d'utilisateur existe déjà" });
    }

    if (existingEmail != null) {
        return res.status(400).json({ erreur: "L'email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    return res.status(201).json({ user: username, email: email, message: "Inscription réussie! 🥳🎊" });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (user === null) {
            return res.status(401).json({ erreur: "Identifiants non valides 😢" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN as string, {
            expiresIn: "12h",
        });

        if (passwordMatch) {
            return res.status(200).json({ userId: user.id, token, message: "Connexion réussie! 🥳" });
        } else {
            return res.status(401).json({ erreur: "Identifiants non valides 😢" });
        }
    } catch (error) {
        res.status(500).json({ erreur: error });
    }
};

exports.getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.users.findUnique({
        where: {
            id: parseInt(req.params.id, 10),
        },
    });

    if (user === null) {
        return res.status(404).json({ erreur: "Utilisateur non trouvé 😢" });
    } else {
        return res.status(200).json({
            id: user.id,
            pp: user.pp,
            banner: user.banner,
            email: user.email,
            username: user.username,
        });
    }
};
