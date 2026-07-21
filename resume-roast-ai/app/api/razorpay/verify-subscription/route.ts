import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Please sign in before verifying payment." },
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

    const body = (await request.json()) as VerifyBody;

    const paymentId = body.razorpay_payment_id;
    const subscriptionId = body.razorpay_subscription_id;
    const signature = body.razorpay_signature;

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        { error: "Incomplete payment verification data." },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest("hex");

    const isValid =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const [payment, subscription] = await Promise.all([
      razorpay.payments.fetch(paymentId),
      razorpay.subscriptions.fetch(subscriptionId),
    ]);

    const subscriptionRecord = {
      user_id: session.user.id,
      user_email: session.user.email,
      plan: "pro_monthly",
      status: subscription.status,
      razorpay_customer_id: subscription.customer_id ?? null,
      razorpay_subscription_id: subscriptionId,
      razorpay_plan_id: subscription.plan_id,
      current_period_end: subscription.current_end
        ? new Date(subscription.current_end * 1000).toISOString()
        : null,
      payment_method: payment.method ?? null,
    };

    const { data: existingSubscription } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const databaseResult = existingSubscription
      ? await supabaseAdmin
          .from("subscriptions")
          .update(subscriptionRecord)
          .eq("id", existingSubscription.id)
      : await supabaseAdmin
          .from("subscriptions")
          .insert(subscriptionRecord);

    if (databaseResult.error) {
      console.error(
        "Supabase subscription error:",
        databaseResult.error
      );

      return NextResponse.json(
        {
          error:
            "Payment verified, but Pro activation failed. Please contact support.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      paymentId,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify and activate subscription." },
      { status: 500 }
    );
  }
}