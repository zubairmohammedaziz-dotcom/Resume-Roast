"use client";

import {
  FileText,
  ScanSearch,
  Briefcase,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Resumes",
    value: "0",
    icon: FileText,
    color: "text-orange-400",
  },
  {
    title: "ATS Score",
    value: "--",
    icon: ScanSearch,
    color: "text-cyan-400",
  },
  {
    title: "Job Matches",
    value: "0",
    icon: Briefcase,
    color: "text-green-400",
  },
  {
    title: "AI Credits",
    value: "5",
    icon: Sparkles,
    color: "text-yellow-400",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-orange-500"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-zinc-400">{item.title}</h3>
              <Icon className={`h-6 w-6 ${item.color}`} />
            </div>

            <p className="mt-5 text-4xl font-black text-white">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}