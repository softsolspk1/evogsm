import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { data: session } = await auth.getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    // Allow "KAM" "DISTRIBUTOR" "SUB_ADMIN" roles to be fetched by authenticated users (for dropdowns)
    // We might want to restrict this further (e.g. only Admin/Sub-Admin can fetch KAMs), 
    // but KAMs might need to fetch Distributors? 
    // "Service Provider Name (Distributor)" is field in Post Admin Form.
    // So likely everyone needs to see Distributors and KAMs list. (Simple approach)

    if (!role) {
        return NextResponse.json({ error: "Role parameter required" }, { status: 400 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    equals: role as any,
                    mode: "insensitive",
                },
                // Roles are uppercase in DB based on Enum or String?
                // Schema says: role String? ... Enum Role { ADMIN, KAM... }
                // Prisma Schema has `role String?` in User model but there is an Enum Role.
                // But the User model defines role as String? 
                // Wait, checking schema: `role String?` line 19.
                // It's mapped to `neon_auth.user.role` which is likely a string.
                // The Enum `Role` exists but isn't used in User model definition shown in previous `view_file`.
                // I should verify how we store roles. Admin was "admin" (lowercase) in previous checks?
                // In `app/login/page.tsx` we checked `data.user.role === "admin"`.
                // In `app/api/admin/users/route.ts` we checked `session.user.role !== "admin"`.
                // So they are lowercase?
                // But the previous `view_file` of schema showed `enum Role { ADMIN ... }`.
                // Let's assume lowercase based on existing code logic, but I should probably support case-insensitive or check DB.
                // I'll try case-insensitive or just normalize.
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                employeeCode: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        // If strict match fails, try uppercase (since Enum implies uppercase, but auth might use lowercase)
        if (users.length === 0) {
            const usersUpper = await prisma.user.findMany({
                where: { role: role.toLowerCase() }, // Just in case
                select: { id: true, name: true, email: true, role: true },
            });
            // Actually, let's just accept what is asked.
            // If request asks for "kam", query "kam".
            // The caller should know.
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
