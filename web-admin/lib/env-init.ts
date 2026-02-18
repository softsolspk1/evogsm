// VERSION 17000: PROJECT MANAGER'S BOOTSTRAPPER
// This file MUST be imported before anything that uses Prisma.

const DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

process.env.DATABASE_URL = DB_URL;
process.env.DIRECT_URL = DB_URL;

console.log("🛠️ [Env] DATABASE_URL injected at boot.");
