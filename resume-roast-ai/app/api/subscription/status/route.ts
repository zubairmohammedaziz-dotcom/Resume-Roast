import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          isPro: false,
          error: "Not authenticated.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const { data: subscription, error } = await supabaseAdmin
      .from("subscriptions")
      .select(
        "plan, status, current_period_end, cancel_at_period_end"
      )
      .ilike("user_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Subscription status lookup failed:", error);

      return NextResponse.json(
        {
          isPro: false,
          error: "Unable to check subscription.",
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    if (!subscription) {
      return NextResponse.json(
        {
          isPro: false,
          plan: "free",
          status: "inactive",
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const status = String(subscription.status ?? "").toLowerCase();
    const plan = String(subscription.plan ?? "").toLowerCase();

    const validStatus = [
      "active",
      "authenticated",
      "created",
    ].includes(status);

    const validPlan = [
      "pro",
      "pro_monthly",
    ].includes(plan);

    const periodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end)
      : null;

    const subscriptionExpired =
      periodEnd !== null &&
      !Number.isNaN(periodEnd.getTime()) &&
      periodEnd.getTime() < Date.now();

    const isPro =
      validStatus &&
      validPlan &&
      !subscriptionExpired;

    return NextResponse.json(
      {
        isPro,
        plan: isPro ? "pro" : "free",
        status,
        currentPeriodEnd:
          subscription.current_period_end ?? null,
        cancelAtPeriodEnd:
          subscription.cancel_at_period_end ?? false,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Subscription status route error:", error);

    return NextResponse.json(
      {
        isPro: false,
        error: "Unable to check subscription.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}