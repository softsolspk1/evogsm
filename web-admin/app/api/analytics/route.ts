import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [
            todayOrders,
            monthlyOrders,
            kamPerformance,
            cityReports,
            distributorReports,
            inventoryStatus,
            referralDetails,
            doctorPerformance,
        ] = await Promise.all([
            // Today's Orders
            prisma.order.count({
                where: { createdAt: { gte: today } },
            }),
            // Monthly Orders
            prisma.order.count({
                where: { createdAt: { gte: firstDayOfMonth } },
            }),
            // KAM's performance
            prisma.user.findMany({
                where: { role: "KAM" },
                select: {
                    name: true,
                    _count: {
                        select: { orders: { where: { status: "COMPLETED" } } },
                    },
                },
            }),
            // City Wise Reporting
            prisma.order.groupBy({
                by: ["patientCity"],
                _count: { _all: true },
            }),
            // Distributor Reporting
            prisma.user.findMany({
                where: { role: "DISTRIBUTOR" },
                select: {
                    name: true,
                    _count: {
                        select: { assignedOrders: true },
                    },
                },
            }),
            // Inventory Status (Total sensors installed)
            prisma.deviceInstallation.aggregate({
                _sum: { numDevices: true },
            }),
            // Referral Team Stats
            prisma.deviceInstallation.groupBy({
                by: ["referralTeam"],
                _count: { _all: true },
            }),
            // Doctors prescribed
            prisma.deviceInstallation.groupBy({
                by: ["doctorName"],
                _count: { _all: true },
            }),
        ]);

        return NextResponse.json({
            todayOrders,
            monthlyOrders,
            kamPerformance,
            cityReports,
            distributorReports,
            inventoryStatus: inventoryStatus._sum.numDevices || 0,
            referralDetails,
            doctorPerformance,
        });
    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
