import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// VERSION 19000: THE PROJECT MANAGER'S UNIFIED STABILIZER (FINAL)
// Hardcoded schema URL (schema.prisma) + Mandatory Neon Adapter.
// This satisfies both the Native Engine's validation and the Client-only runtime.

neonConfig.webSocketConstructor = ws;

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Aggressive env injection (just in case)
process.env.DATABASE_URL = DB_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  console.log("💎 [Prisma] v19000: Initializing Unified Adapter (Fixed Speed)");

  const pool = new Pool({ connectionString: DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
