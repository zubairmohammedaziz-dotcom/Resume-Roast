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
      console.error("Missing Razorpay environment variables.");

      return NextResponse.json(
        { error: "Payment configuration is incomplete." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as VerifyBody;

    const paymentId = body.razorpay_payment_id?.trim();
    const subscriptionId = body.razorpay_subscription_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        { error: "Incomplete payment verification data." },
        { status: 400 }
      );
    }

    /*
      IMPORTANT:
      Razorpay Subscription signature format is:

      razorpay_subscription_id|razorpay_payment_id

      The previous code had these values in the wrong order.
    */
    const signaturePayload = `${subscriptionId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signaturePayload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(signature, "utf8");

    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      console.error("Razorpay signature verification failed.", {
        paymentId,
        subscriptionId,
      });

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

    if (payment.status !== "captured") {
      console.error("Payment is not captured.", {
        paymentId,
        paymentStatus: payment.status,
      });

      return NextResponse.json(
        { error: "Payment has not been captured yet." },
        { status: 400 }
      );
    }

    if (
      payment.subscription_id &&
      payment.subscription_id !== subscriptionId
    ) {
      console.error("Payment and subscription do not match.", {
        paymentSubscriptionId: payment.subscription_id,
        receivedSubscriptionId: subscriptionId,
      });

      return NextResponse.json(
        { error: "Payment does not match the subscription." },
        { status: 400 }
      );
    }

    /*
      A newly authorised Razorpay subscription may temporarily show
      "authenticated" even though the first payment is captured.

      Since the payment has been securely verified and captured,
      activate Pro immediately.
    */
    const subscriptionRecord = {
      user_id: session.user.id,
      user_email: session.user.email.toLowerCase(),
      plan: "pro_monthly",
      status: "active",
      razorpay_customer_id: subscription.customer_id ?? null,
      razorpay_subscription_id: subscriptionId,
      razorpay_plan_id: subscription.plan_id ?? null,
      current_period_end: subscription.current_end
        ? new Date(subscription.current_end * 1000).toISOString()
        : null,
      payment_method: payment.method ?? null,
      cancel_at_period_end: false,
    };

    const { data: existingSubscription, error: lookupError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (lookupError) {
      console.error("Supabase subscription lookup error:", lookupError);

      return NextResponse.json(
        {
          error:
            "Payment was verified, but subscription activation failed.",
        },
        { status: 500 }
      );
    }

    let databaseError = null;

    if (existingSubscription?.id) {
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .update(subscriptionRecord)
        .eq("id", existingSubscription.id);

      databaseError = error;
    } else {
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .insert(subscriptionRecord);

      databaseError = error;
    }

    if (databaseError) {
      console.error("Supabase subscription save error:", databaseError);

      return NextResponse.json(
        {
          error:
            "Payment was verified, but Pro activation failed. Please contact support.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan: "pro",
      status: "active",
      paymentId,
      subscriptionId,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify and activate the subscription." },
      { status: 500 }
    );
  }
}