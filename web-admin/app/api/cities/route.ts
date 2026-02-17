import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { areas: true } } }
        });
        return NextResponse.json(cities);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { data: session } = await auth.getSession();

    if (session?.user && (session.user as any).role?.toLowerCase() !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const city = await prisma.city.create({
            data: { name }
        });
        return NextResponse.json(city, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "City already exists or invalid data" }, { status: 500 });
    }
}
