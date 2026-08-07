import { NextResponse } from "next/server";
import { MOCK_ADMIN_USER } from "@/lib/constants";
import { env, getAllowedStaffEmails } from "@/lib/env";
import { signStaffToken } from "@/lib/jwt";

const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 5;

    const rateData = rateLimitMap.get(ip);
    if (rateData) {
      if (now > rateData.resetTime) {
        rateLimitMap.set(ip, { attempts: 1, resetTime: now + windowMs });
      } else if (rateData.attempts >= maxAttempts) {
        return NextResponse.json(
          { message: "Too many login attempts. Please try again in 15 minutes." },
          { status: 429 }
        );
      } else {
        rateData.attempts += 1;
      }
    } else {
      rateLimitMap.set(ip, { attempts: 1, resetTime: now + windowMs });
    }

    const body = await request.json();
    const { email, passcode } = body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const allowedEmails = getAllowedStaffEmails();

    if (!allowedEmails.includes(normalizedEmail)) {
      return NextResponse.json({ message: "Invalid staff credentials." }, { status: 401 });
    }

    if (!passcode || passcode !== env.STAFF_PASSCODE) {
      return NextResponse.json({ message: "Invalid passcode." }, { status: 401 });
    }

    const token = signStaffToken(
      { sub: MOCK_ADMIN_USER.id, email: normalizedEmail, name: MOCK_ADMIN_USER.name },
      env.AUTH_SECRET
    );

    const response = NextResponse.json({
      user: { ...MOCK_ADMIN_USER, email: normalizedEmail },
      message: "Authentication successful.",
    });

    response.cookies.set({
      name: "nirmal_cmd_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Authentication server error." }, { status: 500 });
  }
}
