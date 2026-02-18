import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Sets up WebSocket class, which isn't available in Node.js environment
neonConfig.webSocketConstructor = ws;

// FINAL PERMANENT HOTFIX: Use a uniquely named variable to avoid Vercel env collision
const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString: PERMANENT_DB_URL });
const adapter = new PrismaNeon(pool as any);

export const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

// Cache is disabled for this hotfix to ensure direct evaluation on Vercel
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
