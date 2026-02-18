import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const passwordHash = await bcrypt.hash("password123", 10);

        // Debug info BEFORE query
        console.log("Seeding attempt starting Version 4000...");

        const admin = await prisma.user.upsert({
            where: { email: "admin1@example.com" },
            update: { role: "ADMIN", isVerified: true, emailVerified: true },
            create: {
                email: "admin1@example.com",
                name: "Admin User",
                role: "ADMIN",
                isVerified: true,
                emailVerified: true,
                account: {
                    create: {
                        providerId: "credential",
                        accountId: "admin1@example.com",
                        password: passwordHash,
                        updatedAt: new Date(),
                    },
                },
            },
        });

        const subAdmin = await prisma.user.upsert({
            where: { email: "subadmin@test.com" },
            update: { role: "SUB_ADMIN", isVerified: true, emailVerified: true },
            create: {
                email: "subadmin@test.com",
                name: "Sub Admin Test",
                role: "SUB_ADMIN",
                isVerified: true,
                emailVerified: true,
                account: {
                    create: {
                        providerId: "credential",
                        accountId: "subadmin@test.com",
                        password: passwordHash,
                        updatedAt: new Date(),
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Users seeded successfully",
            debug: {
                version: "4000-DIRECT-STABLE",
                db_url_check: process.env.DATABASE_URL ? "SET" : "MISSING",
                timestamp: new Date().toISOString()
            },
            users: [
                { email: admin.email, role: admin.role, password: "password123" },
                { email: subAdmin.email, role: subAdmin.role, password: "password123" },
            ],
        }, {
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            debug: {
                version: "4000-DIRECT-STABLE",
                db_url_check: process.env.DATABASE_URL ? "SET" : "MISSING",
                error_name: error.name
            }
        }, {
            status: 500,
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    }
}
