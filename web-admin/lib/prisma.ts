import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

// FINAL VERSION 6000: HTTP DRIVER
// This version uses the Neon HTTP driver which is extremely stable on Vercel.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Mandatory for Prisma internal checks
process.env.DATABASE_URL = PERMANENT_DB_URL;

const sql = neon(PERMANENT_DB_URL);
const adapter = new PrismaNeon(sql as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
