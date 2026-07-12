"use client";

import { useEffect, useState } from "react";
import type { Report } from "../types/report";
import { downloadResumePdf } from "../lib/pdfResume";
import InterviewPrep from "./InterviewPrep";
import ResumePreview from "./ResumePreview";
import WorkflowSteps from "./WorkflowSteps";
import ATSDashboard from "./ATSDashboard";
import ResumeToolbar from "./ResumeToolbar";

type Props = {
  report: Report;
};

type TailoredResult = {
  tailoredSummary: string;
  tailoredBullets: string[];
  tailoredSkills: string[];
  coverLetter: string;
};

export default function TailorResume({ report }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailoredResult | null>(null);
  const [loading, setLoading] = useState(false);

  const candidateName =
    (report as any)?.name ||
    (report as any)?.candidateName ||
    "Zubair Mohammed";

  const headline =
    (report as any)?.headline ||
    "Operations Manager | Program Manager | Business Operations";

  const tailoredScore = result
    ? Math.min(98, Math.max(88, report.atsScore + 12))
    : 0;

  useEffect(() => {
    function handleTailorJob(event: Event) {
      const customEvent = event as CustomEvent<string>;
      setJobDescription(customEvent.detail);
    }

    window.addEventListener("tailor-job", handleTailorJob);

    return () => {
      window.removeEventListener("tailor-job", handleTailorJob);
    };
  }, []);

  async function handleTailor() {
    if (!jobDescription.trim()) {
      alert("Paste a job description first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report, jobDescription }),
      });

      const data = await response.json();

    if (!response.ok) {
  alert(data.message || "Failed to tailor resume.");
  return;
}

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while tailoring the resume.");
    } finally {
      setLoading(false);
    }
  }

  function downloadTailoredResume() {
    if (!result) return;

    downloadResumePdf({
      tailoredSummary: result.tailoredSummary,
      tailoredBullets: result.tailoredBullets,
      tailoredSkills: result.tailoredSkills,
    });
  }

  function downloadCoverLetter() {
    if (!result?.coverLetter) return;

    const blob = new Blob([result.coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Tailored_Cover_Letter.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  function printResume() {
    window.print();
  }

  return (
    <>
      <WorkflowSteps activeStep={4} />

      <div
  id="tailor-resume-section"
  className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl"
>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
              Resume Roast Studio
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              🎯 AI Resume Tailoring
            </h2>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Paste any job description and Resume Roast will rewrite your
              resume into a recruiter-ready, ATS-optimized version.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500 bg-green-500/10 px-6 py-5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-green-300">
              Estimated ATS
            </p>
            <p className="mt-2 text-4xl font-black text-green-400">
              {tailoredScore}%
            </p>
          </div>
        </div>

        <textarea
  id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description Here..."
          className="mt-8 min-h-[220px] w-full rounded-2xl border border-zinc-700 bg-black p-5 text-white outline-none transition focus:border-orange-500"
        />

        <button
          onClick={handleTailor}
          disabled={loading}
          className="mt-6 rounded-xl bg-orange-500 px-8 py-3 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "✨ Tailoring Resume..." : "✨ Tailor Resume"}
        </button>

        {loading && (
          <div className="mt-6 rounded-2xl border border-zinc-700 bg-black p-5">
            <p className="font-bold text-orange-400">
              Resume Roast is working...
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Reading the job description, finding ATS keywords, rewriting your
              summary, improving bullets, and preparing interview material.
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-orange-500" />
            </div>
          </div>
        )}

        {result && (
          <>
            <ATSDashboard
              score={tailoredScore}
              keywordCount={result.tailoredSkills.length}
            />

            <div className="mt-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-black text-green-400">
                  📄 AI Optimized Resume
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Recruiter-ready ATS resume generated by Resume Roast.
                </p>
              </div>

              <div className="rounded-xl border border-green-500 bg-green-500/10 px-4 py-2">
                <span className="text-sm font-bold text-green-400">
                  ✓ ATS Optimized
                </span>
              </div>
            </div>

            <ResumePreview
              name={candidateName}
              headline={headline}
              summary={result.tailoredSummary}
              bullets={result.tailoredBullets}
              skills={result.tailoredSkills}
            />

            <ResumeToolbar
              onDownloadResume={downloadTailoredResume}
              onCopySummary={() => copyText(result.tailoredSummary)}
              onPrintResume={printResume}
              onDownloadCoverLetter={downloadCoverLetter}
              hasCoverLetter={!!result.coverLetter}
            />

            {result.coverLetter && (
              <div className="mt-10 rounded-2xl border border-zinc-700 bg-black p-6">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-2xl font-black text-orange-400">
                      ✉ Cover Letter
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Personalized for the pasted job description.
                    </p>
                  </div>

                  <button
                    onClick={() => copyText(result.coverLetter)}
                    className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-bold text-white hover:bg-zinc-800"
                  >
                    📋 Copy Cover Letter
                  </button>
                </div>

                <p className="mt-5 whitespace-pre-line leading-8 text-zinc-300">
                  {result.coverLetter}
                </p>
              </div>
            )}

            <InterviewPrep
              jobDescription={jobDescription}
              report={{
                summary: result.tailoredSummary,
                experienceHighlights: result.tailoredBullets,
                optimizedSkills: result.tailoredSkills,
              }}
            />
          </>
        )}
      </div>
    </>
  );
}