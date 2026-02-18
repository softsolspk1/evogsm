import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

// VERSION 12000: THE PROJECT MANAGER STABILIZER
// This version manually loads environment variables to guarantee Localhost stability.

dotenv.config();

neonConfig.webSocketConstructor = ws;

const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Force the URL into process.env to satisfy Prisma's internal engine checks
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
  process.env.DATABASE_URL = PERMANENT_DB_URL;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["query", "error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
