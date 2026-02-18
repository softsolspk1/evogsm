import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// VERSION 14000: THE PROJECT MANAGER'S UNIFIED STABILIZER
// This version provides the mandatory adapter for Prisma 7 client-engine compatibility.

neonConfig.webSocketConstructor = ws;

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
const DIRECT_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Top-level environment variable injection.
// This is critical for Prisma's internal detection logic.
process.env.DATABASE_URL = DB_URL;
process.env.DIRECT_URL = DIRECT_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  console.log("💎 [Prisma] Initializing Unified Neon Adapter (v14000)");

  // Create a pool for the adapter
  const pool = new Pool({ connectionString: DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

// Use the global singleton pattern to prevent connection pool exhaustion on Localhost
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
