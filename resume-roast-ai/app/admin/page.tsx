"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileSearch,
  Gauge,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

type Status = "connected" | "not-connected" | "coming-soon";

const integrations = [
  {
    name: "Google Analytics 4",
    description: "Visitors, sessions, sources, devices and landing pages.",
    status: "not-connected" as Status,
    icon: BarChart3,
  },
  {
    name: "Supabase",
    description: "Users, analyses, tailoring and product activity.",
    status: "not-connected" as Status,
    icon: Activity,
  },
  {
    name: "Razorpay",
    description: "Subscriptions, MRR, refunds and payment failures.",
    status: "not-connected" as Status,
    icon: CreditCard,
  },
  {
    name: "Search Console",
    description: "Clicks, impressions, queries and organic landing pages.",
    status: "coming-soon" as Status,
    icon: Search,
  },
];

const funnel = [
  "Website visitors",
  "Resume uploads",
  "Analyses completed",
  "Tailored resumes",
  "Checkout starts",
  "Paid subscriptions",
];

const events = [
  "resume_uploaded",
  "analysis_started",
  "analysis_completed",
  "tailor_started",
  "cover_letter_generated",
  "interview_prep_opened",
  "checkout_started",
  "subscription_success",
];

export default function FounderDashboardPage() {
  const { data: session, status } = useSession();

  const founderEmail = (
    process.env.NEXT_PUBLIC_FOUNDER_EMAIL || ""
  ).trim().toLowerCase();

  const signedInEmail = (
    session?.user?.email || ""
  ).trim().toLowerCase();

  if (status === "loading") {
    return <AccessScreen title="Checking founder access..." loading />;
  }

  if (status === "unauthenticated") {
    return (
      <AccessScreen
        title="Sign in to continue"
        description="Use the Google account approved for the OffernHire Founder Dashboard."
        action={
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-black transition hover:bg-orange-400"
          >
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </button>
        }
      />
    );
  }

  if (!founderEmail) {
    return (
      <AccessScreen
        title="Founder email is not configured"
        description="Add NEXT_PUBLIC_FOUNDER_EMAIL to your local environment and Vercel before opening this page."
      />
    );
  }

  if (signedInEmail !== founderEmail) {
    return (
      <AccessScreen
        title="Access restricted"
        description={`The signed-in account (${session?.user?.email || "unknown"}) is not approved for founder access.`}
        action={
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-black transition hover:bg-orange-400"
          >
            <LogOut className="h-4 w-4" />
            Use another account
          </button>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-black">
              O
            </span>
            <span>
              <span className="block text-sm font-bold">OffernHire</span>
              <span className="block text-[10px] text-zinc-600">
                Founder Control Center
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 md:flex">
              <UserRound className="h-4 w-4 text-zinc-600" />
              <div className="max-w-[210px]">
                <p className="truncate text-xs font-semibold text-zinc-300">
                  {session?.user?.name || "OffernHire Founder"}
                </p>
                <p className="truncate text-[10px] text-zinc-700">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b0b0b] px-5 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[360px] w-[360px] rounded-full bg-orange-500/[0.11] blur-[120px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
              <LayoutDashboard className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
                OffernHire Founder Dashboard
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              One view of traffic, product usage, revenue and growth.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
              This dashboard never invents numbers. Until a data source is
              securely connected, the related metric remains marked as not connected.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Visitors today"
            description="Connect GA4 to show unique visitors."
            icon={<Users className="h-5 w-5" />}
          />
          <Metric
            label="Resume analyses"
            description="Connect Supabase product events."
            icon={<FileSearch className="h-5 w-5" />}
          />
          <Metric
            label="Monthly recurring revenue"
            description="Connect Razorpay subscriptions."
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
          <Metric
            label="Visitor to Pro conversion"
            description="Calculated after traffic and payment data connect."
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <Panel
            eyebrow="Conversion funnel"
            title="See exactly where users drop off"
            description="The funnel will populate from product and payment events."
          >
            <div className="mt-6 space-y-3">
              {funnel.map((step, index) => (
                <div key={step}>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-xs font-black text-orange-300">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{step}</p>
                      <p className="mt-1 text-xs text-zinc-600">Not connected</p>
                    </div>
                    <StatusBadge status="not-connected" />
                  </div>
                  {index < funnel.length - 1 && (
                    <div className="ml-[33px] h-3 w-px bg-white/[0.08]" />
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Product health"
            title="Operational reliability"
            description="These metrics will come from your application event store."
          >
            <div className="mt-6 space-y-3">
              <HealthRow label="Failed analyses" icon={<AlertTriangle className="h-4 w-4" />} />
              <HealthRow label="Average AI response time" icon={<Gauge className="h-4 w-4" />} />
              <HealthRow label="Payment failures" icon={<CreditCard className="h-4 w-4" />} />
              <HealthRow label="Successful analysis rate" icon={<CheckCircle2 className="h-4 w-4" />} />
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <Panel
            eyebrow="Growth"
            title="Traffic sources"
            description="See whether visitors come from search, communities or direct discovery."
          >
            <EmptyState
              icon={<Globe2 className="h-6 w-6" />}
              title="Traffic acquisition is not connected"
              description="GA4 will provide source, medium, campaign, country and device data."
            />
          </Panel>

          <Panel
            eyebrow="SEO"
            title="Top landing pages and search demand"
            description="See which pages and queries bring qualified visitors."
          >
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="Search Console is not connected"
              description="Connect it after GA4 so clicks and impressions can be compared with conversions."
            />
          </Panel>
        </section>

        <section className="mt-6">
          <Panel
            eyebrow="Data connections"
            title="Founder dashboard setup"
            description="Connect each source one at a time. Keep all sensitive credentials on the server."
          >
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {integrations.map(({ name, description, status, icon: Icon }) => (
                <article
                  key={name}
                  className="rounded-2xl border border-white/[0.08] bg-black/25 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <StatusBadge status={status} />
                  </div>
                  <h3 className="mt-5 text-sm font-black">{name}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel
            eyebrow="Analytics events"
            title="Events required for a reliable funnel"
            description="Use these names consistently across the product."
          >
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {events.map((eventName) => (
                <div
                  key={eventName}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3"
                >
                  <Target className="h-4 w-4 text-orange-400" />
                  <code className="text-xs font-semibold text-zinc-300">
                    {eventName}
                  </code>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Next connection"
            title="Start with Google Analytics 4"
            description="Traffic is the first dependency for conversion analysis."
          >
            <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/[0.055] p-5">
              <ShieldCheck className="h-6 w-6 text-orange-400" />
              <h3 className="mt-4 text-lg font-black">
                Verify the GA4 property first
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Confirm that page views and active users reach GA4. Then connect
                product events and revenue.
              </p>
            </div>
          </Panel>
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to OffernHire
          </Link>
        </div>
      </div>
    </main>
  );
}

function AccessScreen({
  title,
  description,
  action,
  loading = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
      <section className="w-full max-w-xl rounded-[2rem] border border-white/[0.09] bg-[#0b0b0b] p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/[0.08] text-orange-400">
          {loading ? (
            <Sparkles className="h-6 w-6 animate-pulse" />
          ) : (
            <LockKeyhole className="h-6 w-6" />
          )}
        </span>
        <h1 className="mt-6 text-3xl font-black">{title}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-500">
            {description}
          </p>
        )}
        {action && <div className="mt-7">{action}</div>}
        {!loading && (
          <Link
            href="/"
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.09] px-6 text-sm font-bold text-zinc-300"
          >
            Back to website
          </Link>
        )}
      </section>
    </main>
  );
}

function Metric({
  label,
  description,
  icon,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-700">
          {label}
        </p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-xl font-black">Not connected</p>
      <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-600">
        {description}
      </p>
      <div className="mt-4">
        <StatusBadge status="not-connected" />
      </div>
    </article>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/[0.08] bg-[#0b0b0b] p-5 sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-black sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const connected = status === "connected";
  const comingSoon = status === "coming-soon";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] ${
        connected
          ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300"
          : comingSoon
            ? "border-blue-500/20 bg-blue-500/[0.07] text-blue-300"
            : "border-amber-500/20 bg-amber-500/[0.07] text-amber-300"
      }`}
    >
      {connected ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : comingSoon ? (
        <Sparkles className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {connected ? "Connected" : comingSoon ? "Coming soon" : "Not connected"}
    </span>
  );
}

function HealthRow({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-500">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-300">{label}</p>
        <p className="mt-1 text-xs text-zinc-700">Not connected</p>
      </div>
      <StatusBadge status="not-connected" />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/[0.1] bg-black/20 px-5 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}