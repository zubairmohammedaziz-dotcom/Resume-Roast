"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Crown,
  FileSearch,
  FileText,
  Gauge,
  Home,
  Lightbulb,
  LogOut,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";

const PLAN_KEY = "offernhire_plan";
const PLAN_UPDATED_EVENT = "offernhire-plan-updated";

type SavedReport = {
  id: string;
  resumeName: string;
  createdAt: string;
  report: {
    atsScore?: number;
    recruiterScore?: number;
    hiringProbability?: string;
  };
};

type SavedJob = {
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  match: number;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  atsScore?: number;
};

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [reports, setReports] = useState<SavedReport[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedReports = safeParseArray<SavedReport>(
        localStorage.getItem("resumeReports")
      );

      const jobs = safeParseArray<SavedJob>(
        localStorage.getItem("savedJobs")
      );

      setReports(savedReports);
      setSavedJobs(jobs);
    } catch (error) {
      console.error("Unable to load dashboard history:", error);
      setReports([]);
      setSavedJobs([]);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    function syncPlan() {
      setIsPro(localStorage.getItem(PLAN_KEY) === "pro");
      setPlanLoaded(true);
    }

    if (status === "unauthenticated") {
      setIsPro(false);
      setPlanLoaded(true);
      return;
    }

    syncPlan();

    function handlePlanUpdate(event: Event) {
      const customEvent = event as CustomEvent<{
        plan?: "free" | "pro";
      }>;

      if (customEvent.detail?.plan) {
        setIsPro(customEvent.detail.plan === "pro");
        setPlanLoaded(true);
        return;
      }

      syncPlan();
    }

    window.addEventListener(PLAN_UPDATED_EVENT, handlePlanUpdate);
    window.addEventListener("storage", syncPlan);
    window.addEventListener("focus", syncPlan);

    return () => {
      window.removeEventListener(
        PLAN_UPDATED_EVENT,
        handlePlanUpdate
      );
      window.removeEventListener("storage", syncPlan);
      window.removeEventListener("focus", syncPlan);
    };
  }, [status]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  const dashboardStats = useMemo(() => {
    const reportsByDate = [...reports].sort(
      (a, b) =>
        getDateValue(a.createdAt) - getDateValue(b.createdAt)
    );

    const scoredReports = reportsByDate.filter(
      (item) =>
        typeof item.report?.atsScore === "number" &&
        Number.isFinite(item.report.atsScore)
    );

    const scores = scoredReports.map(
      (item) => item.report.atsScore as number
    );

    const averageAts =
      scores.length > 0
        ? Math.round(
            scores.reduce((total, score) => total + score, 0) /
              scores.length
          )
        : 0;

    const firstAts = scores.length > 0 ? scores[0] : 0;
    const latestAts =
      scores.length > 0 ? scores[scores.length - 1] : 0;
    const bestAts =
      scores.length > 0 ? Math.max(...scores) : 0;

    const atsChange =
      scores.length >= 2 ? Math.round(latestAts - firstAts) : 0;

    const strongestJobMatch =
      savedJobs.length > 0
        ? Math.max(
            ...savedJobs.map((job) =>
              typeof job.match === "number" &&
              Number.isFinite(job.match)
                ? job.match
                : 0
            )
          )
        : 0;

    return {
      reportCount: reports.length,
      jobCount: savedJobs.length,
      averageAts,
      firstAts,
      latestAts,
      bestAts,
      atsChange,
      strongestJobMatch,
    };
  }, [reports, savedJobs]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    return [...reports]
      .sort(
        (a, b) =>
          getDateValue(b.createdAt) - getDateValue(a.createdAt)
      )
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        title: item.resumeName || "Resume analysis",
        description:
          typeof item.report?.atsScore === "number"
            ? `ATS score: ${Math.round(item.report.atsScore)}`
            : "Resume analysis completed",
        createdAt: item.createdAt,
        atsScore: item.report?.atsScore,
      }));
  }, [reports]);

  const recommendedAction = useMemo(() => {
    if (reports.length === 0) {
      return {
        title: "Analyze your first resume",
        description:
          "Start with an ATS and recruiter review to identify your most important improvements.",
        label: "Analyze resume",
        href: "/#resume-analyzer",
        icon: <FileSearch className="h-5 w-5" />,
      };
    }

    if (
      dashboardStats.latestAts > 0 &&
      dashboardStats.latestAts < 70
    ) {
      return {
        title: "Strengthen your latest resume",
        description:
          "Your latest ATS score is below 70. Improve keywords, structure and role alignment before applying.",
        label: "Improve resume",
        href: "/#resume-analyzer",
        icon: <Target className="h-5 w-5" />,
      };
    }

    if (savedJobs.length === 0) {
      return {
        title: "Find matching opportunities",
        description:
          "Your resume is ready for the next step. Generate relevant job matches and save the strongest roles.",
        label: "Find jobs",
        href: "/#resume-analyzer",
        icon: <BriefcaseBusiness className="h-5 w-5" />,
      };
    }

    return {
      title: "Tailor your resume for a saved role",
      description:
        "Use one of your saved opportunities to create a more targeted application.",
      label: "Review saved jobs",
      href: "#saved-opportunities",
      icon: <Rocket className="h-5 w-5" />,
    };
  }, [
    reports.length,
    savedJobs.length,
    dashboardStats.latestAts,
  ]);

  const firstName =
    session?.user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)[0] || "there";

  function deleteReport(item: SavedReport) {
    const confirmed = window.confirm(
      `Delete "${
        item.resumeName || "this resume report"
      }"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const updatedReports = reports.filter(
      (report) => report.id !== item.id
    );

    localStorage.setItem(
      "resumeReports",
      JSON.stringify(updatedReports)
    );

    setReports(updatedReports);
    setMessage("Resume report deleted.");
  }

  function deleteSavedJob(jobToDelete: SavedJob) {
    const confirmed = window.confirm(
      `Remove "${jobToDelete.role}" at ${jobToDelete.company} from your saved opportunities?`
    );

    if (!confirmed) {
      return;
    }

    const updatedJobs = savedJobs.filter(
      (job) =>
        !(
          job.company === jobToDelete.company &&
          job.role === jobToDelete.role &&
          job.url === jobToDelete.url
        )
    );

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );

    setSavedJobs(updatedJobs);
    setMessage("Saved opportunity removed.");
  }

  function openReport(item: SavedReport) {
    localStorage.setItem(
      "selectedResumeReport",
      JSON.stringify(item)
    );

    window.location.assign("/report");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <DashboardHeader
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        loadingSession={status === "loading"}
        isPro={isPro}
        planLoaded={planLoaded}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b0b0b] px-5 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:px-8 lg:px-10 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-100px] top-[-140px] h-[360px] w-[360px] rounded-full bg-orange-500/[0.1] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-160px] left-[-120px] h-[320px] w-[320px] rounded-full bg-amber-500/[0.05] blur-[120px]"
          />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-orange-400" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                    OffernHire Career Dashboard
                  </span>
                </div>

                {planLoaded && <PlanBadge isPro={isPro} />}
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                Track your resume progress, revisit saved
                opportunities and take the next best step in your
                job search.
              </p>
            </div>

            <Link
              href="/#resume-analyzer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:self-auto"
            >
              Analyze another resume
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <RecommendedAction
            title={recommendedAction.title}
            description={recommendedAction.description}
            label={recommendedAction.label}
            href={recommendedAction.href}
            icon={recommendedAction.icon}
          />

          <SubscriptionCard
            isPro={isPro}
            planLoaded={planLoaded}
          />
        </section>

        <section
          aria-label="Dashboard overview"
          className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <DashboardMetric
            label="Latest ATS"
            value={
              dashboardStats.latestAts > 0
                ? `${dashboardStats.latestAts}%`
                : "—"
            }
            description="Most recent scored report"
            icon={<Gauge className="h-4 w-4" />}
          />

          <DashboardMetric
            label="Best ATS"
            value={
              dashboardStats.bestAts > 0
                ? `${dashboardStats.bestAts}%`
                : "—"
            }
            description="Highest saved ATS score"
            icon={<Target className="h-4 w-4" />}
          />

          <DashboardMetric
            label="ATS progress"
            value={
              dashboardStats.reportCount >= 2
                ? formatChange(dashboardStats.atsChange)
                : "—"
            }
            description="First to latest scored report"
            icon={
              dashboardStats.atsChange >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )
            }
          />

          <DashboardMetric
            label="Best job match"
            value={
              dashboardStats.strongestJobMatch > 0
                ? `${Math.round(
                    dashboardStats.strongestJobMatch
                  )}%`
                : "—"
            }
            description="Highest saved opportunity match"
            icon={<BriefcaseBusiness className="h-4 w-4" />}
          />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <QuickAction
            href="/#resume-analyzer"
            title="Analyze a resume"
            description="Get updated ATS and recruiter feedback."
            icon={<FileSearch className="h-5 w-5" />}
          />

          <QuickAction
            href="#saved-reports"
            title="Review reports"
            description={`${dashboardStats.reportCount} saved ${
              dashboardStats.reportCount === 1
                ? "analysis"
                : "analyses"
            } available.`}
            icon={<FileText className="h-5 w-5" />}
          />

          <QuickAction
            href="#saved-opportunities"
            title="Saved opportunities"
            description={`${dashboardStats.jobCount} saved ${
              dashboardStats.jobCount === 1 ? "role" : "roles"
            } to revisit.`}
            icon={<Bookmark className="h-5 w-5" />}
          />
        </section>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        <section className="mt-12 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div
            id="saved-reports"
            className="scroll-mt-24"
            aria-labelledby="reports-title"
          >
            <SectionHeading
              id="reports-title"
              eyebrow="Resume history"
              title="Saved career reports"
              description="Review your scores, recruiter feedback and recommendations."
              count={reports.length}
            />

            {!historyLoaded ? (
              <LoadingCards />
            ) : reports.length === 0 ? (
              <EmptyState
                icon={<FileSearch className="h-6 w-6" />}
                title="No resume reports yet"
                description="Your completed analyses will appear here so you can revisit and compare them."
                actionLabel="Analyze your first resume"
                actionHref="/#resume-analyzer"
              />
            ) : (
              <div className="mt-5 grid gap-4">
                {[...reports]
                  .sort(
                    (a, b) =>
                      getDateValue(b.createdAt) -
                      getDateValue(a.createdAt)
                  )
                  .map((item) => (
                    <ReportCard
                      key={item.id}
                      item={item}
                      onOpen={openReport}
                      onDelete={deleteReport}
                    />
                  ))}
              </div>
            )}
          </div>

          <aside aria-labelledby="activity-title">
            <SectionHeading
              id="activity-title"
              eyebrow="Progress"
              title="Recent activity"
              description="Your latest completed resume analyses."
              count={recentActivity.length}
            />

            <div className="mt-5 rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] p-5 sm:p-6">
              {!historyLoaded ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-white/[0.025]"
                    />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="py-8 text-center">
                  <Lightbulb className="mx-auto h-6 w-6 text-orange-400" />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Your progress starts here
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Complete an analysis to begin building your
                    activity timeline.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => {
                        const report = reports.find(
                          (item) => item.id === activity.id
                        );

                        if (report) {
                          openReport(report);
                        }
                      }}
                      className="group flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-zinc-300">
                          {activity.title}
                        </span>

                        <span className="mt-1 block text-xs text-zinc-600">
                          {activity.description}
                        </span>

                        <span className="mt-1 block text-[10px] text-zinc-700">
                          {formatDate(activity.createdAt)}
                        </span>
                      </span>

                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-zinc-800 transition group-hover:translate-x-0.5 group-hover:text-orange-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <CareerProgress
              averageAts={dashboardStats.averageAts}
              reportCount={dashboardStats.reportCount}
              jobCount={dashboardStats.jobCount}
            />
          </aside>
        </section>

        <section
          id="saved-opportunities"
          className="mt-12 scroll-mt-24"
          aria-labelledby="saved-jobs-title"
        >
          <SectionHeading
            id="saved-jobs-title"
            eyebrow="Opportunity tracker"
            title="Saved career opportunities"
            description="Return to roles saved from your Career Opportunity Hub."
            count={savedJobs.length}
          />

          {!historyLoaded ? (
            <LoadingCards />
          ) : savedJobs.length === 0 ? (
            <EmptyState
              icon={<BriefcaseBusiness className="h-6 w-6" />}
              title="No saved opportunities"
              description="Save promising roles from your job recommendations and they will appear here."
              actionLabel="Find matching jobs"
              actionHref="/#resume-analyzer"
            />
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {savedJobs.map((job, index) => (
                <JobCard
                  key={`${job.company}-${job.role}-${job.url}-${index}`}
                  job={job}
                  onDelete={deleteSavedJob}
                />
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 flex justify-center">
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

function DashboardHeader({
  userName,
  userEmail,
  loadingSession,
  isPro,
  planLoaded,
}: {
  userName?: string | null;
  userEmail?: string | null;
  loadingSession: boolean;
  isPro: boolean;
  planLoaded: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-black text-black">
            O
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-white">
              OffernHire
            </span>

            <span className="block text-[10px] text-zinc-600">
              Your AI Career Copilot
            </span>
          </span>
        </Link>

        <nav
          className="flex items-center gap-2"
          aria-label="Dashboard navigation"
        >
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white sm:px-4"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {!loadingSession && (
            <div className="hidden items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 md:flex">
              <UserRound className="h-4 w-4 text-zinc-600" />

              <div className="max-w-[180px]">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-medium text-zinc-300">
                    {userName || "OffernHire User"}
                  </p>

                  {planLoaded && isPro && (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                  )}
                </div>

                {userEmail && (
                  <p className="truncate text-[10px] text-zinc-700">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3 text-sm font-medium text-zinc-400 transition hover:border-red-500/25 hover:bg-red-500/[0.04] hover:text-red-300 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function RecommendedAction({
  title,
  description,
  label,
  href,
  icon,
}: {
  title: string;
  description: string;
  label: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.035] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.08] text-orange-400">
            {icon}
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-400">
              Recommended next step
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">
              {description}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
        >
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function SubscriptionCard({
  isPro,
  planLoaded,
}: {
  isPro: boolean;
  planLoaded: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${
        isPro
          ? "border-emerald-500/20 bg-emerald-500/[0.045]"
          : "border-white/[0.08] bg-[#0b0b0b]"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
            isPro
              ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
              : "border-orange-500/20 bg-orange-500/[0.07] text-orange-400"
          }`}
        >
          {isPro ? (
            <BadgeCheck className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-600">
            Subscription
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            {!planLoaded
              ? "Checking your plan..."
              : isPro
                ? "OffernHire Pro is active"
                : "OffernHire Free plan"}
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {!planLoaded
              ? "Your plan details will appear shortly."
              : isPro
                ? "Your paid access is connected to this account."
                : "Upgrade when you need additional Pro tools and usage."}
          </p>

          {planLoaded && !isPro && (
            <Link
              href="/#pricing"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
            >
              View Pro plan
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function PlanBadge({ isPro }: { isPro: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        isPro
          ? "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300"
          : "border-white/[0.1] bg-white/[0.04] text-zinc-400"
      }`}
    >
      {isPro ? (
        <Crown className="h-3.5 w-3.5" />
      ) : (
        <ShieldCheck className="h-3.5 w-3.5" />
      )}

      {isPro ? "Pro active" : "Free plan"}
    </span>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-5 transition hover:border-orange-500/25 hover:bg-[#0e0e0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
          {icon}
        </span>

        <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-orange-400" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </Link>
  );
}

function DashboardMetric({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
          {label}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
          {icon}
        </span>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">
        {description}
      </p>
    </article>
  );
}

function ReportCard({
  item,
  onOpen,
  onDelete,
}: {
  item: SavedReport;
  onOpen: (item: SavedReport) => void;
  onDelete: (item: SavedReport) => void;
}) {
  return (
    <article className="group rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] p-5 transition hover:border-orange-500/25 hover:bg-[#0e0e0e] sm:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="flex min-w-0 flex-1 gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.07] text-orange-400">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
              {item.resumeName || "Resume analysis"}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(item.createdAt)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <ScoreBadge
                label="ATS"
                value={formatScore(item.report?.atsScore)}
              />

              <ScoreBadge
                label="Recruiter"
                value={formatScore(
                  item.report?.recruiterScore
                )}
              />

              <ScoreBadge
                label="Hiring"
                value={
                  item.report?.hiringProbability || "N/A"
                }
              />
            </div>
          </div>
        </button>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 lg:border-0 lg:pt-0">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="group/open inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            Open report

            <ArrowRight className="h-4 w-4 transition-transform group-hover/open:translate-x-0.5" />
          </button>

          <button
            type="button"
            aria-label={`Delete ${
              item.resumeName || "resume report"
            }`}
            onClick={() => onDelete(item)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.04] text-red-400 transition hover:border-red-500/30 hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function JobCard({
  job,
  onDelete,
}: {
  job: SavedJob;
  onDelete: (job: SavedJob) => void;
}) {
  return (
    <article className="rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] p-5 transition hover:border-orange-500/25 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <CompanyMark company={job.company} />

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              {job.company || "Company unavailable"}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              {job.role || "Career opportunity"}
            </h3>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-xs font-semibold text-orange-300">
          {Math.round(job.match || 0)}% match
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <MetadataBadge
          icon={<MapPin className="h-3.5 w-3.5" />}
          label={job.location || "India"}
        />

        <MetadataBadge
          icon={
            <BriefcaseBusiness className="h-3.5 w-3.5" />
          }
          label={job.salary || "Salary not disclosed"}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <button
          type="button"
          onClick={() => onDelete(job)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.04] text-red-400 transition hover:border-red-500/30 hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label={`Remove ${
            job.role || "saved opportunity"
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {isValidExternalUrl(job.url) ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            View opportunity

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        ) : (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-600">
            <CircleAlert className="h-4 w-4" />
            Link unavailable
          </span>
        )}
      </div>
    </article>
  );
}

function CareerProgress({
  averageAts,
  reportCount,
  jobCount,
}: {
  averageAts: number;
  reportCount: number;
  jobCount: number;
}) {
  const resumeProgress = Math.min(
    100,
    Math.max(0, averageAts)
  );

  const consistencyProgress = Math.min(
    100,
    reportCount * 10
  );

  const opportunityProgress = Math.min(
    100,
    jobCount * 20
  );

  return (
    <section className="mt-4 rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-400">
        Career progress
      </p>

      <div className="mt-5 space-y-5">
        <ProgressBar
          label="Average ATS strength"
          value={resumeProgress}
        />

        <ProgressBar
          label="Analysis consistency"
          value={consistencyProgress}
        />

        <ProgressBar
          label="Opportunity shortlist"
          value={opportunityProgress}
        />
      </div>

      <p className="mt-5 text-[10px] leading-5 text-zinc-700">
        Progress is calculated only from your saved resume
        reports and opportunities.
      </p>
    </section>
  );
}

function ProgressBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="text-zinc-500">{label}</span>

        <span className="font-semibold text-zinc-300">
          {Math.round(value)}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  count,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
          {eyebrow}
        </p>

        <h2
          id={id}
          className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl"
        >
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </div>

      <span className="self-start rounded-xl border border-white/[0.08] bg-[#0b0b0b] px-4 py-2 text-sm font-semibold text-zinc-400 sm:self-auto">
        {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/[0.1] bg-[#0b0b0b] px-5 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
        {icon}
      </span>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LoadingCards() {
  return (
    <div
      className="mt-5 grid gap-4"
      aria-label="Loading dashboard content"
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-[1.4rem] border border-white/[0.07] bg-[#0b0b0b]"
        />
      ))}
    </div>
  );
}

function ScoreBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="rounded-lg border border-white/[0.08] bg-black/25 px-3 py-1.5 text-xs text-zinc-500">
      {label}:{" "}
      <strong className="font-semibold text-zinc-300">
        {value}
      </strong>
    </span>
  );
}

function MetadataBadge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/25 px-3 py-1.5 text-xs text-zinc-500">
      {icon}
      {label}
    </span>
  );
}

function CompanyMark({ company }: { company: string }) {
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.07] text-sm font-semibold text-orange-300">
      {initials || "CO"}
    </div>
  );
}

function safeParseArray<T>(value: string | null): T[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function formatScore(score?: number) {
  return typeof score === "number" &&
    Number.isFinite(score)
    ? `${Math.round(score)}`
    : "N/A";
}

function formatChange(change: number) {
  if (change > 0) {
    return `+${change}`;
  }

  return `${change}`;
}

function getDateValue(value: string) {
  const date = new Date(value);
  const timestamp = date.getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isValidExternalUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}