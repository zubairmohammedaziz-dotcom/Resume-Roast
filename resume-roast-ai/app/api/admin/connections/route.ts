import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";

import { authOptions } from "../../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FOUNDER_EMAIL = (process.env.NEXT_PUBLIC_FOUNDER_EMAIL || "")
  .trim()
  .toLowerCase();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const email = (session?.user?.email || "").trim().toLowerCase();

    if (!session?.user || !email || !FOUNDER_EMAIL || email !== FOUNDER_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /* ---------------- SUPABASE ---------------- */

    let supabaseConnected = false;
    let supabaseError: string | null = null;

    try {
      const { error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      if (error) {
        throw error;
      }

      supabaseConnected = true;
    } catch (error) {
      supabaseError =
        error instanceof Error
          ? error.message
          : "Unable to connect to Supabase.";
    }

    /* ---------------- RAZORPAY ---------------- */

    let razorpayConnected = false;
    let razorpayError: string | null = null;

    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials are not configured.");
      }

      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // Read-only API call. This does NOT create a payment or subscription.
      await razorpay.subscriptions.all({
        count: 1,
      });

      razorpayConnected = true;
    } catch (error) {
      razorpayError =
        error instanceof Error
          ? error.message
          : "Unable to connect to Razorpay.";
    }

    return NextResponse.json(
      {
        success: true,
        connections: {
          supabase: {
            status: supabaseConnected ? "connected" : "not-connected",
            error: supabaseError,
          },
          razorpay: {
            status: razorpayConnected ? "connected" : "not-connected",
            error: razorpayError,
          },
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin connections API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to check connections.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
