"use client";

import type { JobMatch } from "../types/report";

type Props = {
  jobs: JobMatch[];
};

export default function JobMatches({ jobs }: Props) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h2 className="mb-6 text-2xl font-extrabold text-orange-400">
        🎯 Best Job Matches
      </h2>

      <div className="grid gap-5">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 transition hover:border-orange-500"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                  {job.company}
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {job.role}
                </h3>

                <p className="mt-2 text-gray-400">{job.location}</p>
                <p className="mt-1 font-bold text-green-400">{job.salary}</p>
              </div>

              <div className="text-left md:text-right">
                <div className="text-4xl font-extrabold text-green-400">
                  {job.match}%
                </div>
                <div className="text-sm text-gray-500">Match</div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
              >
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}