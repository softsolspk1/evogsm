import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// FINAL PERMANENT FIX: Version 5000
// This version uses the mandatory adapter required by Prisma 7 on Vercel,
// but forces the environment variable injection at the top level.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// HARD INJECTION: Both as a constant and an environment variable
const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
process.env.DATABASE_URL = PERMANENT_DB_URL;

// Required for Neon serverless in Node.js environments
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: PERMANENT_DB_URL });
const adapter = new PrismaNeon(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

// Restore global instance check to fix "SyntaxError" and instability on localhost
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
