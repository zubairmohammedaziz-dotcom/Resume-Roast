import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const PLAN_ID = "plan_TG020SA1HwCikI";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Please sign in before upgrading." },
        { status: 401 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment configuration is incomplete." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: PLAN_ID,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: session.user.id,
        email: session.user.email,
        plan: "pro_monthly",
      },
    });

    return NextResponse.json({
      keyId,
      subscriptionId: subscription.id,
      customer: {
        name: session.user.name ?? "",
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Razorpay subscription error:", error);

    return NextResponse.json(
      { error: "Unable to create subscription." },
      { status: 500 }
    );
  }
}