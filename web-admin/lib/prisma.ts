import { PrismaClient } from "@prisma/client";

// VERSION 16000: THE PROJECT MANAGER'S DEFINITIVE RECOVERY
// This version restores the "Fast Localhost" behavior while maintaining Vercel compatibility.
// We forced engineType="library" in schema.prisma to ensure native binary performance.

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
const DIRECT_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Top-level environment variable injection for engine discovery.
process.env.DATABASE_URL = DB_URL;
process.env.DIRECT_URL = DIRECT_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // 1. LOCALHOST DEVELOPMENT: Use Native Engine (MAXIMUM PERFORMANCE)
  // This is how it worked 8 hours ago. It bypasses all serverless overhead.
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 [Prisma] DEFINITIVE RECOVERY: Native Engine (Fast Mode)");
    return new PrismaClient({
      log: ["error"],
    });
  }

  // 2. VERCEL PRODUCTION: Use Neon Adapter (STABLE SERVERLESS)
  try {
    console.log("☁️ [Prisma] PRODUCTION: Neon Adapter Activated");
    const { Pool, neonConfig } = require("@neondatabase/serverless");
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const ws = require("ws");

    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: DB_URL });
    const adapter = new PrismaNeon(pool as any);

    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  } catch (e) {
    console.warn("⚠️ [Prisma] Adapter fallback to Native Engine", e);
    return new PrismaClient({
      log: ["error"],
    });
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
