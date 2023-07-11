import { z } from "zod";

export const SignUpSchema = z.object({
    body: z.object({
        username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
        email: z.string().email({ message: "L'email doit être un email valide" }),
        password: z.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, {
            message: "Le mot de passe doit contenir au minimum 8 caractères un nombre et un caractère spécial",
        }),
    }),
});

export const LoginSchema = z.object({
    body: z.object({
        username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
        password: z.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, {
            message: "Le mot de passe doit contenir au minimum 8 caractères, un nombre et un caractère spécial",
        }),
    }),
});
