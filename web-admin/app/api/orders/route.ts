import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { data: session } = await auth.getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            patientName,
            patientPhone,
            patientCity,
            homeAddress,
            doctorPrescribe,
            deviceQuantity,
            kamId,
            distributorId,
        } = body;

        // Validation
        if (!patientName || !patientPhone || !patientCity || !homeAddress) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Role-based logic for auto-assignment or validation
        let finalKamId = kamId;
        let finalSubAdminId = null;

        const role = (session.user as any).role; // Assuming role is on user object

        if (role === "KAM") {
            finalKamId = session.user.id; // KAM creates order for themselves
        } else if (role === "SUB_ADMIN") {
            finalSubAdminId = session.user.id;
        }
        // Admin can assign any kamId

        const newOrder = await prisma.order.create({
            data: {
                patientName,
                patientPhone,
                patientCity,
                homeAddress,
                doctorPrescribe,
                deviceQuantity: deviceQuantity ? parseInt(deviceQuantity) : 1,
                kamId: finalKamId,
                distributorId: distributorId, // Assigned distributor
                subAdminId: finalSubAdminId,
                status: "PENDING",
            },
        });

        // TODO: Send Notifications to KAM and Distributor

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { data: session } = await auth.getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const distributorId = searchParams.get("distributorId");
    const kamId = searchParams.get("kamId");

    try {
        const whereClause: any = {};

        // Status filter
        if (status) {
            whereClause.status = status;
        }

        // City filter (by patientCity string)
        if (city) {
            whereClause.patientCity = { contains: city, mode: "insensitive" };
        }

        // Distributor filter
        if (distributorId) {
            whereClause.distributorId = distributorId;
        }

        // KAM filter
        if (kamId) {
            whereClause.kamId = kamId;
        }

        // Role-based filtering (Security/Access Control)
        if (role === "KAM") {
            whereClause.kamId = userId;
        } else if (role === "DISTRIBUTOR") {
            whereClause.distributorId = userId;
        } else if (role === "SUB_ADMIN" || role === "ADMIN") {
            // Admin and Sub-Admin see all, filters already applied above
        } else {
            // For any other role or undefined role, show all orders (treat as admin)
            // This allows flexibility for new roles without breaking the app
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                kam: {
                    select: { name: true, email: true },
                },
                distributor: {
                    select: { name: true, email: true },
                },
                subAdmin: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
