import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Sets up WebSocket class, which isn't available in Node.js environment
neonConfig.webSocketConstructor = ws;

// FORCED HOTFIX: Use hardcoded string primarily to guarantee connectivity
const rawConnectionString = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const connectionString = rawConnectionString.replace(/^["']|["']$/g, "");

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);

export const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
