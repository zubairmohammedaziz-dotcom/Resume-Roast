"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Test the complete Resume Roast experience before upgrading.",
    features: [
      "3 Resume Analyses",
      "ATS Score",
      "3 AI Job Matches",
      "Basic Resume Suggestions",
    ],
    buttonText: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "per month",
    description: "Everything you need to turn your resume into more interviews.",
    features: [
      "Unlimited Resume Analyses",
      "Unlimited Job Matches",
      "AI Resume Tailoring",
      "AI Cover Letters",
      "Interview Preparation",
      "Premium PDF Export",
      "Resume History",
      "Priority AI Processing",
    ],
    buttonText: "Start Pro – ₹199/month",
    highlight: true,
  },
];

export default function Pricing() {
  function scrollToAnalyzer() {
    document
      .getElementById("resume-analyzer")
      ?.scrollIntoView({ behavior: "smooth" });
  }

async function handleProClick() {
  try {
    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
    });

    const { url } = await response.json();

    if (url) {
      window.location.href = url;
      return;
    }

    alert("Unable to start checkout.");
  } catch (error) {
    console.error(error);
    alert("Unable to start checkout.");
  }
}

  return (
    <section
      id="pricing"
      className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 px-6 py-16 shadow-2xl shadow-black/40 md:px-12 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
            Simple Pricing
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Start free. Upgrade when the job matters.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Most resumes lose opportunities before a recruiter even sees them.
            Resume Roast AI helps you fix the gaps, tailor faster, and apply with
            confidence.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-3xl border p-7 transition duration-300 md:p-9 ${
                plan.highlight
                  ? "border-orange-500/60 bg-gradient-to-b from-orange-500/10 to-zinc-950 shadow-[0_0_50px_rgba(249,115,22,0.10)]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20"
              }`}
            >
              {plan.highlight && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
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
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-zinc-300"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlight
                          ? "bg-orange-500/15 text-orange-400"
                          : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={plan.highlight ? handleProClick : scrollToAnalyzer}
                className={`group mt-9 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition duration-200 ${
                  plan.highlight
                    ? "bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.16)] hover:bg-orange-400 hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]"
                    : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                {plan.buttonText}

                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>

      
        <p className="mt-8 text-center text-xs font-medium text-zinc-500">
  Cancel anytime. Secure checkout. No hidden charges.
</p>
      </div>
    </section>
  );
}