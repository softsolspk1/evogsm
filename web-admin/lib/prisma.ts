import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// FINAL VERSION 3000 INIT
// This pattern is optimized for Vercel/Next.js with Neon

if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: DB_URL,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaNeon(pool as any);

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});
