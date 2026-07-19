import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const runtime = "nodejs";

type UsageResult = {
  allowed?: boolean;
  plan?: string;
  remaining?: number;
  reason?: string;
};

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const email =
      typeof token?.email === "string"
        ? token.email.toLowerCase().trim()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          code: "AUTH_REQUIRED",
          message: "Please sign in with Google to analyze your resume.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin.rpc(
      "consume_resume_analysis",
      {
        p_user_id: email,
      }
    );

    if (error) {
      console.error("Access check failed:", error);

      return NextResponse.json(
        {
          success: false,
          allowed: false,
          code: "ACCESS_CHECK_FAILED",
          message: "Unable to verify your plan. Please try again.",
        },
        { status: 500 }
      );
    }

    const usage = data as UsageResult | null;

    if (!usage?.allowed) {
      return NextResponse.json(
        {
          success: true,
          allowed: false,
          code: "FREE_DAILY_LIMIT_REACHED",
          message:
            "You have used today’s free resume analysis. Upgrade to Pro for unlimited analyses, job matches, resume tailoring, cover letters and premium exports.",
          plan: "free",
          remaining: 0,
          upgradeRequired: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      allowed: true,
      plan: usage.plan || "free",
      remaining: usage.remaining ?? 0,
      jobMatchLimit: usage.plan === "free" ? 3 : null,
    });
  } catch (error) {
    console.error("Access route error:", error);

    return NextResponse.json(
      {
        success: false,
        allowed: false,
        code: "ACCESS_CHECK_FAILED",
        message: "Unable to verify access. Please try again.",
      },
      { status: 500 }
    );
  }
}