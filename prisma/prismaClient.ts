
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma: PrismaClient = globalThis.prisma ?? new PrismaClient({adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL})});

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
