import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

// FINAL RE-INIT: Version 7000
// This version uses the most robust singleton pattern for Next.js

const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Set environment variable immediately to prevent Prisma from reading stale system defaults
process.env.DATABASE_URL = PERMANENT_DB_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const sql = neon(PERMANENT_DB_URL);
  const adapter = new PrismaNeon(sql);

  return new PrismaClient({
    adapter,
    log: ["query"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
