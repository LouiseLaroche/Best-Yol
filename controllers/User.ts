import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import userSuccess from "../controllers/UserSuccess";

import { AuthenticatedRequest } from "../middlewares/idValidation";

import { prisma } from "../utils/prismaClient";
import { generateAccessToken } from "../utils/auth/generateAccessToken";
import { generateRefreshToken } from "../utils/auth/generateRefreshToken";

export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUsername = await prisma.users.findUnique({ where: { username } });
        const existingEmail = await prisma.users.findUnique({ where: { email } });

        if (existingUsername != null) {
            return res.status(400).json({ erreur: "Le nom d'utilisateur existe déjà" });
        }

        if (existingEmail != null) {
            return res.status(400).json({ erreur: "L'email existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                pp: "/assets/avatars/Icon1.png",
            },
            select: {
                id: true,
                username: true,
                email: true,
                pp: true,
                banner: true,
                createdAt: true,
            },
        });

        await userSuccess.createUserSuccess(user.id);

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        return res.status(201).json({
            user,
            message: "Inscription réussie! 🥳🎊",
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error: any) {
        return res.status(500).json({ erreur: error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                pp: true,
                createdAt: true,
                password: true,
            },
        });

        if (user === null) {
            return res.status(401).json({ erreur: "Identifiants non valides 😢" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        if (passwordMatch) {
            const { password: _, ...userWithoutPassword } = user;

            return res.status(200).json({
                user: userWithoutPassword,
                message: "Connexion réussie! 🥳",
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            return res.status(401).json({ erreur: "Identifiants non valides 😢" });
        }
    } catch (error: any) {
        return res.status(500).json({ erreur: error });
    }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId: string = req.params.userId;

    if (isNaN(parseInt(userId, 10))) {
        res.status(400).json({ erreur: "Le paramètre userId doit être un nombre valide" });
        return;
    }

    try {
        const user = await prisma.users.findUnique({ where: { id: parseInt(userId, 10) } });

        if (user === null) {
            return res.status(404).json({ erreur: "Utilisateur non trouvé 😢" });
        }

        res.status(200).json({
            id: user.id,
            pp: user.pp,
            banner: user.banner,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (error: any) {
        res.status(500).json({ erreur: error });
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    try {
        if (!token) {
            throw Object.assign(new Error("Pas de token, pas d'autorisation"), { status: 401 });
        }

        const decodedToken = jwt.verify(token as string, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;

        const userId = decodedToken.userId as string;

        const user = await prisma.users.findUnique({ where: { id: parseInt(userId, 10) } });

        if (!user) {
            throw Object.assign(new Error("Erreur d'authentification"), { status: 401 });
        }

        const refreshedToken = await generateAccessToken(parseInt(userId, 10));
        res.status(200).send({ accessToken: refreshedToken });
    } catch (error: any) {
        return res.status(error.status || 500).json({ erreur: error.message });
    }
};

export default {
    signup,
    login,
    getUser,
    refreshAccessToken,
};
