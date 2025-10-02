
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
