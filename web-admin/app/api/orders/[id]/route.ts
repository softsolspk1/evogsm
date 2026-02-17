import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { data: session } = await auth.getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ error: "Missing Order ID" }, { status: 400 });
    }

    try {
        const { status } = await request.json();
        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                kam: { select: { name: true, email: true } },
                distributor: { select: { name: true, email: true } },
            }
        });

        // TODO: Send Notifications based on status change
        // If status === "CONFIRMED", notify Distributor and KAM

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
