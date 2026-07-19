import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { authOptions } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const authSession = await getServerSession(authOptions);

    if (!authSession?.user?.id || !authSession.user.email) {
      return NextResponse.json(
        { error: "Please sign in before upgrading." },
        { status: 401 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    const appUrl = process.env.NEXTAUTH_URL;

    if (!stripeSecretKey || !priceId || !appUrl) {
      console.error("Missing Stripe environment variables.");

      return NextResponse.json(
        { error: "Payment configuration is incomplete." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",

      client_reference_id: authSession.user.id,

      customer_email: authSession.user.email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        userId: authSession.user.id,
        userEmail: authSession.user.email,
        plan: "pro_monthly",
      },

      subscription_data: {
        metadata: {
          userId: authSession.user.id,
          userEmail: authSession.user.email,
          plan: "pro_monthly",
        },
      },

      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,

      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}