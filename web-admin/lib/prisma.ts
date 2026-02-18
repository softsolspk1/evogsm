import "./env-init"; // MUST BE FIRST TO BEAT HOISTING ENGINE INIT
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// VERSION 17000: THE PROJECT MANAGER'S UNIFIED STABILIZER
// This version uses the Adapter in ALL environments to avoid engine-type conflicts
// and uses the early-boot env-init to satisfy the native validator.

neonConfig.webSocketConstructor = ws;

const DB_URL = process.env.DATABASE_URL!;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  console.log("💎 [Prisma] v17000: Initializing Unified Adapter with Bootstrapped Env");

  const pool = new Pool({ connectionString: DB_URL });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
