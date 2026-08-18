"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileSearch,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

type Status = "connected" | "not-connected" | "coming-soon";

type AnalyticsResponse = {
  success: true;
  generatedAt: string;
  overview: {
    visitorsToday: number;
    activeUsersNow: number;
    newUsersToday: number;
    sessionsToday: number;
    pageViewsToday: number;
  };
  product: {
    resumeUploads: number;
    analysisStarted: number;
    analysisCompleted: number;
    analysisFailures: number;
    tailorStarted: number;
    pricingViews: number;
    successfulAnalysisRate: number;
  };
  funnel: {
    visitors: number;
    resumeUploads: number;
    analysesCompleted: number;
    tailoredResumes: number;
    checkoutStarts: number;
    paidSubscriptions: number;
    visitorToUploadRate: number;
    visitorToProRate: number;
  };
  topPages: Array<{ path: string; views: number; users: number }>;
  trafficSources: Array<{ source: string; sessions: number; users: number }>;
  events: Record<string, number>;
};

type DashboardState =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: AnalyticsResponse; error: null }
  | { status: "error"; data: null; error: string };

const trackedEvents = [
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
  const { data: session, status: sessionStatus } = useSession();
  const [dashboard, setDashboard] = useState<DashboardState>({
    status: "idle",
    data: null,
    error: null,
  });

  const founderEmail = (process.env.NEXT_PUBLIC_FOUNDER_EMAIL || "")
    .trim()
    .toLowerCase();
  const signedInEmail = (session?.user?.email || "").trim().toLowerCase();
  const hasFounderAccess =
    sessionStatus === "authenticated" &&
    Boolean(founderEmail) &&
    signedInEmail === founderEmail;

  const loadAnalytics = useCallback(async () => {
    setDashboard({ status: "loading", data: null, error: null });

    try {
      const response = await fetch("/api/admin/analytics", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const payload = (await response.json()) as
        | AnalyticsResponse
        | { success: false; error?: string };

      if (!response.ok || !payload.success) {
        setDashboard({
          status: "error",
          data: null,
          error:
            "error" in payload && payload.error
              ? payload.error
              : "Unable to load analytics.",
        });
        return;
      }

      setDashboard({ status: "success", data: payload, error: null });
    } catch (error) {
      setDashboard({
        status: "error",
        data: null,
        error:
          error instanceof Error ? error.message : "Unable to load analytics.",
      });
    }
  }, []);

  useEffect(() => {
    if (hasFounderAccess) void loadAnalytics();
  }, [hasFounderAccess, loadAnalytics]);

  if (sessionStatus === "loading") {
    return <AccessScreen title="Checking founder access..." loading />;
  }

  if (sessionStatus === "unauthenticated") {
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
        description="Add NEXT_PUBLIC_FOUNDER_EMAIL to Vercel and redeploy."
      />
    );
  }

  if (!hasFounderAccess) {
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

  const analytics = dashboard.status === "success" ? dashboard.data : null;
  const ga4Connected = Boolean(analytics);

  const generatedAt = analytics?.generatedAt
    ? formatGeneratedAt(analytics.generatedAt)
    : null;

  const funnel = analytics
    ? [
        ["Website visitors", analytics.funnel.visitors],
        ["Resume uploads", analytics.funnel.resumeUploads],
        ["Analyses completed", analytics.funnel.analysesCompleted],
        ["Tailored resumes", analytics.funnel.tailoredResumes],
        ["Checkout starts", analytics.funnel.checkoutStarts],
        ["Paid subscriptions", analytics.funnel.paidSubscriptions],
      ]
    : [
        ["Website visitors", null],
        ["Resume uploads", null],
        ["Analyses completed", null],
        ["Tailored resumes", null],
        ["Checkout starts", null],
        ["Paid subscriptions", null],
      ];

  const integrations = [
    {
      name: "Google Analytics 4",
      description: "Visitors, sessions, sources, product events and top pages.",
      status: ga4Connected ? ("connected" as Status) : ("not-connected" as Status),
      icon: BarChart3,
    },
    {
      name: "Supabase",
      description: "Persistent users, saved reports and product history.",
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
      description: "Organic clicks, impressions, queries and SEO pages.",
      status: "coming-soon" as Status,
      icon: Search,
    },
  ];

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
              onClick={() => void loadAnalytics()}
              disabled={dashboard.status === "loading"}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-sm font-semibold text-zinc-400 transition hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  dashboard.status === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

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

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
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
                GA4 data is now live. Razorpay and Supabase will complete the
                revenue and user-history layers.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <StatusBadge
                status={ga4Connected ? "connected" : "not-connected"}
              />
              {generatedAt && (
                <p className="text-xs text-zinc-700">
                  Last updated {generatedAt}
                </p>
              )}
            </div>
          </div>
        </section>

        {dashboard.status === "error" && (
          <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />
              <div>
                <h2 className="text-sm font-black text-red-200">
                  Analytics could not be loaded
                </h2>
                <p className="mt-2 text-sm text-red-200/60">
                  {dashboard.error}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Visitors today"
            value={formatValue(analytics?.overview.visitorsToday, dashboard.status)}
            description={
              analytics
                ? `${analytics.overview.newUsersToday} new users across ${analytics.overview.sessionsToday} sessions.`
                : "Loading visitors from GA4."
            }
            icon={<Users className="h-5 w-5" />}
            status={ga4Connected ? "connected" : "not-connected"}
          />

          <Metric
            label="Active users now"
            value={formatValue(analytics?.overview.activeUsersNow, dashboard.status)}
            description={
              analytics
                ? `${analytics.overview.pageViewsToday} page views recorded today.`
                : "Loading realtime activity from GA4."
            }
            icon={<Activity className="h-5 w-5" />}
            status={ga4Connected ? "connected" : "not-connected"}
          />

          <Metric
            label="Resume analyses"
            value={formatValue(
              analytics?.product.analysisCompleted,
              dashboard.status
            )}
            description={
              analytics
                ? `${analytics.product.analysisStarted} started and ${analytics.product.analysisFailures} failed.`
                : "Loading product events from GA4."
            }
            icon={<FileSearch className="h-5 w-5" />}
            status={ga4Connected ? "connected" : "not-connected"}
          />

          <Metric
            label="Visitor to Pro conversion"
            value={
              analytics
                ? `${analytics.funnel.visitorToProRate}%`
                : dashboard.status === "loading"
                  ? "Loading"
                  : "Not connected"
            }
            description="Razorpay will complete paid conversion and revenue reporting."
            icon={<TrendingUp className="h-5 w-5" />}
            status={
              analytics && analytics.funnel.paidSubscriptions > 0
                ? "connected"
                : "not-connected"
            }
          />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <Panel
            eyebrow="Conversion funnel"
            title="See exactly where users drop off"
            description="Live GA4 events mapped across the OffernHire journey."
          >
            <div className="mt-6 space-y-3">
              {funnel.map(([label, value], index) => (
                <div key={String(label)}>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-xs font-black text-orange-300">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{label}</p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {typeof value === "number"
                          ? `${value} recorded today`
                          : dashboard.status === "loading"
                            ? "Loading"
                            : "Not connected"}
                      </p>
                    </div>
                    <p className="text-lg font-black text-white">
                      {typeof value === "number" ? value : "—"}
                    </p>
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
            description="Live product-event quality for today."
          >
            <div className="mt-6 space-y-3">
              <HealthRow
                label="Failed analyses"
                value={analytics?.product.analysisFailures}
                suffix=""
                connected={ga4Connected}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              <HealthRow
                label="Successful analysis rate"
                value={analytics?.product.successfulAnalysisRate}
                suffix="%"
                connected={ga4Connected}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
              <HealthRow
                label="Resume uploads"
                value={analytics?.product.resumeUploads}
                suffix=""
                connected={ga4Connected}
                icon={<FileSearch className="h-4 w-4" />}
              />
              <HealthRow
                label="Pricing views"
                value={analytics?.product.pricingViews}
                suffix=""
                connected={ga4Connected}
                icon={<CircleDollarSign className="h-4 w-4" />}
              />
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <Panel
            eyebrow="Growth"
            title="Traffic sources"
            description="Where today’s sessions are coming from."
          >
            {analytics && analytics.trafficSources.length > 0 ? (
              <div className="mt-6 space-y-3">
                {analytics.trafficSources.map((item) => (
                  <DataRow
                    key={item.source}
                    label={item.source}
                    primary={`${item.sessions} sessions`}
                    secondary={`${item.users} users`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Globe2 className="h-6 w-6" />}
                title={
                  dashboard.status === "loading"
                    ? "Loading traffic sources"
                    : "No traffic-source data yet"
                }
                description="GA4 will display channel groups once sessions are recorded."
              />
            )}
          </Panel>

          <Panel
            eyebrow="Top pages"
            title="Most viewed pages today"
            description="See which parts of OffernHire attract the most attention."
          >
            {analytics && analytics.topPages.length > 0 ? (
              <div className="mt-6 space-y-3">
                {analytics.topPages.map((item) => (
                  <DataRow
                    key={item.path}
                    label={item.path}
                    primary={`${item.views} views`}
                    secondary={`${item.users} users`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title={
                  dashboard.status === "loading"
                    ? "Loading top pages"
                    : "No page data yet"
                }
                description="Pages will appear after GA4 records page views."
              />
            )}
          </Panel>
        </section>

        <section className="mt-6">
          <Panel
            eyebrow="Data connections"
            title="Founder dashboard setup"
            description="GA4 is live. Connect the remaining sources one at a time."
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
            title="Live funnel events"
            description="Tracked events currently feeding Google Analytics."
          >
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trackedEvents.map((eventName) => {
                const count = analytics?.events[eventName] ?? 0;
                const exists =
                  ga4Connected &&
                  Object.prototype.hasOwnProperty.call(
                    analytics?.events || {},
                    eventName
                  );

                return (
                  <div
                    key={eventName}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3"
                  >
                    <Target className="h-4 w-4 shrink-0 text-orange-400" />
                    <code className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-300">
                      {eventName}
                    </code>
                    <span
                      className={`text-xs font-black ${
                        exists ? "text-emerald-300" : "text-zinc-700"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel
            eyebrow="Next connection"
            title="Connect Razorpay next"
            description="Revenue is the next missing layer."
          >
            <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/[0.055] p-5">
              <ShieldCheck className="h-6 w-6 text-orange-400" />
              <h3 className="mt-4 text-lg font-black">
                GA4 is successfully connected
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Traffic, page activity and product events are live. Razorpay
                will add subscriptions, MRR and payment performance.
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
  value,
  description,
  icon,
  status,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  status: Status;
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
      <p className="mt-5 text-2xl font-black">{value}</p>
      <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-600">
        {description}
      </p>
      <div className="mt-4">
        <StatusBadge status={status} />
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
  value,
  suffix,
  connected,
  icon,
}: {
  label: string;
  value?: number;
  suffix: string;
  connected: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-500">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-300">{label}</p>
        <p className="mt-1 text-xs text-zinc-700">
          {connected ? `${value ?? 0}${suffix}` : "Not connected"}
        </p>
      </div>
      <StatusBadge status={connected ? "connected" : "not-connected"} />
    </div>
  );
}

function DataRow({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-300">{label}</p>
        <p className="mt-1 text-xs text-zinc-700">{secondary}</p>
      </div>
      <p className="shrink-0 text-sm font-black text-white">{primary}</p>
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

function formatValue(
  value: number | undefined,
  state: DashboardState["status"]
) {
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (state === "loading") return "Loading";
  return "Not connected";
}


function formatGeneratedAt(dateString: string) {
  const value = new Date(dateString);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(value);
}
