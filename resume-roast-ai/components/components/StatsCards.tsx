"use client";

import {
  BriefcaseBusiness,
  FileCheck2,
  Gauge,
  Sparkles,
} from "lucide-react";

type Props = {
  resumeCount?: number;
  atsScore?: number | null;
  jobMatchCount?: number;
  creditCount?: number;
};

export default function StatsCards({
  resumeCount = 0,
  atsScore = null,
  jobMatchCount = 0,
  creditCount = 5,
}: Props) {
  const stats = [
    {
      label: "Resumes analyzed",
      value: String(resumeCount),
      description: "Documents reviewed",
      icon: FileCheck2,
      accent: "text-zinc-300",
    },
    {
      label: "Latest ATS score",
      value:
        typeof atsScore === "number"
          ? `${Math.max(0, Math.min(100, Math.round(atsScore)))}`
          : "—",
      description: "Most recent analysis",
      icon: Gauge,
      accent: "text-orange-400",
    },
    {
      label: "Job matches",
      value: String(jobMatchCount),
      description: "Relevant roles found",
      icon: BriefcaseBusiness,
      accent: "text-emerald-400",
    },
    {
      label: "AI credits",
      value: String(creditCount),
      description: "Available actions",
      icon: Sparkles,
      accent: "text-violet-400",
    },
  ];

  return (
    <section>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Workspace overview
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Your activity
          </h2>
        </div>

        <p className="text-xs text-zinc-600">
          Updated from your latest application activity
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="group rounded-[1.35rem] border border-white/10 bg-[#101010] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30">
                  <Icon
                    className={`h-4.5 w-4.5 ${item.accent}`}
                    strokeWidth={1.7}
                  />
                </div>

                <TrendIndicator
                  positive={item.label !== "AI credits"}
                />
              </div>

              <p className="mt-6 text-[11px] font-medium text-zinc-600">
                {item.label}
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {item.value}
              </p>

              <p className="mt-2 text-xs text-zinc-700">
                {item.description}
              </p>

              <div className="mt-5 h-px bg-white/5 transition group-hover:bg-white/10" />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TrendIndicator({
  positive,
}: {
  positive: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${
        positive
          ? "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400"
          : "border-white/10 bg-black/30 text-zinc-600"
      }`}
    >
      {positive && <TrendIcon />}
      {positive ? "Active" : "Available"}
    </span>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path
        d="m6 15 5-5 3 3 4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}