import { PrismaClient } from "@prisma/client";

// Create a singleton instance of the Prisma client
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export default prisma;
