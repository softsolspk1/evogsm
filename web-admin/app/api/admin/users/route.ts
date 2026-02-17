import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  try {
    const users = await prisma.user.findMany({
      where: role ? { role: { equals: role, mode: "insensitive" } } : {},
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        emailVerified: true,
        employeeCode: true,
        cityId: true,
        city: { select: { name: true } },
        areaId: true,
        area: { select: { name: true } },
        distributorId: true,
        primaryDistributor: { select: { name: true } },
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, name, password, role, employeeCode, cityId, areaId, distributorId } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${process.env.NEON_AUTH_BASE_URL}/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin:
            process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split("@")[0],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create account");
    }

    // Update the newly created user with custom fields
    await prisma.user.update({
      where: { email },
      data: {
        role: role || "user",
        employeeCode,
        cityId,
        areaId,
        distributorId,
        isVerified: true, // Auto-verify accounts created by Admin
        emailVerified: true
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const prismaUpdates: any = { ...updates };

    // Auto-map is_verified to isVerified if present
    if ('is_verified' in updates) {
      prismaUpdates.isVerified = updates.is_verified;
      delete prismaUpdates.is_verified;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: prismaUpdates,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
