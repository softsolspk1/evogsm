import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const passwordHash = await bcrypt.hash("password123", 10);

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
                version: "1.0.3-force-eval",
                hasDbUrl: !!process.env.DATABASE_URL,
                dbUrlType: typeof process.env.DATABASE_URL,
                timestamp: "2026-02-18T11:45:00Z"
            },
            users: [
                { email: admin.email, role: admin.role, password: "password123" },
                { email: subAdmin.email, role: subAdmin.role, password: "password123" },
            ],
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            debug: {
                version: "1.0.3-force-eval",
                hasDbUrl: !!process.env.DATABASE_URL,
                dbUrlType: typeof process.env.DATABASE_URL
            }
        }, { status: 500 });
    }
}
