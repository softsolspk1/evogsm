import { PrismaClient } from "@prisma/client";

// FINAL PERMANENT HOTFIX: Bypassing adapter entirely to test direct TCP connection
const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// We set the process.env directly just in case Prisma Client 7 looks for it.
process.env.DATABASE_URL = PERMANENT_DB_URL;

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});
