import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// FINAL VERSION 8000: Robust Restoration
// Restoring the original Pool-based connection which worked locally,
// but with the hardcoded fallback to guarantee Vercel connectivity.

neonConfig.webSocketConstructor = ws;

const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
process.env.DATABASE_URL = PERMANENT_DB_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: PERMANENT_DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["query", "error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
