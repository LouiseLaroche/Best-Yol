import { z } from "zod";

export const SignUpSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères" })
            .max(30, { message: "Le nom d'utilisateur ne doit pas contenir plus de 30 caractères" }),
        email: z.string().email({ message: "L'email doit être un email valide" }),
        password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    }),
});

export const LoginSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères" })
            .max(30, { message: "Le nom d'utilisateur ne doit pas contenir plus de 30 caractères" }),
        password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    }),
});
