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
            orderId,
            region,
            city,
            area,
            referredBy,
            referralEmployeeCode,
            referralTeam,
            doctorName,
            doctorCode,
            distributorName,
            patientArea,
            sensorInstalledBy,
            visitDate,
            visitTime,
            numDevices,
            patientEmail,
            patientWhatsApp,
            activationDate,
            comments,
            serialNumber,
            kamReminder
        } = body;

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Fetch the order to get patient name and KAM details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { kam: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const installation = await prisma.deviceInstallation.create({
            data: {
                orderId,
                kamName: order.kam?.name || "Unknown",
                kamEmployeeCode: order.kam?.employeeCode || "0000",
                region,
                city,
                area,
                referredBy,
                referralEmployeeCode,
                referralTeam,
                doctorName,
                doctorCode,
                distributorName,
                patientName: order.patientName,
                patientArea,
                sensorInstalledBy,
                visitDate,
                visitTime,
                numDevices: parseInt(numDevices) || 1,
                patientEmail,
                patientWhatsApp,
                activationDate,
                comments,
                serialNumber,
                kamReminder: !!kamReminder,
            },
        });

        // Mark order as COMPLETED
        await prisma.order.update({
            where: { id: orderId },
            data: { status: "COMPLETED" }
        });

        return NextResponse.json(installation, { status: 201 });
    } catch (error: any) {
        console.error("Error submitting installation form:", error);
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        );
    }
}
