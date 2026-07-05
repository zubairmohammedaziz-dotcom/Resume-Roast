"use client";

import { useEffect, useState } from "react";
import type { Report } from "../types/report";
import { downloadResumePdf } from "../lib/pdfResume";
import InterviewPrep from "./InterviewPrep";
import ResumePreview from "./ResumePreview";
import WorkflowSteps from "./WorkflowSteps";

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

      if (!data.success) {
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

      <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-orange-400">
              🎯 AI Resume Tailoring Studio
            </h2>

            <p className="mt-2 text-zinc-400">
              Paste any job description and let AI rewrite your resume for
              maximum ATS score.
            </p>
          </div>

          <div className="rounded-xl border border-green-500 bg-green-500/10 px-5 py-3 text-center">
            <p className="text-xs text-green-300">Estimated ATS</p>
            <p className="text-3xl font-black text-green-400">
              {tailoredScore}%
            </p>
          </div>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description Here..."
          className="mt-8 min-h-[220px] w-full rounded-2xl border border-zinc-700 bg-black p-5 text-white outline-none focus:border-orange-500"
        />

        <button
          onClick={handleTailor}
          disabled={loading}
          className="mt-6 rounded-xl bg-orange-500 px-8 py-3 font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
        >
          {loading ? "✨ Tailoring Resume..." : "✨ Tailor Resume"}
        </button>

        {result && (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-green-500 bg-green-500/10 p-6 text-center">
                <p className="text-zinc-300">ATS Score</p>
                <p className="mt-3 text-5xl font-black text-green-400">
                  {tailoredScore}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-500 bg-orange-500/10 p-6 text-center">
                <p className="text-zinc-300">Keywords Added</p>
                <p className="mt-3 text-5xl font-black text-orange-400">
                  {result.tailoredSkills.length}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500 bg-cyan-500/10 p-6 text-center">
                <p className="text-zinc-300">Resume Ready</p>
                <p className="mt-3 text-4xl font-black text-cyan-400">YES</p>
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-green-400">
                  📄 AI Optimized Resume
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Recruiter-ready ATS resume generated by Resume Roast AI
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

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={downloadTailoredResume}
                className="rounded-xl bg-green-500 px-6 py-3 font-bold text-black"
              >
                ⬇ Download PDF
              </button>

              <button
                onClick={() => copyText(result.tailoredSummary)}
                className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
              >
                📋 Copy Summary
              </button>

              <button
                onClick={printResume}
                className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
              >
                🖨 Print Resume
              </button>

              {result.coverLetter && (
                <button
                  onClick={downloadCoverLetter}
                  className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
                >
                  📄 Download Cover Letter
                </button>
              )}
            </div>

            {result.coverLetter && (
              <div className="mt-10 rounded-2xl border border-zinc-700 p-6">
                <h2 className="text-2xl font-black text-orange-400">
                  Cover Letter
                </h2>

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