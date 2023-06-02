import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

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
        return res.status(400).json({ erreur: "Le nom d'utilisteur existe déjà " });
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
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    // on utilise notre modèle mongoose User avec notre méthode findOne pour pouvoir comparer les infos de l'utilisateur entrées dans le client (req.body) et stockées dans notre bdd
    // User.findOne({ email: req.body.email })
    //     .then(user => {
    //         // on commence par vérifier si l'email existe en base de donnée (en renvoyant une erreur floue pour ne pas donner trop d'info à un potentiel hacker)
    //         if (user === null) {
    //             // 401 = unauthorized
    //             res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
    //         } else {
    //             // si l'email existe, on compare alors le hash du mdp entré par l'utilisateur au hash du mdp stocké en bdd grâce au package bcrypt et sa methode compare, toujours avec une erreur floue si différent
    //             bcrypt.compare(req.body.password, user.password)
    //                 .then(valid => {
    //                     if (!valid) {
    //                         res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
    //                     } else {
    //                         res.status(200).json({
    //                             userId: user._id,
    //                             token: jwt.sign(
    //                                 { userId: user._id },
    //                                 'RANDOM_TOKEN_SECRET',
    //                                 { expiresIn: '24h' },
    //                             ),
    //                         });
    //                     }
    //                 })
    //                 .catch(error => {
    //                     res.status(500).json({ error });
    //                 });
    //         }
    //     })
    //     .catch(error => {
    //         res.status(500).json({ error });
    //     })
};
