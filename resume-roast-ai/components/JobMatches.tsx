"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ExternalLink,
  IndianRupee,
  Lightbulb,
  MapPin,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import type { JobMatch } from "../types/report";

type Props = {
  jobs: JobMatch[];
};

type Platform = {
  name: string;
  shortName: string;
  url: string;
};

export default function JobMatches({ jobs }: Props) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [openSearchMenu, setOpenSearchMenu] = useState<string | null>(null);

  const sortedJobs = useMemo(
    () => [...(jobs || [])].sort((a, b) => b.match - a.match),
    [jobs]
  );

  useEffect(() => {
    try {
      const storedJobs: JobMatch[] = JSON.parse(
        localStorage.getItem("savedJobs") || "[]"
      );

      setSavedJobs(storedJobs.map(getJobKey));
    } catch {
      setSavedJobs([]);
    }
  }, []);

  if (sortedJobs.length === 0) return null;

  function handleTailor(job: JobMatch) {
    const jobDescription = `
Target role: ${job.role}
Employer type: ${job.company}
Preferred location: ${job.location}
Estimated salary: ${job.salary}

Why this role fits:
${(job.whyMatched || []).map((item) => `- ${item}`).join("\n")}

Skills to strengthen:
${(job.missingSkills || []).map((item) => `- ${item}`).join("\n")}

Create a targeted, ATS-friendly resume for this role.
`.trim();

    window.dispatchEvent(
      new CustomEvent("tailor-job", {
        detail: jobDescription,
      })
    );

    setMessage(`${job.role} is ready in the tailoring workspace.`);
  }

  function handleSave(job: JobMatch) {
    try {
      const key = getJobKey(job);
      const storedJobs: JobMatch[] = JSON.parse(
        localStorage.getItem("savedJobs") || "[]"
      );

      const alreadySaved = storedJobs.some(
        (item) => getJobKey(item) === key
      );

      if (alreadySaved) {
        setMessage("This opportunity is already saved.");
        return;
      }

      localStorage.setItem(
        "savedJobs",
        JSON.stringify([...storedJobs, job])
      );

      setSavedJobs((current) => [...current, key]);
      setMessage("Opportunity saved to your dashboard.");
    } catch {
      setMessage("Unable to save this opportunity.");
    }
  }

  return (
    <section className="mt-8" aria-labelledby="opportunity-hub-title">
      <header className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                Career Opportunity Hub
              </p>
            </div>

            <h2
              id="opportunity-hub-title"
              className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl"
            >
              Career directions matched to your profile
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              Compare your strongest role matches, understand your fit and
              search live opportunities across leading job platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SummaryMetric
              label="Roles analyzed"
              value={`${sortedJobs.length}`}
            />

            <SummaryMetric
              label="Top match"
              value={`${Math.round(sortedJobs[0]?.match || 0)}%`}
            />
          </div>
        </div>

        <div className="border-t border-white/[0.07] bg-black/20 px-5 py-3 sm:px-6">
          <p className="flex gap-2 text-xs leading-5 text-zinc-600">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
            These are AI-recommended career directions—not claims of specific
            vacancies. Use the platform search to view currently available
            jobs.
          </p>
        </div>
      </header>

      {message && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300"
        >
          <Check className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <div className="mt-5 space-y-4">
        {sortedJobs.map((job, index) => {
          const key = getJobKey(job);
          const isTopMatch = index === 0;
          const saved = savedJobs.includes(key);
          const insights = getRoleInsights(job);
          const platforms = createPlatformLinks(job);
          const searchMenuOpen = openSearchMenu === key;

          return (
            <article
              key={`${key}-${index}`}
              className={`relative overflow-hidden rounded-[1.6rem] border bg-[#0b0b0b] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_80px_rgba(0,0,0,0.38)] ${
                isTopMatch
                  ? "border-orange-500/35 shadow-[0_22px_70px_rgba(249,115,22,0.07)]"
                  : "border-white/[0.08] hover:border-white/[0.16]"
              }`}
            >
              {isTopMatch && (
                <div className="flex items-center justify-between border-b border-orange-500/15 bg-orange-500/[0.075] px-5 py-2.5 sm:px-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                    <Target className="h-3.5 w-3.5" />
                    Best profile match
                  </span>

                  <span className="text-[10px] text-orange-300/60">
                    Recommended first
                  </span>
                </div>
              )}

              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 gap-4">
                    <CompanyMark company={job.company} />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-600">
                        {job.company}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
                        {job.role}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <MetadataBadge
                          icon={<MapPin className="h-3.5 w-3.5" />}
                          label={job.location}
                        />

                        <MetadataBadge
                          icon={<IndianRupee className="h-3.5 w-3.5" />}
                          label={job.salary}
                        />

                        <MetadataBadge
                          icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
                          label={job.seniority || insights.seniority}
                        />
                      </div>
                    </div>
                  </div>

                  <MatchScore score={job.match} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <InsightCard
                    label="Role fit"
                    value={insights.fit}
                    icon={<Target className="h-4 w-4" />}
                  />

                  <InsightCard
                    label="Application level"
                    value={insights.difficulty}
                    icon={<TrendingUp className="h-4 w-4" />}
                  />

                  <InsightCard
                    label="Recommended action"
                    value={insights.action}
                    icon={<ArrowRight className="h-4 w-4" />}
                  />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400">
                        <Check className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Why this role fits
                        </p>

                        <p className="mt-0.5 text-[10px] text-zinc-700">
                          Evidence identified in your resume
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {(job.whyMatched || []).length > 0 ? (
                        job.whyMatched.slice(0, 4).map((item, itemIndex) => (
                          <li
                            key={`${item}-${itemIndex}`}
                            className="flex gap-3 text-sm leading-6 text-zinc-400"
                          >
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm leading-6 text-zinc-500">
                          Your experience contains relevant signals for this
                          career direction.
                        </li>
                      )}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
                        <TrendingUp className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Improve before applying
                        </p>

                        <p className="mt-0.5 text-[10px] text-zinc-700">
                          Skills that could increase your match
                        </p>
                      </div>
                    </div>

                    {(job.missingSkills || []).length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.missingSkills.slice(0, 5).map((skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-xs font-medium text-orange-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-zinc-500">
                        No critical skill gaps were identified for this role.
                      </p>
                    )}

                    <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-5 text-zinc-600">
                      Tailoring your summary and experience bullets around this
                      role can improve application relevance.
                    </p>
                  </section>
                </div>

                <footer className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 lg:flex-row lg:items-center">
                  <p className="max-w-md text-xs leading-5 text-zinc-700">
                    Match scores and salary ranges are AI estimates. Verify job
                    requirements and compensation before applying.
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSave(job)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={saved ? "currentColor" : "none"}
                      />
                      {saved ? "Saved" : "Save"}
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        aria-expanded={searchMenuOpen}
                        onClick={() =>
                          setOpenSearchMenu(searchMenuOpen ? null : key)
                        }
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/30 hover:text-white"
                      >
                        <Search className="h-4 w-4" />
                        Search live jobs
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {searchMenuOpen && (
                        <div className="absolute bottom-[calc(100%+8px)] right-0 z-20 w-full min-w-[230px] overflow-hidden rounded-xl border border-white/[0.1] bg-[#111111] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
                          {platforms.map((platform) => (
                            <a
                              key={platform.name}
                              href={platform.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <span>
                                Search on{" "}
                                <strong className="font-semibold text-zinc-200">
                                  {platform.name}
                                </strong>
                              </span>

                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTailor(job)}
                      className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
                    >
                      Tailor for this role
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getJobKey(job: JobMatch) {
  return `${job.company}-${job.role}`;
}

function getRoleInsights(job: JobMatch) {
  const score = Math.max(0, Math.min(100, Math.round(job.match || 0)));
  const gaps = job.missingSkills?.length || 0;

  const fit =
    score >= 85
      ? "Excellent fit"
      : score >= 72
      ? "Strong fit"
      : score >= 58
      ? "Potential fit"
      : "Exploratory fit";

  const difficulty =
    score >= 82 && gaps <= 2
      ? "Apply now"
      : score >= 68
      ? "Competitive"
      : "Stretch role";

  const action =
    score >= 82
      ? "Tailor and apply"
      : score >= 65
      ? "Strengthen keywords"
      : "Build missing skills";

  const seniority =
    score >= 80
      ? "Aligned seniority"
      : score >= 60
      ? "Review experience"
      : "Career transition";

  return {
    fit,
    difficulty,
    action,
    seniority,
  };
}

function createPlatformLinks(job: JobMatch): Platform[] {
  const role = job.role?.trim() || "jobs";
  const location = normalizeLocation(job.location);

  const query = encodeURIComponent(role);
  const encodedLocation = encodeURIComponent(location);
  const roleSlug = slugify(role);
  const locationSlug = slugify(location);

  return [
    {
      name: "LinkedIn",
      shortName: "LI",
      url:
        job.searchLinks?.linkedin ||
        job.url ||
        `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${encodedLocation}`,
    },
    {
      name: "Indeed India",
      shortName: "IN",
      url:
        job.searchLinks?.indeed ||
        `https://in.indeed.com/jobs?q=${query}&l=${encodedLocation}`,
    },
    {
      name: "Naukri",
      shortName: "NK",
      url:
        job.searchLinks?.naukri ||
        `https://www.naukri.com/${roleSlug}-jobs-in-${locationSlug}`,
    },
    {
      name: "Foundit",
      shortName: "FD",
      url:
        job.searchLinks?.foundit ||
        `https://www.foundit.in/search/${roleSlug}-jobs-in-${locationSlug}`,
    },
  ];
}

function normalizeLocation(location?: string) {
  if (!location) return "India";

  const cleaned = location
    .replace(/\s*\/\s*/g, " ")
    .replace(/\bremote\b/gi, "")
    .trim();

  return cleaned || "India";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[105px] rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-semibold text-white">{value}</p>
    </div>
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
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-zinc-950 text-sm font-semibold text-orange-200 shadow-inner">
      {initials || "CO"}
    </div>
  );
}

function MatchScore({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (safeScore / 100) * circumference;

  const label =
    safeScore >= 85
      ? "Excellent"
      : safeScore >= 70
      ? "Strong"
      : safeScore >= 55
      ? "Moderate"
      : "Developing";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#101010] px-4 py-3">
      <div className="relative h-16 w-16 shrink-0">
        <svg
          viewBox="0 0 64 64"
          className="h-16 w-16 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#27272a"
            strokeWidth="4"
          />

          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {safeScore}%
        </span>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.13em] text-zinc-700">
          Profile match
        </p>

        <p className="mt-1 text-sm font-semibold text-white">{label}</p>
      </div>
    </div>
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
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101010] px-3 py-1.5 text-xs font-medium text-zinc-500">
      {icon}
      {label}
    </span>
  );
}

function InsightCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3.5">
      <div className="flex items-center gap-2 text-orange-400">{icon}</div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-zinc-300">{value}</p>
    </div>
  );
}