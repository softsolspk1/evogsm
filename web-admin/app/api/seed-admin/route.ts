import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    // VERSION 9000: RAW HTTP BACKDOOR
    // This bypasses Prisma entirely to guarantee user creation on Vercel.
    const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
    const sql = neon(PERMANENT_DB_URL);

    try {
        const passwordHash = await bcrypt.hash("password123", 10);
        const now = new Date().toISOString();

        console.log("Starting Version 9000 Definitive Seed...");

        // 1. Force Admin User in neon_auth schema
        await sql`
            INSERT INTO neon_auth.user (id, email, name, role, "isVerified", "emailVerified", "updatedAt")
            VALUES (gen_random_uuid(), 'admin1@example.com', 'Admin User', 'ADMIN', true, true, ${now})
            ON CONFLICT (email) DO UPDATE SET 
                role = 'ADMIN', 
                "isVerified" = true,
                "updatedAt" = ${now};
        `;

        // 2. Force Admin Account in neon_auth schema
        await sql`
            INSERT INTO neon_auth.account (id, "userId", "providerId", "accountId", password, "updatedAt")
            SELECT gen_random_uuid(), id, 'credential', 'admin1@example.com', ${passwordHash}, ${now}
            FROM neon_auth.user WHERE email = 'admin1@example.com'
            ON CONFLICT ("userId", "providerId") DO UPDATE SET 
                password = ${passwordHash}, 
                "updatedAt" = ${now};
        `;

        // 3. Force Sub Admin User
        await sql`
            INSERT INTO neon_auth.user (id, email, name, role, "isVerified", "emailVerified", "updatedAt")
            VALUES (gen_random_uuid(), 'subadmin@test.com', 'Sub Admin Test', 'SUB_ADMIN', true, true, ${now})
            ON CONFLICT (email) DO UPDATE SET 
                role = 'SUB_ADMIN', 
                "isVerified" = true,
                "updatedAt" = ${now};
        `;

        // 4. Force Sub Admin Account
        await sql`
            INSERT INTO neon_auth.account (id, "userId", "providerId", "accountId", password, "updatedAt")
            SELECT gen_random_uuid(), id, 'credential', 'subadmin@test.com', ${passwordHash}, ${now}
            FROM neon_auth.user WHERE email = 'subadmin@test.com'
            ON CONFLICT ("userId", "providerId") DO UPDATE SET 
                password = ${passwordHash}, 
                "updatedAt" = ${now};
        `;

        return NextResponse.json({
            success: true,
            message: "Users seeded definitively via Version 9000 Backdoor.",
            debug: {
                version: "9000-DEFINITIVE-FIX",
                timestamp: now
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error: any) {
        console.error("Definitive Seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            debug: {
                version: "9000-DEFINITIVE-FIX",
                hint: "Direct connection failed. Verify Neon DB accessibility."
            }
        }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    }
}
