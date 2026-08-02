import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

const PAYMENT_STATUS_ATTEMPTS = 10;
const PAYMENT_STATUS_DELAY_MS = 1500;

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
};

type RazorpayPayment = {
  id: string;
  status?: string;
  subscription_id?: string | null;
  method?: string | null;
};

type RazorpaySubscription = {
  id: string;
  status?: string;
  customer_id?: string | null;
  plan_id?: string | null;
  current_end?: number | null;
};

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function fetchPayment(
  razorpay: Razorpay,
  paymentId: string
): Promise<RazorpayPayment> {
  const payment = await razorpay.payments.fetch(paymentId);

  return payment as unknown as RazorpayPayment;
}

async function fetchSubscription(
  razorpay: Razorpay,
  subscriptionId: string
): Promise<RazorpaySubscription> {
  const subscription =
    await razorpay.subscriptions.fetch(subscriptionId);

  return subscription as unknown as RazorpaySubscription;
}

async function waitForCapturedPayment(
  razorpay: Razorpay,
  paymentId: string
): Promise<RazorpayPayment> {
  let payment = await fetchPayment(
    razorpay,
    paymentId
  );

  for (
    let attempt = 1;
    attempt < PAYMENT_STATUS_ATTEMPTS;
    attempt += 1
  ) {
    if (payment.status === "captured") {
      return payment;
    }

    if (
      payment.status === "failed" ||
      payment.status === "refunded"
    ) {
      return payment;
    }

    await wait(PAYMENT_STATUS_DELAY_MS);

    payment = await fetchPayment(
      razorpay,
      paymentId
    );
  }

  return payment;
}

export async function POST(request: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    const userId =
      session?.user?.id?.trim();

    const userEmail =
      session?.user?.email
        ?.trim()
        .toLowerCase();

    if (!userId || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please sign in before verifying payment.",
        },
        {
          status: 401,
          headers: noCacheHeaders,
        }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error(
        "Missing Razorpay environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment configuration is incomplete.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    const body =
      (await request.json()) as VerifyBody;

    const paymentId =
      body.razorpay_payment_id?.trim();

    const subscriptionId =
      body.razorpay_subscription_id?.trim();

    const signature =
      body.razorpay_signature?.trim();

    if (
      !paymentId ||
      !subscriptionId ||
      !signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Incomplete payment verification data.",
        },
        {
          status: 400,
          headers: noCacheHeaders,
        }
      );
    }

    const signaturePayload =
      `${subscriptionId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signaturePayload)
      .digest("hex");

    const expectedBuffer =
      Buffer.from(expectedSignature, "utf8");

    const receivedBuffer =
      Buffer.from(signature, "utf8");

    const isValid =
      expectedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!isValid) {
      console.error(
        "Razorpay signature verification failed.",
        {
          paymentId,
          subscriptionId,
          userEmail,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification failed.",
        },
        {
          status: 400,
          headers: noCacheHeaders,
        }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const [
      payment,
      subscription,
    ] = await Promise.all([
      waitForCapturedPayment(
        razorpay,
        paymentId
      ),
      fetchSubscription(
        razorpay,
        subscriptionId
      ),
    ]);

    if (
      payment.subscription_id &&
      payment.subscription_id !==
        subscriptionId
    ) {
      console.error(
        "Payment and subscription do not match.",
        {
          paymentId,
          paymentSubscriptionId:
            payment.subscription_id,
          receivedSubscriptionId:
            subscriptionId,
          userEmail,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment does not match the subscription.",
        },
        {
          status: 400,
          headers: noCacheHeaders,
        }
      );
    }

    if (payment.status !== "captured") {
      console.warn(
        "Payment is verified but capture is still pending.",
        {
          paymentId,
          paymentStatus: payment.status,
          subscriptionId,
          subscriptionStatus:
            subscription.status,
          userEmail,
        }
      );

      return NextResponse.json(
        {
          success: false,
          pending: true,
          error:
            "Payment is confirmed and capture is still processing. Pro activation will retry automatically.",
        },
        {
          status: 409,
          headers: noCacheHeaders,
        }
      );
    }

    const currentPeriodEnd =
      subscription.current_end
        ? new Date(
            subscription.current_end * 1000
          ).toISOString()
        : new Date(
            Date.now() +
              31 * 24 * 60 * 60 * 1000
          ).toISOString();

    const subscriptionRecord = {
      user_id: userId,
      user_email: userEmail,
      plan: "pro_monthly",
      status: "active",
      razorpay_customer_id:
        subscription.customer_id ?? null,
      razorpay_subscription_id:
        subscriptionId,
      razorpay_plan_id:
        subscription.plan_id ?? null,
      current_period_end:
        currentPeriodEnd,
      payment_method:
        payment.method ?? null,
      cancel_at_period_end: false,
    };

    const {
      data: existingSubscriptions,
      error: lookupError,
    } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .or(
        `user_id.eq.${userId},user_email.eq.${userEmail}`
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (lookupError) {
      console.error(
        "Supabase subscription lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment was verified, but subscription activation failed.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    const existingSubscription =
      existingSubscriptions?.[0] ?? null;

    let databaseError = null;

    if (existingSubscription?.id) {
      const { error } =
        await supabaseAdmin
          .from("subscriptions")
          .update(subscriptionRecord)
          .eq(
            "id",
            existingSubscription.id
          );

      databaseError = error;
    } else {
      const { error } =
        await supabaseAdmin
          .from("subscriptions")
          .insert(subscriptionRecord);

      databaseError = error;
    }

    if (databaseError) {
      console.error(
        "Supabase subscription save error:",
        databaseError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment was verified, but Pro activation failed. Please contact support.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        plan: "pro",
        status: "active",
        paymentId,
        subscriptionId,
        email: userEmail,
        currentPeriodEnd,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error(
      "Razorpay verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify and activate the subscription.",
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}