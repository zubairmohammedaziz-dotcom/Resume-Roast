import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          isPro: false,
          plan: "free",
          status: "inactive",
          error: "Not authenticated.",
        },
        {
          status: 401,
          headers: noCacheHeaders,
        }
      );
    }

    const { data: subscriptions, error } = await supabaseAdmin
      .from("subscriptions")
      .select(
        "id, user_email, plan, status, current_period_end, cancel_at_period_end, created_at"
      )
      .eq("user_email", email)
      .limit(1);

    if (error) {
      console.error("Supabase subscription lookup failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        email,
      });

      return NextResponse.json(
        {
          isPro: false,
          plan: "free",
          status: "inactive",
          error: error.message,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint,
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    const subscription = subscriptions?.[0] ?? null;

    if (!subscription) {
      return NextResponse.json(
        {
          isPro: false,
          plan: "free",
          status: "inactive",
          email,
          reason: "No subscription was found for this email.",
        },
        {
          status: 200,
          headers: noCacheHeaders,
        }
      );
    }

    const plan = String(subscription.plan ?? "")
      .trim()
      .toLowerCase();

    const status = String(subscription.status ?? "")
      .trim()
      .toLowerCase();

    const validPlans = ["pro", "pro_monthly"];
    const validStatuses = ["active", "authenticated"];

    let isExpired = false;

    if (subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);

      if (!Number.isNaN(periodEnd.getTime())) {
        isExpired = periodEnd.getTime() <= Date.now();
      }
    }

    const isPro =
      validPlans.includes(plan) &&
      validStatuses.includes(status) &&
      !isExpired;

    return NextResponse.json(
      {
        isPro,
        plan: isPro ? "pro" : "free",
        subscriptionPlan: plan,
        status,
        email,
        currentPeriodEnd: subscription.current_period_end ?? null,
        cancelAtPeriodEnd:
          subscription.cancel_at_period_end ?? false,
        expired: isExpired,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown subscription-status error.";

    console.error("Subscription status route error:", error);

    return NextResponse.json(
      {
        isPro: false,
        plan: "free",
        status: "inactive",
        error: message,
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}