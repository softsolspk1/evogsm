import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// VERSION 9000: DEFINITIVE PM FIX
// This version uses explicit constructor injection for Vercel 
// and restores the singleton pattern for Localhost stability.

neonConfig.webSocketConstructor = ws;

const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Guarantee environment variable presence
process.env.DATABASE_URL = PERMANENT_DB_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: PERMANENT_DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    // EXPLICIT INJECTION: This is the ONLY way to guarantee Prisma 7 reads the URL on Vercel
    datasourceUrl: PERMANENT_DB_URL,
    log: ["query", "error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
