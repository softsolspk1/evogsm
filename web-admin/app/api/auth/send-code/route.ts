import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();

  try {
    const { email: bodyEmail } = await request.json().catch(() => ({}));
    const email = bodyEmail || session?.user.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const response = await fetch(
      `${process.env.NEON_AUTH_BASE_URL}/email-otp/send-verification-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin:
            process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "",
        },
        body: JSON.stringify({
          email: email,
          type: "email-verification",
        }),
      },
    );

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Verification code sent to your email",
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to send code" },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
