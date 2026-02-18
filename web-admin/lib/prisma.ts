import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// VERSION 20000: THE PROJECT MANAGER'S DEFINITIVE ARCHITECTURE
// This solves the Prisma 7 "No URL in schema" requirement and restores 100% stability.
// It uses a unified adapter strategy to prevent engine-type conflicts in Next.js.

neonConfig.webSocketConstructor = ws;

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Aggressive env injection to ensure all internal Prisma validators are satisfied.
process.env.DATABASE_URL = DB_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  console.log("💎 [Prisma] v20000: Initializing Definitive Unified Architecture");

  // In Prisma 7, when url is moved out of schema.prisma, the adapter is mandatory.
  // This pool is shared as a singleton via the global object in development.
  const pool = new Pool({ connectionString: DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
