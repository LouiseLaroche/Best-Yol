import express, { Express, NextFunction, Request, Response } from "express";

// routes import

// on appelle la méthode express pour créer une application express
const app: Express = express();

// connect to server ?

// Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le body JSON. Pour ça, on a juste besoin d'un middleware très simple, mis à disposition par le framework Express, juste après la déclaration de la constante app :
app.use(express.json());

// Middleware pour les cors
// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//     next();
// });

// routes
// app.use("/api/auth", userRoutes)

app.use("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send("coucou");
});

export default app;
