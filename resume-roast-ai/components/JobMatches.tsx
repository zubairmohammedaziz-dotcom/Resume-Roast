"use client";

import { useMemo, useState } from "react";
import type { JobMatch } from "../types/report";

type Props = {
  jobs: JobMatch[];
};

export default function JobMatches({ jobs }: Props) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const sortedJobs = useMemo(() => {
    return [...(jobs || [])].sort(
      (first, second) => second.match - first.match
    );
  }, [jobs]);

  if (sortedJobs.length === 0) return null;

  function getJobKey(job: JobMatch) {
    return `${job.company}-${job.role}`;
  }

  function handleTailor(job: JobMatch) {
    const jobDescription = `
Company: ${job.company}
Role: ${job.role}
Location: ${job.location}
Salary: ${job.salary}

Why this role matches:
${(job.whyMatched || []).map((item) => `- ${item}`).join("\n")}

Skills to include or improve:
${(job.missingSkills || []).map((item) => `- ${item}`).join("\n")}

Create a tailored ATS resume for this role.
`.trim();

    window.dispatchEvent(
      new CustomEvent("tailor-job", {
        detail: jobDescription,
      })
    );

    setMessage(`${job.role} added to the tailoring workspace.`);
  }

  function handleSave(job: JobMatch) {
    const key = getJobKey(job);

    const storedJobs = JSON.parse(
      localStorage.getItem("savedJobs") || "[]"
    );

    const alreadySaved = storedJobs.some(
      (item: JobMatch) =>
        item.company === job.company && item.role === job.role
    );

    if (alreadySaved) {
      setMessage("This job is already saved.");
      return;
    }

    localStorage.setItem(
      "savedJobs",
      JSON.stringify([...storedJobs, job])
    );

    setSavedJobs((current) => [...current, key]);
    setMessage("Job saved successfully.");
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
            Recommended roles
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Best opportunities for your profile
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Compare your strongest matches and select one to create a targeted
            resume.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Roles analyzed
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {sortedJobs.length}
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-400">
          {message}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {sortedJobs.map((job, index) => {
          const isTopMatch = index === 0;
          const saved = savedJobs.includes(getJobKey(job));

          return (
            <article
              key={`${job.company}-${job.role}-${index}`}
              className={`group overflow-hidden rounded-[1.5rem] border bg-[#0b0b0b] transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${
                isTopMatch
                  ? "border-orange-500/40 shadow-[0_20px_60px_rgba(249,115,22,0.08)]"
                  : "border-white/10 hover:border-zinc-600"
              }`}
            >
              {isTopMatch && (
                <div className="border-b border-orange-500/20 bg-orange-500/10 px-5 py-2.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
                    Top match
                  </p>
                </div>
              )}

              <div className="p-5 md:p-7">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 gap-4">
                    <CompanyMark company={job.company} />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        {job.company}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white md:text-2xl">
                        {job.role}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <MetadataBadge
                          icon={<LocationIcon />}
                          label={job.location}
                        />

                        <MetadataBadge
                          icon={<SalaryIcon />}
                          label={job.salary}
                        />
                      </div>
                    </div>
                  </div>

                  <MatchScore score={job.match} />
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-2">
                  <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon />

                      <h4 className="text-sm font-semibold text-white">
                        Why you match
                      </h4>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {(job.whyMatched || []).length > 0 ? (
                        job.whyMatched.slice(0, 4).map((item, itemIndex) => (
                          <li
                            key={`${item}-${itemIndex}`}
                            className="flex gap-3 text-sm leading-6 text-zinc-400"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-zinc-500">
                          Your resume contains relevant experience for this role.
                        </li>
                      )}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
                    <div className="flex items-center gap-2">
                      <ImproveIcon />

                      <h4 className="text-sm font-semibold text-white">
                        Skills to strengthen
                      </h4>
                    </div>

                    {(job.missingSkills || []).length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.missingSkills.map((skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-zinc-500">
                        No critical skill gaps were identified.
                      </p>
                    )}
                  </section>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                  <p className="text-xs text-zinc-600">
                    Match scores are AI estimates based on your resume.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSave(job)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    >
                      <SaveIcon filled={saved} />
                      {saved ? "Saved" : "Save"}
                    </button>

                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    >
                      View role
                      <ExternalLinkIcon />
                    </a>

                    <button
                      onClick={() => handleTailor(job)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                      Tailor resume
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
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
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950 text-sm font-semibold text-white shadow-inner">
      {initials || "CO"}
    </div>
  );
}

function MatchScore({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  const label =
    safeScore >= 85
      ? "Excellent"
      : safeScore >= 70
      ? "Strong"
      : safeScore >= 55
      ? "Moderate"
      : "Developing";

  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
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
        <p className="text-xs text-zinc-600">Match quality</p>
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
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#111111] px-3 py-1.5 text-xs font-medium text-zinc-400">
      {icon}
      {label}
    </span>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5 text-zinc-500"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SalaryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5 text-zinc-500"
      aria-hidden="true"
    >
      <path
        d="M4 7h16v11H4V7Zm3-3h10v3M8 12h8M12 9v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-emerald-400"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImproveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-orange-400"
      aria-hidden="true"
    >
      <path
        d="M4 18 10 12l4 4 6-8M15 8h5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M6 4h12v17l-6-4-6 4V4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5M19 5l-8 8M18 13v6H5V6h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}