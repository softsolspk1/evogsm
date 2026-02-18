import { PrismaClient } from "@prisma/client";

// FINAL PERMANENT HOTFIX: Version 4000
// Reverting to direct Prisma connection to bypass any issues with serverless adapters

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Force environment variable for Prisma's internal check
process.env.DATABASE_URL = DB_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
