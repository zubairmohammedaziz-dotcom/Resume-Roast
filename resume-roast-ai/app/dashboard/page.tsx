"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileSearch,
  FileText,
  Home,
  LogOut,
  MapPin,
  Sparkles,
  Target,
  Trash2,
  UserRound,
} from "lucide-react";

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

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [reports, setReports] = useState<SavedReport[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedReports = JSON.parse(
        localStorage.getItem("resumeReports") || "[]"
      ) as SavedReport[];

      const jobs = JSON.parse(
        localStorage.getItem("savedJobs") || "[]"
      ) as SavedJob[];

      setReports(Array.isArray(savedReports) ? savedReports : []);
      setSavedJobs(Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error("Unable to load dashboard history:", error);
      setReports([]);
      setSavedJobs([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const dashboardStats = useMemo(() => {
    const validScores = reports
      .map((item) => item.report?.atsScore)
      .filter((score): score is number => typeof score === "number");

    const averageAts =
      validScores.length > 0
        ? Math.round(
            validScores.reduce((total, score) => total + score, 0) /
              validScores.length
          )
        : 0;

    const strongestJobMatch =
      savedJobs.length > 0
        ? Math.max(...savedJobs.map((job) => job.match || 0))
        : 0;

    return {
      reportCount: reports.length,
      jobCount: savedJobs.length,
      averageAts,
      strongestJobMatch,
    };
  }, [reports, savedJobs]);

  function deleteReport(id: string) {
    const updatedReports = reports.filter((report) => report.id !== id);

    localStorage.setItem("resumeReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
    setMessage("Resume report deleted.");
  }

  function deleteSavedJob(jobToDelete: SavedJob) {
    const updatedJobs = savedJobs.filter(
      (job) =>
        !(
          job.company === jobToDelete.company &&
          job.role === jobToDelete.role
        )
    );

    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    setSavedJobs(updatedJobs);
    setMessage("Saved opportunity removed.");
  }

  function openReport(item: SavedReport) {
    localStorage.setItem("selectedResumeReport", JSON.stringify(item));
    window.location.href = "/report";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <DashboardHeader
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        loadingSession={status === "loading"}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b0b0b] px-5 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:px-8 lg:px-10 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-100px] top-[-140px] h-[360px] w-[360px] rounded-full bg-orange-500/[0.1] blur-[120px]"
          />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                  Career Copilot Dashboard
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Your career workspace, all in one place.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                Review previous analyses, return to saved opportunities and
                continue improving every application.
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

        <section
          aria-label="Dashboard overview"
          className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <DashboardMetric
            label="Resume reports"
            value={dashboardStats.reportCount}
            description="Saved analyses"
            icon={<FileText className="h-4 w-4" />}
          />

          <DashboardMetric
            label="Average ATS"
            value={
              dashboardStats.averageAts > 0
                ? `${dashboardStats.averageAts}%`
                : "—"
            }
            description="Across saved reports"
            icon={<Target className="h-4 w-4" />}
          />

          <DashboardMetric
            label="Saved opportunities"
            value={dashboardStats.jobCount}
            description="Roles to revisit"
            icon={<Bookmark className="h-4 w-4" />}
          />

          <DashboardMetric
            label="Best job match"
            value={
              dashboardStats.strongestJobMatch > 0
                ? `${dashboardStats.strongestJobMatch}%`
                : "—"
            }
            description="Highest saved match"
            icon={<BriefcaseBusiness className="h-4 w-4" />}
          />
        </section>

        {message && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        <section className="mt-10" aria-labelledby="reports-title">
          <SectionHeading
            eyebrow="Resume history"
            title="Saved career reports"
            description="Open any report to review your scores, recruiter feedback and recommendations."
            count={reports.length}
          />

          {!loaded ? (
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
              {reports.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] transition hover:border-orange-500/25 hover:bg-[#0e0e0e]"
                >
                  <button
                    type="button"
                    onClick={() => openReport(item)}
                    className="w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 gap-4">
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
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 lg:border-0 lg:pt-0">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400">
                          Open report
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>

                        <button
                          type="button"
                          aria-label={`Delete ${item.resumeName}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteReport(item.id);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.04] text-red-400 transition hover:border-red-500/30 hover:bg-red-500/[0.08]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12" aria-labelledby="saved-jobs-title">
          <SectionHeading
            eyebrow="Opportunity tracker"
            title="Saved career opportunities"
            description="Return to roles you saved from your Career Opportunity Hub."
            count={savedJobs.length}
          />

          {!loaded ? (
            <LoadingCards />
          ) : savedJobs.length === 0 ? (
            <EmptyState
              icon={<BriefcaseBusiness className="h-6 w-6" />}
              title="No saved opportunities"
              description="Save promising roles from your job recommendations and they will appear here."
              actionLabel="Analyze a resume"
              actionHref="/#resume-analyzer"
            />
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {savedJobs.map((job, index) => (
                <article
                  key={`${job.company}-${job.role}-${index}`}
                  className="rounded-[1.4rem] border border-white/[0.08] bg-[#0b0b0b] p-5 transition hover:border-orange-500/25 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <CompanyMark company={job.company} />

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          {job.company}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {job.role}
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
                      icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
                      label={job.salary || "Salary varies"}
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
                    <button
                      type="button"
                      onClick={() => deleteSavedJob(job)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.04] text-red-400 transition hover:border-red-500/30 hover:bg-red-500/[0.08]"
                      aria-label={`Remove ${job.role}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
                    >
                      Search live jobs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
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
            Return to Resume Roast AI
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
}: {
  userName?: string | null;
  userEmail?: string | null;
  loadingSession: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-bold text-black">
            R
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-white">
              Resume Roast AI
            </span>

            <span className="block text-[10px] text-zinc-600">
              Your AI Career Copilot
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Dashboard navigation">
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
                <p className="truncate text-xs font-medium text-zinc-300">
                  {userName || "Career Copilot User"}
                </p>

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

function DashboardMetric({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
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

      <p className="mt-2 text-xs text-zinc-600">{description}</p>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  count,
}: {
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
          id={
            title === "Saved career reports"
              ? "reports-title"
              : "saved-jobs-title"
          }
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
  icon: React.ReactNode;
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

      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>

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
    <div className="mt-5 grid gap-4">
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
      <strong className="font-semibold text-zinc-300">{value}</strong>
    </span>
  );
}

function MetadataBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
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

function formatScore(score?: number) {
  return typeof score === "number" ? `${Math.round(score)}` : "N/A";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}