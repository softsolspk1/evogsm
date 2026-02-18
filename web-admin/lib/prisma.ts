import { PrismaClient } from "@prisma/client";

// VERSION 13000: PROJECT MANAGER'S DEFINITIVE RESTORATION
// This version restores the "Fast Localhost" behavior while maintaining Vercel compatibility.

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
const DIRECT_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Top-level environment variable injection for both JS and Rust/Native layers.
// This ensures that Prisma engine discovers the URL even if shell env is missing.
process.env.DATABASE_URL = DB_URL;
process.env.DIRECT_URL = DIRECT_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // 1. DEVELOPMENT MODE: Use the Native Prisma Engine.
  // This is 10X faster on Localhost because it avoids WebSocket/HTTP overhead.
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 [Prisma] MODE: Fast Localhost (Native Engine)");
    return new PrismaClient({
      log: ["error"],
    });
  }

  // 2. PRODUCTION MODE: Use the Neon HTTP Adapter.
  // This is required for Vercel Serverless to prevent connection parameter loss.
  try {
    console.log("☁️ [Prisma] MODE: Vercel Production (Neon Adapter)");
    const { Pool } = require("@neondatabase/serverless");
    const { PrismaNeon } = require("@prisma/adapter-neon");

    const pool = new Pool({ connectionString: DB_URL });
    const adapter = new PrismaNeon(pool as any);

    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  } catch (e) {
    console.warn("⚠️ [Prisma] WARN: Neon Adapter load failed. Falling back to Native Engine.", e);
    return new PrismaClient({
      log: ["error"],
    });
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
