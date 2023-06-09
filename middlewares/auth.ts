import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        next();
    } catch(error) {
        res.status(401).json({ erreur: 'Accès non autorisé' });
    }
};