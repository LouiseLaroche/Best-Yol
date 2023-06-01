import express, { Express, NextFunction, Request, Response } from "express";

// routes import

// call express method to create express app
const app: Express = express();

// connect to server ?

// use express json method to translate json from client 🙃
app.use(express.json());

// cors middleware
// could be app.use(cors()) if needed 🤓
// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//     next();
// });

// routes
// example: app.use("/api/auth", userRoutes)

app.use("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send("coucou");
});

export default app;
