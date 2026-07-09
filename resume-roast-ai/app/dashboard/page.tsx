"use client";

import { useEffect, useState } from "react";

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
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeReports") || "[]");
    const jobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setReports(saved);
    setSavedJobs(jobs);
  }, []);

  function deleteReport(id: string) {
    const updated = reports.filter((report) => report.id !== id);
    localStorage.setItem("resumeReports", JSON.stringify(updated));
    setReports(updated);
  }

  function openReport(item: SavedReport) {
    localStorage.setItem("selectedResumeReport", JSON.stringify(item));
    window.location.href = "/report";
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-orange-500 mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Your saved resume roast reports</p>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-gray-300">No reports saved yet.</p>
          <a href="/" className="text-orange-500 font-semibold">
            Analyze your first resume
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((item) => (
            <div
              key={item.id}
              onClick={() => openReport(item)}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 flex items-center justify-between cursor-pointer hover:border-orange-500 transition"
            >
              <div>
                <h2 className="text-xl font-bold">{item.resumeName}</h2>
                <p className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span>ATS: {item.report.atsScore ?? "N/A"}</span>
                  <span>Recruiter: {item.report.recruiterScore ?? "N/A"}</span>
                  <span>Hiring: {item.report.hiringProbability ?? "N/A"}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReport(item.id);
                }}
                className="rounded-lg border border-red-800 px-4 py-2 text-red-400 hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    
      <section className="mt-10">
        <h2 className="text-3xl font-bold text-orange-500 mb-2">Saved Jobs</h2>
        <p className="text-gray-400 mb-6">Jobs you saved from AI recommendations</p>

        {savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-gray-300">No jobs saved yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedJobs.map((job, index) => (
              <div
                key={`${job.company}-${job.role}-${index}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold">{job.company} - {job.role}</h3>
                  <p className="text-sm text-gray-400">{job.location}</p>
                  <p className="text-sm text-green-400">{job.salary}</p>
                  <p className="text-sm text-orange-400">{job.match}% match</p>
                </div>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black hover:bg-orange-400"
                >
                  Apply
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
