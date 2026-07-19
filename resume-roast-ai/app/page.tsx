"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import JobMatches from "../components/JobMatches";
import TailorResume from "../components/TailorResume";
import type { JobMatch, Report } from "../types/report";

type WorkspaceTab = "overview" | "jobs" | "tailor";

type AnalysisStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "evaluating"
  | "matching"
  | "complete";

const workspaceTabs: {
  id: WorkspaceTab;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "overview",
    number: "01",
    title: "Analysis",
    description: "Scores and recruiter feedback",
    icon: <AnalysisIcon />,
  },
  {
    id: "jobs",
    number: "02",
    title: "Job matches",
    description: "Select your target role",
    icon: <BriefcaseIcon />,
  },
  {
    id: "tailor",
    number: "03",
    title: "Tailor and download",
    description: "Create your final application",
    icon: <DocumentIcon />,
  },
];

export default function Home() {
  const [jobRecommendations, setJobRecommendations] = useState<JobMatch[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [analysisStage, setAnalysisStage] =
    useState<AnalysisStage>("idle");

  useEffect(() => {
    function openTailorWorkspace() {
      setActiveTab("tailor");

      window.setTimeout(() => {
        document.getElementById("workspace-main")?.focus();
      }, 150);
    }

    window.addEventListener("tailor-job", openTailorWorkspace);

    return () => {
      window.removeEventListener("tailor-job", openTailorWorkspace);
    };
  }, []);

  const displayedJobs = useMemo<JobMatch[]>(() => {
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
      setReport(null);
      setJobRecommendations([]);
      setActiveTab("overview");

      setAnalysisStage("uploading");
      setStatus("Uploading your resume...");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      window.setTimeout(() => {
        setAnalysisStage("extracting");
        setStatus("Extracting your experience and skills...");
      }, 700);

      window.setTimeout(() => {
        setAnalysisStage("evaluating");
        setStatus("Evaluating ATS and recruiter readiness...");
      }, 1800);
      const accessResponse = await fetch("/api/access/check", {
  method: "POST",
});

const accessData = await accessResponse.json();

if (!accessResponse.ok || !accessData.allowed) {
  setAnalysisStage("idle");
  setStatus(
    accessData.message ||
      "Your free analysis limit has been reached. Upgrade to Pro to continue."
  );
  return;
}

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAnalysisStage("idle");
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

        strengths: Array.isArray(data.strengths)
          ? data.strengths
          : [],

        weaknesses: Array.isArray(data.weaknesses)
          ? data.weaknesses
          : [],

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

        experience: Array.isArray(data.experience)
          ? data.experience
          : [],

        education: Array.isArray(data.education)
          ? data.education
          : [],

        certifications: Array.isArray(data.certifications)
          ? data.certifications
          : [],

        projects: Array.isArray(data.projects)
          ? data.projects
          : [],

        jobMatches: Array.isArray(data.jobMatches)
           ? accessData.plan === "free"
           ? data.jobMatches.slice(0, 3)
           : data.jobMatches
          : [],
      };

      setReport(reportData);
      saveReport(reportData, selectedFile.name);

      setAnalysisStage("matching");
      setStatus("Finding relevant opportunities...");
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

      setAnalysisStage("complete");
      setStatus("Analysis complete.");
    } catch (error) {
      console.error("Resume analysis error:", error);
      setAnalysisStage("idle");
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function saveReport(reportData: Report, resumeName: string) {
    try {
      const savedReports = JSON.parse(
        localStorage.getItem("resumeReports") || "[]"
      );

      const newSavedReport = {
        id: Date.now().toString(),
        resumeName,
        createdAt: new Date().toISOString(),
        report: reportData,
      };

      localStorage.setItem(
        "resumeReports",
        JSON.stringify([newSavedReport, ...savedReports])
      );
    } catch (error) {
      console.error("Unable to save report locally:", error);
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

  function changeWorkspaceTab(tab: WorkspaceTab) {
    setActiveTab(tab);

    window.setTimeout(() => {
      document.getElementById("workspace-main")?.focus();
    }, 50);
  }

  function startNewAnalysis() {
    setSelectedFile(null);
    setReport(null);
    setJobRecommendations([]);
    setStatus("");
    setActiveTab("overview");
    setAnalysisStage("idle");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-[#060606] text-white">
        <Navbar />

        <div className="mx-auto max-w-[1480px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
          <Hero />
          <FeatureGrid />

          <UploadWorkspace
            selectedFile={selectedFile}
            status={status}
            isLoading={isLoading}
            analysisStage={analysisStage}
            onFileChange={(file) => {
              setSelectedFile(file);
              setStatus("");
              setJobRecommendations([]);
              setAnalysisStage("idle");
            }}
            onRemoveFile={() => {
              setSelectedFile(null);
              setStatus("");
              setAnalysisStage("idle");
            }}
            onAnalyze={handleAnalyze}
          />

          <Pricing />
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <Navbar />

      <div className="mx-auto max-w-[1720px] px-3 pb-8 pt-4 sm:px-5 lg:px-7">
        <section
          id="career-workspace"
          className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#0b0b0b] shadow-[0_28px_100px_rgba(0,0,0,0.42)]"
        >
          <WorkspaceTopbar
            report={report}
            activeTab={activeTab}
            onStartOver={startNewAnalysis}
          />

          <div className="grid min-h-[calc(100vh-145px)] lg:grid-cols-[280px_minmax(0,1fr)]">
            <WorkspaceSidebar
              report={report}
              activeTab={activeTab}
              jobsCount={displayedJobs.length}
              onTabChange={changeWorkspaceTab}
              onStartOver={startNewAnalysis}
            />

            <section
              id="workspace-main"
              tabIndex={-1}
              aria-live="polite"
              className="min-w-0 bg-[#080808] outline-none"
            >
              <div
                id="overview-panel"
                role="tabpanel"
                aria-labelledby="overview-tab"
                hidden={activeTab !== "overview"}
                className="p-4 sm:p-6 xl:p-8"
              >
                <OverviewWorkspace
                  report={report}
                  copyText={copyText}
                  status={status}
                  onContinue={() => changeWorkspaceTab("jobs")}
                />
              </div>

              <div
                id="jobs-panel"
                role="tabpanel"
                aria-labelledby="jobs-tab"
                hidden={activeTab !== "jobs"}
                className="p-4 sm:p-6 xl:p-8"
              >
                <JobsWorkspace
                  jobs={displayedJobs}
                  loading={jobsLoading}
                  onContinue={() => changeWorkspaceTab("tailor")}
                />
              </div>

              <div
                id="tailor-panel"
                role="tabpanel"
                aria-labelledby="tailor-tab"
                hidden={activeTab !== "tailor"}
                className="p-3 sm:p-5 xl:p-6"
              >
                <TailorResume report={report} />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function UploadWorkspace({
  selectedFile,
  status,
  isLoading,
  analysisStage,
  onFileChange,
  onRemoveFile,
  onAnalyze,
}: {
  selectedFile: File | null;
  status: string;
  isLoading: boolean;
  analysisStage: AnalysisStage;
  onFileChange: (file: File) => void;
  onRemoveFile: () => void;
  onAnalyze: () => void;
}) {
  return (
    <section
      id="resume-analyzer"
      className="mx-auto mt-20 max-w-6xl overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b0b0b] shadow-[0_28px_90px_rgba(0,0,0,0.35)]"
    >
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative overflow-hidden border-b border-white/[0.08] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.13),transparent_46%)]" />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">
              Resume intelligence
            </p>

            <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-5xl">
              Build an application recruiters understand.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-500">
              Upload once and move through one guided workflow—from resume
              analysis to a targeted application.
            </p>

            <div className="mt-10 space-y-3">
              <ProcessItem
                number="01"
                title="Analyze"
                description="ATS score and recruiter feedback"
              />

              <ProcessItem
                number="02"
                title="Discover"
                description="Roles aligned with your profile"
              />

              <ProcessItem
                number="03"
                title="Tailor"
                description="A targeted resume ready to submit"
              />
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs text-zinc-600">
              <ShieldIcon />
              Your document is used only to generate your analysis.
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-12">
          {!selectedFile ? (
            <label className="group flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-zinc-700 bg-black/25 px-6 text-center transition duration-200 hover:border-orange-500/60 hover:bg-orange-500/[0.035]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#111111] text-orange-400">
                <UploadIcon />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                Choose your resume
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Drag and drop or browse from your device
              </p>

              <span className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition group-hover:bg-orange-400">
                Browse files
              </span>

              <p className="mt-5 text-xs text-zinc-700">
                PDF, DOC or DOCX · Maximum 5 MB
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onFileChange(file);
                  }
                }}
              />
            </label>
          ) : (
            <div>
              <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      <DocumentSmallIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatFileSize(selectedFile.size)} · Ready to analyze
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onRemoveFile}
                    disabled={isLoading}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-500 transition hover:border-zinc-600 hover:text-white disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {isLoading && (
                <AnalysisProgress stage={analysisStage} />
              )}

              <button
                type="button"
                onClick={onAnalyze}
                disabled={isLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:ring-offset-2 focus:ring-offset-[#0b0b0b] disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>
          )}

          {status && !isLoading && (
            <p className="mt-4 text-center text-sm text-zinc-500">
              {status}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <TrustMetric label="ATS analysis" />
            <TrustMetric label="Job matching" />
            <TrustMetric label="Targeted rewrite" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkspaceTopbar({
  report,
  activeTab,
  onStartOver,
}: {
  report: Report;
  activeTab: WorkspaceTab;
  onStartOver: () => void;
}) {
  const activeLabel =
    workspaceTabs.find((tab) => tab.id === activeTab)?.title ||
    "Analysis";

  return (
    <header className="flex min-h-[76px] flex-col justify-between gap-4 border-b border-white/[0.08] bg-[#0d0d0d] px-5 py-4 sm:flex-row sm:items-center lg:px-7">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-sm font-semibold text-orange-300">
          {getInitials(report.candidateName || "Resume")}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {report.candidateName || "Resume analysis"}
            </p>

            <span className="hidden text-zinc-700 sm:inline">/</span>

            <p className="hidden text-xs text-zinc-500 sm:block">
              {activeLabel}
            </p>
          </div>

          <p className="mt-1 truncate text-xs text-zinc-600">
            {report.fileName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge label="Analysis complete" />

        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-white"
        >
          <RefreshIcon />
          New analysis
        </button>
      </div>
    </header>
  );
}

function WorkspaceSidebar({
  report,
  activeTab,
  jobsCount,
  onTabChange,
  onStartOver,
}: {
  report: Report;
  activeTab: WorkspaceTab;
  jobsCount: number;
  onTabChange: (tab: WorkspaceTab) => void;
  onStartOver: () => void;
}) {
  return (
    <aside className="border-b border-white/[0.08] bg-[#0d0d0d] p-4 lg:border-b-0 lg:border-r lg:p-5">
      <div
        role="tablist"
        aria-label="Resume workflow"
        className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
      >
        {workspaceTabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${tab.id}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={`group flex items-center gap-3 rounded-xl border p-3 text-left outline-none transition focus:ring-2 focus:ring-orange-500/50 ${
                active
                  ? "border-orange-500/35 bg-orange-500/[0.09]"
                  : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.025]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? "bg-orange-500 text-black"
                    : "border border-white/[0.08] bg-black/30 text-zinc-600 group-hover:text-zinc-400"
                }`}
              >
                {tab.icon}
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-medium text-white">
                  {tab.title}
                </span>

                <span className="mt-1 block truncate text-[11px] text-zinc-600">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 hidden border-t border-white/[0.08] pt-5 lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
          Resume health
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <SidebarMetric
            label="ATS"
            value={`${report.atsScore}`}
          />

          <SidebarMetric
            label="Recruiter"
            value={`${report.recruiterScore}`}
          />
        </div>

        <div className="mt-2 rounded-xl border border-white/[0.08] bg-black/25 p-3">
          <p className="text-[10px] text-zinc-700">Job matches</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {jobsCount}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-600 hover:text-white lg:flex"
      >
        <RefreshIcon />
        Analyze another resume
      </button>
    </aside>
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
    <div className="mx-auto max-w-[1320px]">
      <WorkspacePageHeader
        eyebrow="Resume analysis"
        title="Your application health"
        description="Understand what is working, what needs attention and what to improve before applying."
        action={
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            View job matches
            <ArrowRightIcon />
          </button>
        }
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <PrimaryScoreCard
          label="ATS score"
          value={report.atsScore}
          description="Estimated system compatibility"
        />

        <PrimaryScoreCard
          label="Recruiter score"
          value={report.recruiterScore}
          description="Clarity and recruiter appeal"
        />

        <ProbabilityCard value={report.hiringProbability} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-4">
          <CompactListCard
            title="Strongest signals"
            items={report.strengths}
            tone="positive"
          />

          <CompactListCard
            title="Priority improvements"
            items={report.weaknesses}
            tone="warning"
          />
        </div>

        <div className="space-y-4">
          <ContentCard
            eyebrow="Recruiter verdict"
            title="What needs attention"
            icon={<VerdictIcon />}
          >
            <p className="text-sm leading-7 text-zinc-400">
              {report.roast}
            </p>
          </ContentCard>

          <ContentCard
            eyebrow="Suggested rewrite"
            title="Professional summary"
            action={
              <button
                type="button"
                onClick={() => copyText(report.improvedSummary)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-xs font-medium text-zinc-500 transition hover:border-zinc-600 hover:text-white"
              >
                <CopyIcon />
                Copy
              </button>
            }
          >
            <p className="text-sm leading-7 text-zinc-400">
              {report.improvedSummary}
            </p>
          </ContentCard>

          <ContentCard
            eyebrow="Targeting gaps"
            title="Missing keywords"
          >
            <div className="flex flex-wrap gap-2">
              {report.missingKeywords.length > 0 ? (
                report.missingKeywords.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-xs font-medium text-orange-300"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-600">
                  No critical keywords identified.
                </p>
              )}
            </div>
          </ContentCard>
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-white">
            Your analysis is complete
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            Continue to select the role you want to target.
          </p>

          {status && (
            <p className="mt-2 text-xs text-orange-300">
              {status}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
        >
          Continue to jobs
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

function JobsWorkspace({
  jobs,
  loading,
  onContinue,
}: {
  jobs: JobMatch[];
  loading: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1320px]">
      <WorkspacePageHeader
        eyebrow="Recommended opportunities"
        title="Choose your target role"
        description="Select a suggested role or paste your own job description in the tailoring workspace."
        action={
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/20 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-orange-500/50 hover:text-white"
          >
            Paste job manually
            <ArrowRightIcon />
          </button>
        }
      />

      {loading ? (
        <JobLoadingState />
      ) : jobs.length > 0 ? (
        <JobMatches jobs={jobs} />
      ) : (
        <EmptyState
          icon={<BriefcaseIcon />}
          title="No job matches available"
          description="Continue to tailoring and paste a job description manually."
          action={
            <button
              type="button"
              onClick={onContinue}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black hover:bg-orange-400"
            >
              Open tailoring workspace
            </button>
          }
        />
      )}
    </div>
  );
}

function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-5 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 sm:flex-row sm:items-center sm:p-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </div>

      {action}
    </header>
  );
}

function ContentCard({
  eyebrow,
  title,
  icon,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-lg font-semibold text-white">
            {title}
          </h2>
        </div>

        {action || icon}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function PrimaryScoreCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  const score = Math.max(0, Math.min(100, Math.round(value)));

  const labelText =
    score >= 85
      ? "Excellent"
      : score >= 70
      ? "Strong"
      : score >= 55
      ? "Developing"
      : "Needs work";

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-600">
          {label}
        </p>

        <ScoreRing score={score} />
      </div>

      <p className="mt-5 text-2xl font-semibold text-white">
        {labelText}
      </p>

      <p className="mt-2 text-xs leading-5 text-zinc-700">
        {description}
      </p>
    </article>
  );
}

function ProbabilityCard({ value }: { value: string }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-zinc-600">
          Hiring probability
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-zinc-600">
          <TrendIcon />
        </span>
      </div>

      <p className="mt-7 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-zinc-700">
        Estimated likelihood based on the current resume.
      </p>
    </article>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-14 w-14">
      <svg
        viewBox="0 0 52 52"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="#252525"
          strokeWidth="4"
        />

        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        {score}
      </span>
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
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            tone === "positive"
              ? "bg-emerald-400"
              : "bg-orange-400"
          }`}
        />

        <h3 className="text-sm font-medium text-white">
          {title}
        </h3>
      </div>

      <ul className="mt-5 space-y-4">
        {items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 text-xs leading-6 text-zinc-500"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-700" />
              {item}
            </li>
          ))
        ) : (
          <li className="text-xs text-zinc-700">
            No data available.
          </li>
        )}
      </ul>
    </section>
  );
}

function AnalysisProgress({
  stage,
}: {
  stage: AnalysisStage;
}) {
  const stages: {
    id: AnalysisStage;
    label: string;
  }[] = [
    { id: "uploading", label: "Uploading document" },
    { id: "extracting", label: "Reading experience and skills" },
    { id: "evaluating", label: "Evaluating resume quality" },
    { id: "matching", label: "Finding relevant roles" },
  ];

  const currentIndex = stages.findIndex(
    (item) => item.id === stage
  );

  const progress =
    currentIndex >= 0
      ? ((currentIndex + 1) / stages.length) * 100
      : 8;

  return (
    <div className="mt-5 rounded-[1.5rem] border border-orange-500/20 bg-orange-500/[0.045] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-orange-300">
            Resume Roast is working
          </p>

          <p className="mt-1 text-[11px] text-zinc-600">
            This usually takes less than a minute.
          </p>
        </div>

        <span className="text-xs font-semibold text-orange-300">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {stages.map((item, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  complete
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : active
                    ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                    : "border-white/[0.08] text-zinc-800"
                }`}
              >
                {complete ? (
                  <CheckSmallIcon />
                ) : active ? (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-zinc-800" />
                )}
              </span>

              <span
                className={`text-xs ${
                  complete || active
                    ? "text-zinc-400"
                    : "text-zinc-700"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JobLoadingState() {
  return (
    <div className="mt-6 grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d] p-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-zinc-900" />

            <div className="flex-1">
              <div className="h-3 w-28 rounded bg-zinc-900" />
              <div className="mt-3 h-5 w-64 max-w-full rounded bg-zinc-900" />
            </div>

            <div className="h-14 w-14 rounded-full bg-zinc-900" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="h-28 rounded-xl bg-zinc-900/70" />
            <div className="h-28 rounded-xl bg-zinc-900/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex min-h-[440px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/[0.09] bg-[#0d0d0d] p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/30 text-zinc-600">
        {icon}
      </div>

      <h2 className="mt-5 text-lg font-medium text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function ProcessItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/[0.07] text-[10px] font-semibold text-orange-300">
        {number}
      </span>

      <div>
        <p className="text-sm font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-zinc-700">
          {description}
        </p>
      </div>
    </div>
  );
}

function TrustMetric({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-3">
      <CheckSmallIcon />
      <span className="text-[11px] text-zinc-600">
        {label}
      </span>
    </div>
  );
}

function SidebarMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
      <p className="text-[10px] text-zinc-700">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="hidden items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-[10px] font-medium text-emerald-400 sm:inline-flex">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
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

function AnalysisIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 19V9m5 10V5m5 14v-7m5 7V3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M9 6V4h6v2M4 8h16v11H4V8Zm0 4c5 2 11 2 16 0"
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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
  );
}

function DocumentSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l4 4v14H7V3Zm7 0v5h5"
        stroke="currentColor"
        strokeWidth="1.7"
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

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M9 8h10v12H9V8Zm-4 8H4V4h10v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerdictIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-orange-400">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M5 5h14v14H5V5Zm4 4h6m-6 4h6m-6 4h3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m5 16 5-5 3 3 6-7m-4 0h4v4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3 text-emerald-400"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
  );
}