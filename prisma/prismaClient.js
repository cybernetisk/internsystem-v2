
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma ?? new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// const bruh = new PrismaClient()

// bruh.workGroup.create({
//   data: {
//     name
//   }
// })