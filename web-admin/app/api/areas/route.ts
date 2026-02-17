import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");

    try {
        const areas = await prisma.area.findMany({
            where: cityId ? { cityId } : {},
            orderBy: { name: "asc" },
            include: { city: true }
        });
        return NextResponse.json(areas);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { data: session } = await auth.getSession();

    if (session?.user && (session.user as any).role?.toLowerCase() !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, cityId } = await request.json();
        if (!name || !cityId) return NextResponse.json({ error: "Name and cityId are required" }, { status: 400 });

        const area = await prisma.area.create({
            data: { name, cityId }
        });
        return NextResponse.json(area, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Area already exists or invalid data" }, { status: 500 });
    }
}
