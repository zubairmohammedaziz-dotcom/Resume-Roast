"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Crown,
  Loader2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";

const PLAN_KEY = "offernhire_plan";
const PLAN_UPDATED_EVENT = "offernhire-plan-updated";

type Plan = {
  name: "Free" | "Pro";
  price: string;
  period: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
    emphasis?: boolean;
  }>;
  buttonText: string;
  highlight: boolean;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
  notes: {
    plan: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
};

type SubscriptionStatusResponse = {
  isPro?: boolean;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description:
      "Explore the core experience and understand how competitive your resume is.",
    features: [
      {
        text: "1 complete resume analysis",
        included: true,
        emphasis: true,
      },
      {
        text: "ATS and recruiter scores",
        included: true,
      },
      {
        text: "Resume strengths and weaknesses",
        included: true,
      },
      {
        text: "Up to 3 job matches",
        included: true,
      },
      {
        text: "AI resume tailoring",
        included: false,
      },
      {
        text: "AI cover letters",
        included: false,
      },
      {
        text: "Premium PDF export",
        included: false,
      },
      {
        text: "Resume history",
        included: false,
      },
    ],
    buttonText: "Analyze My Resume Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "per month",
    description:
      "Build stronger applications, tailor every resume and apply with an unfair advantage.",
    features: [
      {
        text: "Unlimited resume analyses",
        included: true,
        emphasis: true,
      },
      {
        text: "Unlimited live job matches",
        included: true,
      },
      {
        text: "AI resume tailoring for every role",
        included: true,
      },
      {
        text: "Personalized AI cover letters",
        included: true,
      },
      {
        text: "Premium ATS-ready PDF exports",
        included: true,
      },
      {
        text: "Resume and application history",
        included: true,
      },
      {
        text: "Priority AI processing",
        included: true,
      },
      {
        text: "Access to upcoming Pro features",
        included: true,
      },
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve(true);
        return;
      }

      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve(true);
    };

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function Pricing() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function updateFromLocalStorage() {
      const proActive =
        localStorage.getItem(PLAN_KEY) === "pro";

      if (!cancelled) {
        setIsPro(proActive);
      }
    }

    async function verifySubscriptionStatus() {
      updateFromLocalStorage();

      try {
        const response = await fetch(
          "/api/subscription/status",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem(PLAN_KEY);

          if (!cancelled) {
            setIsPro(false);
          }

          return;
        }

        if (!response.ok) {
          console.error(
            "Unable to check subscription status:",
            response.status
          );

          return;
        }

        const data =
          (await response.json()) as SubscriptionStatusResponse;

        if (cancelled) {
          return;
        }

        if (data.isPro === true) {
          localStorage.setItem(PLAN_KEY, "pro");
          setIsPro(true);
        } else {
          localStorage.removeItem(PLAN_KEY);
          setIsPro(false);
        }
      } catch (error) {
        console.error(
          "Subscription status check failed:",
          error
        );
      } finally {
        if (!cancelled) {
          setPlanLoading(false);
        }
      }
    }

    function handlePlanUpdate() {
      updateFromLocalStorage();
      void verifySubscriptionStatus();
    }

    void verifySubscriptionStatus();

    window.addEventListener(
      PLAN_UPDATED_EVENT,
      handlePlanUpdate
    );

    window.addEventListener(
      "storage",
      handlePlanUpdate
    );

    window.addEventListener(
      "focus",
      handlePlanUpdate
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        PLAN_UPDATED_EVENT,
        handlePlanUpdate
      );

      window.removeEventListener(
        "storage",
        handlePlanUpdate
      );

      window.removeEventListener(
        "focus",
        handlePlanUpdate
      );
    };
  }, []);

  function scrollToAnalyzer() {
    document
      .getElementById("resume-analyzer")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  async function handleProClick() {
    if (checkoutLoading || isPro) {
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Unable to load the secure payment window. Please refresh and try again."
        );
      }

      const response = await fetch(
        "/api/razorpay/create-subscription",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = (await response.json()) as {
        keyId?: string;
        subscriptionId?: string;
        customer?: {
          name?: string;
          email?: string;
        };
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start subscription checkout."
        );
      }

      if (!data.keyId || !data.subscriptionId) {
        throw new Error(
          "Razorpay subscription information was not returned."
        );
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        subscription_id: data.subscriptionId,

        name: "OffernHire",
        description: "₹199/month • Cancel anytime",

        prefill: {
          name: data.customer?.name || "",
          email: data.customer?.email || "",
        },

        notes: {
          plan: "pro_monthly",
        },

        theme: {
          color: "#f97316",
        },

        handler: async (paymentResponse) => {
          try {
            const verificationResponse = await fetch(
              "/api/razorpay/verify-subscription",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentResponse),
              }
            );

            const verificationData =
              (await verificationResponse.json()) as {
                success?: boolean;
                error?: string;
              };

            if (
              !verificationResponse.ok ||
              !verificationData.success
            ) {
              throw new Error(
                verificationData.error ||
                  "Payment completed, but verification is pending."
              );
            }

            localStorage.setItem(PLAN_KEY, "pro");
            setIsPro(true);

            window.dispatchEvent(
              new CustomEvent(PLAN_UPDATED_EVENT, {
                detail: {
                  plan: "pro",
                },
              })
            );

            window.location.assign("/success");
          } catch (verificationError) {
            const message =
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed. Please contact support.";

            console.error(
              "Razorpay verification error:",
              verificationError
            );

            setCheckoutError(message);
            setCheckoutLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setCheckoutLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.";

      console.error("Razorpay checkout error:", error);

      setCheckoutError(message);
      setCheckoutLoading(false);
    }
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 px-5 py-16 shadow-2xl shadow-black/40 sm:px-6 md:px-12 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-amber-500/[0.05] blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            <Sparkles
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            {isPro
              ? "Your Pro subscription is active"
              : "Simple, transparent pricing"}
          </div>

          <h2
            id="pricing-heading"
            className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl"
          >
            {isPro
              ? "You’re on Pro. Keep building stronger applications."
              : "Start free. Go Pro when you’re ready to win."}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            {isPro
              ? "Your paid plan is active with unlimited analyses, resume tailoring, cover letters and all Pro features."
              : "Understand your resume for free. Upgrade for tailored applications, premium exports and unlimited career support."}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => {
            const isProPlan = plan.name === "Pro";
            const proPlanActive = isProPlan && isPro;

            return (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col rounded-3xl border p-7 transition duration-300 md:p-9 ${
                  proPlanActive
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-500/[0.12] via-zinc-950 to-zinc-950 shadow-[0_0_55px_rgba(16,185,129,0.12)]"
                    : plan.highlight
                      ? "border-orange-500/60 bg-gradient-to-b from-orange-500/[0.12] via-zinc-950 to-zinc-950 shadow-[0_0_55px_rgba(249,115,22,0.12)]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >
                {isProPlan && (
                  <div
                    className={`absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                      proPlanActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-orange-500/30 bg-orange-500/10 text-orange-300"
                    }`}
                  >
                    {proPlanActive ? (
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : (
                      <Crown
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    )}

                    {proPlanActive
                      ? "Pro active"
                      : "Best value"}
                  </div>
                )}

                <div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      proPlanActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : plan.highlight
                          ? "bg-orange-500/15 text-orange-400"
                          : "bg-white/[0.06] text-zinc-300"
                    }`}
                  >
                    {plan.highlight ? (
                      <Crown
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <Sparkles
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-white">
                    {plan.name}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                    {plan.description}
                  </p>

                  <div className="mt-7 flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tight text-white">
                      {plan.price}
                    </span>

                    <span className="pb-1.5 text-sm font-semibold text-zinc-500">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="my-8 h-px bg-white/[0.08]" />

                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-start gap-3 text-sm leading-6 ${
                        feature.included
                          ? "text-zinc-200"
                          : "text-zinc-600"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          feature.included
                            ? proPlanActive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : plan.highlight
                                ? "bg-orange-500/15 text-orange-400"
                                : "bg-white/[0.07] text-zinc-300"
                            : "bg-white/[0.03] text-zinc-600"
                        }`}
                      >
                        {feature.included ? (
                          <Check
                            className="h-3.5 w-3.5"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            className="h-3.5 w-3.5"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      <span
                        className={
                          feature.emphasis
                            ? "font-bold text-white"
                            : ""
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {proPlanActive ? (
                  <div className="mt-9 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-black text-emerald-300">
                    <Check
                      className="h-4 w-4"
                      strokeWidth={3}
                      aria-hidden="true"
                    />

                    Pro plan active
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={
                      (plan.highlight && checkoutLoading) ||
                      planLoading
                    }
                    onClick={
                      plan.highlight
                        ? handleProClick
                        : scrollToAnalyzer
                    }
                    className={`group mt-9 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 ${
                      plan.highlight
                        ? "bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.16)] hover:bg-orange-400 hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]"
                        : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.highlight &&
                    checkoutLoading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />

                        Opening secure checkout...
                      </>
                    ) : planLoading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />

                        Checking plan...
                      </>
                    ) : (
                      <>
                        {plan.buttonText}

                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                )}

                {isProPlan &&
                  checkoutError &&
                  !isPro && (
                    <p
                      role="alert"
                      className="mt-3 text-center text-sm font-medium text-red-400"
                    >
                      {checkoutError}
                    </p>
                  )}
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-3 text-sm text-zinc-400 sm:grid-cols-4">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <ShieldCheck
              className="h-4 w-4 text-orange-400"
              aria-hidden="true"
            />

            Secure Razorpay checkout
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <Smartphone
              className="h-4 w-4 text-orange-400"
              aria-hidden="true"
            />

            UPI AutoPay
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <QrCode
              className="h-4 w-4 text-orange-400"
              aria-hidden="true"
            />

            QR on desktop
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <LockKeyhole
              className="h-4 w-4 text-orange-400"
              aria-hidden="true"
            />

            Cancel anytime
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-medium leading-5 text-zinc-500">
          {isPro
            ? "Your Pro subscription is active. It renews automatically at ₹199 per month unless cancelled."
            : "Pro renews automatically at ₹199 per month. Cancel anytime. Secure recurring payments are processed by Razorpay through UPI AutoPay, QR code, or an eligible card."}
        </p>
      </div>
    </section>
  );
}