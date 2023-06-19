import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (!token) return res.status(401).json({ erreur: "Accès non autorisé" });
        jwt.verify(token, process.env.JWT_TOKEN as string);
        next();
    } catch (error) {
        res.status(401).json({ erreur: "Accès non autorisé" });
    }
};
