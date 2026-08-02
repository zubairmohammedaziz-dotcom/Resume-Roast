import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, max-age=0",
};

type RazorpayNotes = {
  userId?: string;
  user_id?: string;
  email?: string;
  userEmail?: string;
  plan?: string;
};

type PaymentEntity = {
  id?: string;
  status?: string;
  method?: string | null;
  subscription_id?: string | null;
  customer_id?: string | null;
  notes?: RazorpayNotes;
};

type SubscriptionEntity = {
  id?: string;
  status?: string;
  customer_id?: string | null;
  plan_id?: string | null;
  current_start?: number | null;
  current_end?: number | null;
  ended_at?: number | null;
  notes?: RazorpayNotes;
};

type WebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: PaymentEntity;
    };
    subscription?: {
      entity?: SubscriptionEntity;
    };
  };
};

function verifyWebhookSignature({
  rawBody,
  signature,
  secret,
}: {
  rawBody: string;
  signature: string;
  secret: string;
}) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8"
  );

  const receivedBuffer = Buffer.from(
    signature,
    "utf8"
  );

  return (
    expectedBuffer.length ===
      receivedBuffer.length &&
    crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer
    )
  );
}

function normaliseEmail(
  value: string | undefined
) {
  return value?.trim().toLowerCase() || "";
}

function timestampToIso(
  timestamp: number | null | undefined
) {
  if (!timestamp) {
    return null;
  }

  return new Date(
    timestamp * 1000
  ).toISOString();
}

async function fetchSubscription(
  subscriptionId: string
): Promise<SubscriptionEntity | null> {
  const keyId =
    process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error(
      "Razorpay API credentials are missing."
    );

    return null;
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    const subscription =
      await razorpay.subscriptions.fetch(
        subscriptionId
      );

    return subscription as unknown as SubscriptionEntity;
  } catch (error) {
    console.error(
      "Unable to fetch Razorpay subscription:",
      error
    );

    return null;
  }
}

function getSubscriptionStatus(
  eventName: string,
  razorpayStatus?: string
) {
  if (
    eventName === "subscription.cancelled" ||
    eventName === "subscription.completed"
  ) {
    return "inactive";
  }

  if (
    eventName === "subscription.halted" ||
    eventName === "subscription.paused"
  ) {
    return "inactive";
  }

  if (
    eventName === "payment.captured" ||
    eventName === "subscription.activated" ||
    eventName === "subscription.authenticated" ||
    eventName === "subscription.charged"
  ) {
    return "active";
  }

  if (
    razorpayStatus === "active" ||
    razorpayStatus === "authenticated"
  ) {
    return "active";
  }

  return "inactive";
}

export async function POST(request: Request) {
  try {
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Webhook configuration is incomplete.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    /*
      Razorpay requires signature verification
      against the original raw request body.
      Do not call request.json() before verification.
    */
    const rawBody = await request.text();

    const signature =
      request.headers.get(
        "x-razorpay-signature"
      ) || "";

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Webhook signature is missing.",
        },
        {
          status: 400,
          headers: noCacheHeaders,
        }
      );
    }

    const validSignature =
      verifyWebhookSignature({
        rawBody,
        signature,
        secret: webhookSecret,
      });

    if (!validSignature) {
      console.error(
        "Invalid Razorpay webhook signature."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid webhook signature.",
        },
        {
          status: 401,
          headers: noCacheHeaders,
        }
      );
    }

    let webhook: WebhookPayload;

    try {
      webhook = JSON.parse(
        rawBody
      ) as WebhookPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid webhook payload.",
        },
        {
          status: 400,
          headers: noCacheHeaders,
        }
      );
    }

    const eventName =
      webhook.event || "";

    const supportedEvents = [
      "payment.captured",
      "subscription.authenticated",
      "subscription.activated",
      "subscription.charged",
      "subscription.cancelled",
      "subscription.completed",
      "subscription.halted",
      "subscription.paused",
      "subscription.resumed",
    ];

    if (
      !supportedEvents.includes(eventName)
    ) {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
          event: eventName,
        },
        {
          status: 200,
          headers: noCacheHeaders,
        }
      );
    }

    const payment =
      webhook.payload?.payment?.entity;

    let subscription =
      webhook.payload?.subscription?.entity ||
      null;

    const subscriptionId =
      subscription?.id ||
      payment?.subscription_id ||
      "";

    /*
      payment.captured may not contain the full
      subscription entity. Fetch it from Razorpay
      so we can access the notes added during
      create-subscription.
    */
    if (
      !subscription &&
      subscriptionId
    ) {
      subscription =
        await fetchSubscription(
          subscriptionId
        );
    }

    const notes =
      subscription?.notes ||
      payment?.notes ||
      {};

    const userId =
      notes.userId?.trim() ||
      notes.user_id?.trim() ||
      "";

    const userEmail =
      normaliseEmail(
        notes.email ||
          notes.userEmail
      );

    if (!userId && !userEmail) {
      console.error(
        "Webhook could not identify the OffernHire user.",
        {
          eventName,
          paymentId: payment?.id,
          subscriptionId,
          subscriptionNotes:
            subscription?.notes,
          paymentNotes: payment?.notes,
        }
      );

      /*
        Return 500 so Razorpay retries the event.
        Do not acknowledge it as successful when
        the user could not be identified.
      */
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to identify the subscription user.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    const status =
      getSubscriptionStatus(
        eventName,
        subscription?.status
      );

    const currentPeriodEnd =
      timestampToIso(
        subscription?.current_end
      ) ||
      timestampToIso(
        subscription?.ended_at
      ) ||
      new Date(
        Date.now() +
          31 * 24 * 60 * 60 * 1000
      ).toISOString();

    const subscriptionRecord = {
      user_id:
        userId || userEmail,
      user_email: userEmail,
      plan: "pro_monthly",
      status,
      current_period_end:
        currentPeriodEnd,
      cancel_at_period_end:
        eventName ===
          "subscription.cancelled" ||
        eventName ===
          "subscription.completed",
      razorpay_customer_id:
        subscription?.customer_id ||
        payment?.customer_id ||
        null,
      razorpay_subscription_id:
        subscriptionId || null,
      razorpay_plan_id:
        subscription?.plan_id ||
        null,
      payment_method:
        payment?.method || null,
      updated_at:
        new Date().toISOString(),
    };

    /*
      Find an existing subscription using the
      Razorpay subscription ID, OffernHire user ID,
      or email. This also makes webhook retries
      idempotent.
    */
    let existingSubscriptionId:
      | string
      | null = null;

    if (subscriptionId) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq(
          "razorpay_subscription_id",
          subscriptionId
        )
        .limit(1);

      if (error) {
        console.error(
          "Subscription ID lookup failed:",
          error
        );
      }

      existingSubscriptionId =
        data?.[0]?.id || null;
    }

    if (
      !existingSubscriptionId &&
      userId
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (error) {
        console.error(
          "User ID subscription lookup failed:",
          error
        );
      }

      existingSubscriptionId =
        data?.[0]?.id || null;
    }

    if (
      !existingSubscriptionId &&
      userEmail
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_email", userEmail)
        .limit(1);

      if (error) {
        console.error(
          "Email subscription lookup failed:",
          error
        );
      }

      existingSubscriptionId =
        data?.[0]?.id || null;
    }

    let databaseError = null;

    if (existingSubscriptionId) {
      const { error } =
        await supabaseAdmin
          .from("subscriptions")
          .update(subscriptionRecord)
          .eq(
            "id",
            existingSubscriptionId
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
        "Webhook subscription save failed:",
        {
          eventName,
          userId,
          userEmail,
          subscriptionId,
          databaseError,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to save the subscription.",
        },
        {
          status: 500,
          headers: noCacheHeaders,
        }
      );
    }

    console.log(
      "Razorpay webhook processed:",
      {
        eventName,
        userId,
        userEmail,
        subscriptionId,
        paymentId: payment?.id,
        status,
      }
    );

    return NextResponse.json(
      {
        success: true,
        event: eventName,
        status,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process the webhook.",
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}