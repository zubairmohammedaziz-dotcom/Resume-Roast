"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import JobMatches from "../components/JobMatches";
import TailorResume from "../components/TailorResume";
import type { Report } from "../types/report";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type WorkspaceTab = "overview" | "jobs" | "tailor";

export default function Home() {
  const [jobRecommendations, setJobRecommendations] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");

  useEffect(() => {
    function openTailorWorkspace() {
      setActiveTab("tailor");

      window.setTimeout(() => {
        document.getElementById("career-workspace")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    window.addEventListener("tailor-job", openTailorWorkspace);

    return () => {
      window.removeEventListener("tailor-job", openTailorWorkspace);
    };
  }, []);

  const displayedJobs = useMemo(() => {
    if (jobRecommendations.length > 0) {
      return jobRecommendations;
    }

    return report?.jobMatches || [];
  }, [jobRecommendations, report]);

  async function handleAnalyze() {
    if (!selectedFile) {
      setStatus("Upload a resume before starting the analysis.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Reviewing your resume...");
      setReport(null);
      setJobRecommendations([]);
      setActiveTab("overview");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus(data.message || "Resume analysis failed.");
        return;
      }

      const reportData: Report = {
        success: true,
        message: data.message || "Resume analyzed successfully.",
        fileName: data.fileName || selectedFile.name,

        candidateName:
          typeof data.candidateName === "string"
            ? data.candidateName.trim()
            : "",

        headline:
          typeof data.headline === "string"
            ? data.headline.trim()
            : "Professional Candidate",

        contact:
          data.contact && typeof data.contact === "object"
            ? {
                email:
                  typeof data.contact.email === "string"
                    ? data.contact.email.trim()
                    : "",
                phone:
                  typeof data.contact.phone === "string"
                    ? data.contact.phone.trim()
                    : "",
                location:
                  typeof data.contact.location === "string"
                    ? data.contact.location.trim()
                    : "",
                linkedin:
                  typeof data.contact.linkedin === "string"
                    ? data.contact.linkedin.trim()
                    : "",
              }
            : {
                email: "",
                phone: "",
                location: "",
                linkedin: "",
              },

        atsScore: Number(data.atsScore) || 0,
        recruiterScore: Number(data.recruiterScore) || 0,
        hiringProbability: data.hiringProbability || "Medium",

        roast: data.roast || "No recruiter feedback generated.",

        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],

        missingKeywords: Array.isArray(data.missingKeywords)
          ? data.missingKeywords
          : [],

        improvedSummary:
          data.improvedSummary || "No improved summary generated.",

        rewrittenBullets: Array.isArray(data.rewrittenBullets)
          ? data.rewrittenBullets
          : [],

        optimizedSkills: Array.isArray(data.optimizedSkills)
          ? data.optimizedSkills
          : [],

        interviewQuestions: Array.isArray(data.interviewQuestions)
          ? data.interviewQuestions
          : [],

        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],

        certifications: Array.isArray(data.certifications)
          ? data.certifications
          : [],

        projects: Array.isArray(data.projects) ? data.projects : [],

        jobMatches: Array.isArray(data.jobMatches) ? data.jobMatches : [],
      };

      setReport(reportData);

      const savedReports = JSON.parse(
        localStorage.getItem("resumeReports") || "[]"
      );

      const newSavedReport = {
        id: Date.now().toString(),
        resumeName: selectedFile.name,
        createdAt: new Date().toISOString(),
        report: reportData,
      };

      localStorage.setItem(
        "resumeReports",
        JSON.stringify([newSavedReport, ...savedReports])
      );

      setJobsLoading(true);

      try {
        const jobsResponse = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report: reportData,
          }),
        });

        const jobs = await jobsResponse.json();

        if (Array.isArray(jobs)) {
          setJobRecommendations(jobs);
        }
      } catch (error) {
        console.error("Job recommendation error:", error);
      } finally {
        setJobsLoading(false);
      }

      setStatus("Analysis complete.");
    } catch (error) {
      console.error("Resume analysis error:", error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Unable to copy. Please try again.");
    }
  }

  function startNewAnalysis() {
    setSelectedFile(null);
    setReport(null);
    setJobRecommendations([]);
    setStatus("");
    setActiveTab("overview");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      {!report ? (
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8">
          <Hero />
          <FeatureGrid />

          <UploadWorkspace
            selectedFile={selectedFile}
            status={status}
            isLoading={isLoading}
            jobsLoading={jobsLoading}
            onFileChange={(file) => {
              setSelectedFile(file);
              setStatus("");
              setReport(null);
              setJobRecommendations([]);
            }}
            onAnalyze={handleAnalyze}
          />

          <Pricing />
          <Footer />
        </div>
      ) : (
        <>
          <div
            id="career-workspace"
            className="mx-auto max-w-[1500px] px-4 pb-20 pt-8 md:px-8"
          >
            <WorkspaceHeader
              report={report}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onStartOver={startNewAnalysis}
            />

            <div className="mt-6">
              <div className={activeTab === "overview" ? "block" : "hidden"}>
                <OverviewWorkspace
                  report={report}
                  copyText={copyText}
                  status={status}
                  onContinue={() => setActiveTab("jobs")}
                />
              </div>

              <div className={activeTab === "jobs" ? "block" : "hidden"}>
                <JobsWorkspace
                  jobs={displayedJobs}
                  loading={jobsLoading}
                  onContinue={() => setActiveTab("tailor")}
                />
              </div>

              <div className={activeTab === "tailor" ? "block" : "hidden"}>
                <TailorResume report={report} />
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </main>
  );
}

function UploadWorkspace({
  selectedFile,
  status,
  isLoading,
  jobsLoading,
  onFileChange,
  onAnalyze,
}: {
  selectedFile: File | null;
  status: string;
  isLoading: boolean;
  jobsLoading: boolean;
  onFileChange: (file: File) => void;
  onAnalyze: () => void;
}) {
  return (
    <section
      id="resume-analyzer"
      className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] shadow-2xl"
    >
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-white/10 bg-gradient-to-br from-orange-500/15 to-transparent p-8 md:border-b-0 md:border-r md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
            Resume intelligence
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Build a resume recruiters understand.
          </h2>

          <p className="mt-5 max-w-lg leading-7 text-zinc-400">
            Upload your resume once. Resume Roast will analyze it, identify
            suitable roles, tailor it to a job and prepare the final download.
          </p>

          <div className="mt-9 space-y-4">
            <ProcessItem number="01" label="Upload and analyze" />
            <ProcessItem number="02" label="Review job matches" />
            <ProcessItem number="03" label="Tailor and download" />
          </div>
        </div>

        <div className="p-8 md:p-12">
          <label className="group flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-black/40 px-6 text-center transition hover:border-orange-500 hover:bg-orange-500/5">
            <UploadIcon />

            <p className="mt-5 text-lg font-semibold text-white">
              {selectedFile ? selectedFile.name : "Choose your resume"}
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              PDF, DOC or DOCX
            </p>

            <span className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition group-hover:bg-orange-400">
              Browse files
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  onFileChange(file);
                }
              }}
            />
          </label>

          <button
            onClick={onAnalyze}
            disabled={!selectedFile || isLoading}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Analyzing resume
              </>
            ) : (
              <>
                Analyze resume
                <ArrowRightIcon />
              </>
            )}
          </button>

          {status && (
            <p className="mt-4 text-center text-sm text-zinc-400">{status}</p>
          )}

          {jobsLoading && (
            <p className="mt-3 text-center text-sm text-orange-400">
              Preparing job recommendations...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function WorkspaceHeader({
  report,
  activeTab,
  onTabChange,
  onStartOver,
}: {
  report: Report;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onStartOver: () => void;
}) {
  const steps: {
    id: WorkspaceTab;
    number: string;
    title: string;
    description: string;
  }[] = [
    {
      id: "overview",
      number: "01",
      title: "Analysis",
      description: "Scores and feedback",
    },
    {
      id: "jobs",
      number: "02",
      title: "Job matches",
      description: "Select your target",
    },
    {
      id: "tailor",
      number: "03",
      title: "Tailor and download",
      description: "Create final resume",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-5 shadow-2xl md:p-7">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Career workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {report.candidateName || "Resume analysis"}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {report.fileName}
          </p>
        </div>

        <button
          onClick={onStartOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-white/5"
        >
          <RefreshIcon />
          Analyze another resume
        </button>
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {steps.map((step) => {
          const active = activeTab === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onTabChange(step.id)}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-white/10 bg-black/30 hover:border-zinc-600"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                  active
                    ? "bg-orange-500 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {step.number}
              </span>

              <span>
                <span className="block font-semibold text-white">
                  {step.title}
                </span>

                <span className="mt-1 block text-xs text-zinc-500">
                  {step.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function OverviewWorkspace({
  report,
  copyText,
  status,
  onContinue,
}: {
  report: Report;
  copyText: (text: string) => void;
  status: string;
  onContinue: () => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <aside className="space-y-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Resume health
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <ScoreCard label="ATS score" value={report.atsScore} />
            <ScoreCard
              label="Recruiter score"
              value={report.recruiterScore}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm text-zinc-500">Hiring probability</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {report.hiringProbability}
            </p>
          </div>
        </div>

        <CompactListCard
          title="Your strongest signals"
          items={report.strengths}
          tone="positive"
        />

        <CompactListCard
          title="Priority improvements"
          items={report.weaknesses}
          tone="warning"
        />
      </aside>

      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
                Recruiter verdict
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                What needs attention
              </h2>
            </div>

            <DocumentIcon />
          </div>

          <p className="mt-6 leading-8 text-zinc-300">{report.roast}</p>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Suggested rewrite
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Professional summary
              </h2>
            </div>

            <button
              onClick={() => copyText(report.improvedSummary)}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-orange-500 hover:text-white"
            >
              Copy summary
            </button>
          </div>

          <p className="mt-6 leading-8 text-zinc-300">
            {report.improvedSummary}
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Missing keywords
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {report.missingKeywords.length > 0 ? (
              report.missingKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-sm text-orange-300"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No critical keywords identified.
              </p>
            )}
          </div>
        </section>

        <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-orange-500/20 bg-orange-500/10 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">Analysis complete</p>
            <p className="mt-1 text-sm text-zinc-400">
              Continue to review the most relevant job matches.
            </p>

            {status && (
              <p className="mt-2 text-xs text-orange-300">{status}</p>
            )}
          </div>

          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black transition hover:bg-orange-400"
          >
            View job matches
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function JobsWorkspace({
  jobs,
  loading,
  onContinue,
}: {
  jobs: any[];
  loading: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-5 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
            Recommended opportunities
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Choose the role you want to target
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Select a recommended role and Resume Roast will prepare the job
            description inside the tailoring workspace.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:bg-orange-500/10"
        >
          Paste a job manually
          <ArrowRightIcon />
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-zinc-500">
              Preparing job matches...
            </p>
          </div>
        </div>
      ) : jobs.length > 0 ? (
        <JobMatches jobs={jobs} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 p-10 text-center">
          <p className="font-medium text-white">No job matches available</p>
          <p className="mt-2 text-sm text-zinc-500">
            Continue to tailoring and paste a job description manually.
          </p>
        </div>
      )}
    </section>
  );
}

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const score = Math.max(0, Math.min(100, value));

  const pathColor =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
      <div className="mx-auto h-24 w-24">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            textColor: "#ffffff",
            pathColor,
            trailColor: "#27272a",
            textSize: "25px",
          })}
        />
      </div>

      <p className="mt-3 text-xs font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function CompactListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "warning";
}) {
  const markerClass =
    tone === "positive" ? "bg-emerald-400" : "bg-orange-400";

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
      <h3 className="font-semibold text-white">{title}</h3>

      <ul className="mt-5 space-y-4">
        {items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-400">
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${markerClass}`}
              />
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm text-zinc-500">No data available.</li>
        )}
      </ul>
    </section>
  );
}

function ProcessItem({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-xs font-semibold text-orange-300">
        {number}
      </span>

      <span className="text-sm text-zinc-300">{label}</span>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-9 w-9 text-orange-400"
      aria-hidden="true"
    >
      <path
        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
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

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M20 6v5h-5M4 18v-5h5M18.5 9A7 7 0 0 0 6 7.5L4 11m16 2-2 3.5A7 7 0 0 1 5.5 15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-orange-400">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h5M10 17h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}