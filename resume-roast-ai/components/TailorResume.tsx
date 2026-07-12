"use client";

import { useEffect, useMemo, useState } from "react";
import type { Report } from "../types/report";
import { downloadResumePdf } from "../lib/pdfResume";
import InterviewPrep from "./InterviewPrep";
import ResumePreview from "./ResumePreview";

type Props = {
  report: Report;
};

type WorkspacePanel = "resume" | "cover-letter" | "interview";

type TailoredResult = {
  candidateName?: string;
  headline?: string;

  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };

  tailoredSummary: string;
  tailoredBullets: string[];
  tailoredSkills: string[];

  experience?: {
    jobTitle?: string;
    company?: string;
    duration?: string;
    bullets?: string[];
  }[];

  education?: {
    degree?: string;
    college?: string;
    year?: string;
  }[];

  certifications?: string[];

  projects?: {
    title?: string;
    description?: string;
  }[];

  coverLetter: string;
  tailoredScore?: number;
};

export default function TailorResume({ report }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailoredResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] =
    useState<WorkspacePanel>("resume");
  const [message, setMessage] = useState("");

  const candidateName =
    report.candidateName?.trim() || "Candidate Name";

  const headline =
    report.headline?.trim() || "Professional Candidate";

  const tailoredScore = useMemo(() => {
    if (typeof result?.tailoredScore === "number") {
      return Math.min(
        98,
        Math.max(0, Math.round(result.tailoredScore))
      );
    }

    if (result) {
      return Math.min(
        98,
        Math.max(70, Math.round(report.atsScore + 12))
      );
    }

    return report.atsScore;
  }, [report.atsScore, result]);

  const previewSummary =
    result?.tailoredSummary || report.improvedSummary;

  const previewBullets =
    result?.tailoredBullets?.length
      ? result.tailoredBullets
      : report.rewrittenBullets;

  const previewSkills =
    result?.tailoredSkills?.length
      ? result.tailoredSkills
      : report.optimizedSkills;

  const previewExperience =
    result?.experience?.length
      ? result.experience
      : report.experience || [];

  const previewEducation =
    result?.education?.length
      ? result.education
      : report.education || [];

  const previewCertifications =
    result?.certifications?.length
      ? result.certifications
      : report.certifications || [];

  const previewProjects =
    result?.projects?.length
      ? result.projects
      : report.projects || [];

  useEffect(() => {
    function handleTailorJob(event: Event) {
      const customEvent = event as CustomEvent<string>;

      if (typeof customEvent.detail === "string") {
        setJobDescription(customEvent.detail);
        setActivePanel("resume");
        setMessage("Job details added. Review and tailor your resume.");

        window.setTimeout(() => {
          document
            .getElementById("job-description")
            ?.focus();
        }, 500);
      }
    }

    window.addEventListener("tailor-job", handleTailorJob);

    return () => {
      window.removeEventListener(
        "tailor-job",
        handleTailorJob
      );
    };
  }, []);

  async function handleTailor() {
    if (jobDescription.trim().length < 20) {
      setMessage(
        "Add a complete job description before tailoring."
      );
      return;
    }

    setLoading(true);
    setMessage("Building your targeted resume...");
    setActivePanel("resume");

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setMessage(
          data.message ||
            "The tailored resume could not be generated."
        );
        return;
      }

      setResult(data);
      setMessage("Your targeted resume is ready.");
    } catch (error) {
      console.error("Tailor resume error:", error);
      setMessage(
        "Something went wrong while tailoring the resume."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadTailoredResume() {
    if (!result) {
      setMessage(
        "Generate the tailored resume before downloading."
      );
      return;
    }

    downloadResumePdf({
      candidateName:
        result.candidateName || candidateName,
      headline: result.headline || headline,
      contact: result.contact || report.contact,

      tailoredSummary: result.tailoredSummary,
      tailoredBullets: result.tailoredBullets,
      tailoredSkills: result.tailoredSkills,

      experience: result.experience || [],
      education: result.education || [],
      certifications: result.certifications || [],
      projects: result.projects || [],
    });
  }

  function downloadCoverLetter() {
    if (!result?.coverLetter) {
      setMessage(
        "Generate the tailored resume before downloading the cover letter."
      );
      return;
    }

    const blob = new Blob([result.coverLetter], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${candidateName
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")}_Cover_Letter.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage("Cover letter downloaded.");
  }

  async function copyText(
    text: string,
    successMessage: string
  ) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(successMessage);
    } catch {
      setMessage("Unable to copy. Please try again.");
    }
  }

  function printResume() {
    window.print();
  }

  return (
    <section
      id="tailor-resume-section"
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0d] shadow-2xl"
    >
      <WorkspaceTopbar
        tailoredScore={tailoredScore}
        resultReady={Boolean(result)}
      />

      <div className="grid min-h-[760px] xl:grid-cols-[430px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#101010] xl:border-b-0 xl:border-r">
          <div className="p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
              Target role
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Tailor your application
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Paste the target job description or select a
              recommended role. The preview updates after
              tailoring.
            </p>

            <label
              htmlFor="job-description"
              className="mt-7 block text-sm font-medium text-zinc-300"
            >
              Job description
            </label>

            <div className="relative mt-3">
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setMessage("");
                }}
                placeholder="Paste the complete job description here..."
                className="min-h-[250px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/10"
              />

              <span className="absolute bottom-3 right-3 text-xs text-zinc-600">
                {jobDescription.trim().length} characters
              </span>
            </div>

            <button
              onClick={handleTailor}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Tailoring resume
                </>
              ) : (
                <>
                  <SparkIcon />
                  Generate targeted resume
                </>
              )}
            </button>

            {message && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
                  result
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-black/30 text-zinc-400"
                }`}
              >
                {message}
              </div>
            )}

            {loading && (
              <ProcessingCard />
            )}
          </div>

          <div className="border-t border-white/10 p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Application tools
            </p>

            <nav className="mt-4 space-y-2">
              <PanelButton
                active={activePanel === "resume"}
                label="Resume"
                description="Preview and export"
                icon={<DocumentIcon />}
                onClick={() => setActivePanel("resume")}
              />

              <PanelButton
                active={activePanel === "cover-letter"}
                label="Cover letter"
                description={
                  result?.coverLetter
                    ? "Personalized letter ready"
                    : "Generated after tailoring"
                }
                icon={<LetterIcon />}
                onClick={() =>
                  setActivePanel("cover-letter")
                }
              />

              <PanelButton
                active={activePanel === "interview"}
                label="Interview preparation"
                description="Questions for the target role"
                icon={<InterviewIcon />}
                onClick={() =>
                  setActivePanel("interview")
                }
              />
            </nav>
          </div>
        </aside>

        <main className="min-w-0 bg-[#080808]">
          {activePanel === "resume" && (
            <ResumeWorkspace
              report={report}
              result={result}
              candidateName={candidateName}
              headline={headline}
              tailoredScore={tailoredScore}
              summary={previewSummary}
              bullets={previewBullets}
              skills={previewSkills}
              experience={previewExperience}
              education={previewEducation}
              certifications={previewCertifications}
              projects={previewProjects}
              onDownload={downloadTailoredResume}
              onCopy={() =>
                copyText(
                  previewSummary,
                  "Professional summary copied."
                )
              }
              onPrint={printResume}
            />
          )}

          {activePanel === "cover-letter" && (
            <CoverLetterWorkspace
              coverLetter={result?.coverLetter || ""}
              onCopy={() =>
                copyText(
                  result?.coverLetter || "",
                  "Cover letter copied."
                )
              }
              onDownload={downloadCoverLetter}
            />
          )}

          {activePanel === "interview" && (
            <InterviewWorkspace
              jobDescription={jobDescription}
              summary={previewSummary}
              bullets={previewBullets}
              skills={previewSkills}
            />
          )}
        </main>
      </div>
    </section>
  );
}

function WorkspaceTopbar({
  tailoredScore,
  resultReady,
}: {
  tailoredScore: number;
  resultReady: boolean;
}) {
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-white/10 bg-[#101010] px-5 py-5 md:flex-row md:items-center md:px-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Application studio
        </p>

        <h1 className="mt-2 text-xl font-semibold text-white">
          Resume tailoring workspace
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusMetric
          label="ATS match"
          value={`${tailoredScore}%`}
          tone="orange"
        />

        <StatusMetric
          label="Resume status"
          value={resultReady ? "Ready" : "Draft"}
          tone={resultReady ? "green" : "neutral"}
        />
      </div>
    </header>
  );
}

function ResumeWorkspace({
  report,
  result,
  candidateName,
  headline,
  tailoredScore,
  summary,
  bullets,
  skills,
  experience,
  education,
  certifications,
  projects,
  onDownload,
  onCopy,
  onPrint,
}: {
  report: Report;
  result: TailoredResult | null;
  candidateName: string;
  headline: string;
  tailoredScore: number;
  summary: string;
  bullets: string[];
  skills: string[];
  experience: NonNullable<TailoredResult["experience"]>;
  education: NonNullable<TailoredResult["education"]>;
  certifications: string[];
  projects: NonNullable<TailoredResult["projects"]>;
  onDownload: () => void;
  onCopy: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#101010] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Live preview
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {result
              ? "Your targeted resume is ready for review."
              : "This preview uses your analyzed resume until you generate a targeted version."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton
            label="Copy summary"
            icon={<CopyIcon />}
            onClick={onCopy}
            variant="secondary"
          />

          <ActionButton
            label="Print"
            icon={<PrintIcon />}
            onClick={onPrint}
            variant="secondary"
          />

          <ActionButton
            label="Download PDF"
            icon={<DownloadIcon />}
            onClick={onDownload}
            variant="primary"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="ATS match"
          value={`${tailoredScore}%`}
          description="Target role alignment"
        />

        <MetricCard
          label="Keywords"
          value={`${skills.length}`}
          description="Relevant skills included"
        />

        <MetricCard
          label="Status"
          value={result ? "Ready" : "Preview"}
          description={
            result
              ? "Available to download"
              : "Generate to finalize"
          }
        />
      </div>

      <div className="mt-5 xl:sticky xl:top-5">
        <ResumePreview
          name={result?.candidateName || candidateName}
          headline={result?.headline || headline}
          contact={result?.contact || report.contact}
          summary={summary}
          bullets={bullets}
          skills={skills}
          experience={experience}
          education={education}
          certifications={certifications}
          projects={projects}
        />
      </div>
    </div>
  );
}

function CoverLetterWorkspace({
  coverLetter,
  onCopy,
  onDownload,
}: {
  coverLetter: string;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="p-5 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
            Cover letter
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Personalized application letter
          </h2>
        </div>

        {coverLetter && (
          <div className="flex gap-2">
            <ActionButton
              label="Copy"
              icon={<CopyIcon />}
              onClick={onCopy}
              variant="secondary"
            />

            <ActionButton
              label="Download"
              icon={<DownloadIcon />}
              onClick={onDownload}
              variant="primary"
            />
          </div>
        )}
      </div>

      {coverLetter ? (
        <article className="mx-auto mt-7 max-w-4xl rounded-2xl border border-white/10 bg-white px-7 py-10 text-slate-900 shadow-2xl md:px-12 md:py-14">
          <p className="whitespace-pre-line text-[15px] leading-8">
            {coverLetter}
          </p>
        </article>
      ) : (
        <EmptyState
          icon={<LetterIcon />}
          title="Generate your targeted resume first"
          description="The personalized cover letter will appear here after tailoring."
        />
      )}
    </div>
  );
}

function InterviewWorkspace({
  jobDescription,
  summary,
  bullets,
  skills,
}: {
  jobDescription: string;
  summary: string;
  bullets: string[];
  skills: string[];
}) {
  if (!jobDescription.trim()) {
    return (
      <div className="p-5 md:p-8">
        <EmptyState
          icon={<InterviewIcon />}
          title="Add a job description"
          description="Interview preparation is generated for the specific role you are targeting."
        />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
          Interview preparation
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Practice for the target role
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Generate questions based on the role, your resume
          and the experience highlighted in your application.
        </p>
      </div>

      <div className="mt-7">
        <InterviewPrep
          jobDescription={jobDescription}
          report={{
            summary,
            experienceHighlights: bullets,
            optimizedSkills: skills,
          }}
        />
      </div>
    </div>
  );
}

function ProcessingCard() {
  const steps = [
    "Reading the target role",
    "Matching skills and keywords",
    "Rewriting experience",
    "Preparing application materials",
  ];

  return (
    <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
      <div className="flex items-center gap-3">
        <SpinnerIcon />

        <p className="text-sm font-medium text-orange-300">
          Resume Roast is working
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 text-xs text-zinc-500"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                index === 0
                  ? "animate-pulse bg-orange-400"
                  : "bg-zinc-700"
              }`}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelButton({
  active,
  label,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        active
          ? "border-orange-500/40 bg-orange-500/10"
          : "border-transparent hover:border-white/10 hover:bg-white/5"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-orange-500 text-black"
            : "bg-zinc-900 text-zinc-500"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-medium text-white">
          {label}
        </span>

        <span className="mt-1 block truncate text-xs text-zinc-600">
          {description}
        </span>
      </span>
    </button>
  );
}

function StatusMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "green" | "neutral";
}) {
  const toneClasses = {
    orange:
      "border-orange-500/25 bg-orange-500/10 text-orange-300",
    green:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    neutral:
      "border-white/10 bg-black/30 text-zinc-300",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-2.5 ${toneClasses[tone]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
      <p className="text-xs font-medium text-zinc-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-600">{description}</p>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  variant,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        variant === "primary"
          ? "bg-orange-500 text-black hover:bg-orange-400"
          : "border border-white/10 bg-black/30 text-zinc-300 hover:border-zinc-600 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-8 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#101010] text-zinc-500">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-medium text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
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
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h5M10 17h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InterviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8.5 4.5L19 18l4-4M2 21c.7-4 2.7-6 6-6 2.2 0 3.9.9 5 2.7"
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

function PrintIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7v-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 3v12m0 0-4-4m4 4 4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}