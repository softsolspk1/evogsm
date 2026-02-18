import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    // Version 8000: Corrected Manual HTTP Seeding (Correct Schema: neon_auth)
    const PERMANENT_DB_URL = "postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
    const sql = neon(PERMANENT_DB_URL);

    try {
        const passwordHash = await bcrypt.hash("password123", 10);
        const now = new Date().toISOString();

        console.log("Starting Manual HTTP Seed Version 8000...");

        // 1. Ensure Admin User exists in neon_auth.user
        await sql`
            INSERT INTO neon_auth.user (id, email, name, role, "isVerified", "emailVerified", "updatedAt")
            VALUES (gen_random_uuid(), 'admin1@example.com', 'Admin User', 'ADMIN', true, true, ${now})
            ON CONFLICT (email) DO UPDATE SET 
                role = 'ADMIN', 
                "isVerified" = true;
        `;

        // 2. Ensure Admin Account exists in neon_auth.account
        await sql`
            INSERT INTO neon_auth.account (id, "userId", "providerId", "accountId", password, "updatedAt")
            SELECT gen_random_uuid(), id, 'credential', 'admin1@example.com', ${passwordHash}, ${now}
            FROM neon_auth.user WHERE email = 'admin1@example.com'
            ON CONFLICT ("userId", "providerId") DO UPDATE SET 
                password = ${passwordHash}, 
                "updatedAt" = ${now};
        `;

        // 3. Ensure Sub Admin User exists
        await sql`
            INSERT INTO neon_auth.user (id, email, name, role, "isVerified", "emailVerified", "updatedAt")
            VALUES (gen_random_uuid(), 'subadmin@test.com', 'Sub Admin Test', 'SUB_ADMIN', true, true, ${now})
            ON CONFLICT (email) DO UPDATE SET 
                role = 'SUB_ADMIN', 
                "isVerified" = true;
        `;

        // 4. Ensure Sub Admin Account exists
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
            message: "Users seeded successfully via direct HTTP (Version 8000)",
            debug: {
                version: "8000-MANUAL-HTTP-CORRECTED",
                timestamp: now
            }
        }, {
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    } catch (error: any) {
        console.error("Manual Seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            debug: {
                version: "8000-MANUAL-HTTP-CORRECTED",
                hint: "Check schema and table names."
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
