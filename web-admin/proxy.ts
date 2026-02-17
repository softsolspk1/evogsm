import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const { data: session } = await auth.getSession();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const u = session.user as any;
    const isVerified = u?.is_verified || u?.email_verified || u?.emailVerified;

    if (
      session &&
      !isVerified &&
      !request.nextUrl.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/verify", request.url));
    }

    if (
      pathname.startsWith("/admin") &&
      (session.user as any).role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    if ((session.user as any).role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/verify",
  ],
};
