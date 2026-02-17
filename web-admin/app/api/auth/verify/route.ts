import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();

  try {
    const { otp, email: bodyEmail } = await request.json();
    const email = bodyEmail || session?.user.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const verifyPayload = {
      email,
      otp: otp,
    };

    const response = await fetch(
      `${process.env.NEON_AUTH_BASE_URL}/email-otp/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin:
            process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "",
        },
        body: JSON.stringify(verifyPayload),
      },
    );

    if (response.ok) {
      await sql`UPDATE neon_auth.user SET is_verified = true, "emailVerified" = true WHERE email = ${email}`;
      return NextResponse.json({ success: true });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid or expired code" },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
