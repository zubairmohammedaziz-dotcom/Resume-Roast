"use client";

import JobRecommendations from "../components/JobRecommendations";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import { useState } from "react";
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

export default function Home() {
  const [jobRecommendations, setJobRecommendations] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    if (!selectedFile) {
      setStatus("Please upload a resume first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("AI recruiter is sharpening the red pen...");
      setReport(null);
      setJobRecommendations([]);

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus(data.message || "AI analysis failed.");
        return;
      }

     const reportData: Report = {
  success: true,
  message: data.message || "Resume analyzed successfully!",
  fileName: data.fileName || selectedFile.name,

  candidateName:
    typeof data.candidateName === "string"
      ? data.candidateName.trim()
      : "",

  headline:
    typeof data.headline === "string"
      ? data.headline.trim()
      : "Professional Candidate",

  atsScore: Number(data.atsScore) || 0,
  recruiterScore: Number(data.recruiterScore) || 0,
  hiringProbability: data.hiringProbability || "Medium",

  roast: data.roast || "No recruiter roast generated.",

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

  jobMatches: Array.isArray(data.jobMatches)
    ? data.jobMatches
    : [],
};
      setReport(reportData);
      const savedReports = JSON.parse(localStorage.getItem("resumeReports") || "[]");

const newSavedReport = {
  id: Date.now().toString(),
  resumeName: selectedFile?.name || "Untitled Resume",
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
      } catch (err) {
        console.error(err);
      } finally {
        setJobsLoading(false);
      }

      setStatus("Resume roasted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. The recruiter stormed out.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  }
function downloadImprovedResume() {
  if (!report) {
    alert("Please analyze a resume first.");
    return;
  }

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const textWidth = pageWidth - margin * 2;
    let y = 20;

    const addPageIfNeeded = (requiredHeight = 12) => {
      if (y + requiredHeight > pageHeight - 18) {
        pdf.addPage();
        y = 20;
      }
    };

    const addHeading = (text: string) => {
      addPageIfNeeded(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.text(text, margin, y);
      y += 8;
    };

    const addParagraph = (text: string) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);

      const lines = pdf.splitTextToSize(text || "Not available.", textWidth);

      lines.forEach((line: string) => {
        addPageIfNeeded(6);
        pdf.text(line, margin, y);
        y += 5;
      });

      y += 3;
    };

    const addBulletList = (items: string[]) => {
      const safeItems = Array.isArray(items) ? items : [];

      if (safeItems.length === 0) {
        addParagraph("Not available.");
        return;
      }

      safeItems.forEach((item) => {
        const lines = pdf.splitTextToSize(`• ${item}`, textWidth - 3);

        lines.forEach((line: string) => {
          addPageIfNeeded(6);
          pdf.text(line, margin + 2, y);
          y += 5;
        });

        y += 2;
      });
    };

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(21);
    pdf.text("ATS-Optimized Resume", margin, y);
    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Generated by Resume Roast AI", margin, y);
    y += 12;

    addHeading("Professional Summary");
    addParagraph(report.improvedSummary);

    addHeading("Optimized Resume Bullets");
    addBulletList(report.rewrittenBullets);

    addHeading("Optimized Skills");
    addBulletList(report.optimizedSkills);

    addHeading("Recommended ATS Keywords");
    addBulletList(report.missingKeywords);

    const cleanName =
      report.fileName
        ?.replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_") || "Improved_Resume";

    pdf.save(`${cleanName}_ATS_Optimized_Resume.pdf`);
  } catch (error) {
    console.error("Resume PDF download error:", error);
    alert("Unable to download the improved resume.");
  }
}

  function copyFullReport() {
    if (!report) return;

    const fullReport = `
Resume Roast Report

ATS Score: ${report.atsScore}/100
Recruiter Score: ${report.recruiterScore}/100
Hiring Probability: ${report.hiringProbability}

Recruiter Roast:
${report.roast}

Strengths:
${report.strengths.map((item) => `- ${item}`).join("\n")}

Weaknesses:
${report.weaknesses.map((item) => `- ${item}`).join("\n")}

Missing Keywords:
${report.missingKeywords.map((item) => `- ${item}`).join("\n")}

Improved Summary:
${report.improvedSummary}

Rewritten Resume Bullets:
${report.rewrittenBullets.map((item) => `- ${item}`).join("\n")}

Optimized Skills:
${report.optimizedSkills.map((item) => `- ${item}`).join("\n")}

Interview Questions:
${report.interviewQuestions.map((item) => `- ${item}`).join("\n")}

Best Job Matches:
${report.jobMatches
  .map(
    (job) =>
      `- ${job.company} | ${job.role} | ${job.location} | ${job.match}% match | ${job.url}`
  )
  .join("\n")}
`;

    copyText(fullReport);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-[1500px] px-6 py-8">
        <Hero />

        <FeatureGrid />

        <section
          id="resume-analyzer"
          className="mt-24 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl md:p-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            Resume Analyzer
          </p>

          <h2 className="mt-4 text-5xl font-black md:text-6xl">
            Upload Your Resume
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Get ATS analysis, recruiter feedback, missing keywords, resume
            rewrite, job matches, cover letter help, and interview preparation
            in one career platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <label className="cursor-pointer rounded-2xl bg-orange-500 px-8 py-4 font-black text-black transition hover:scale-105 hover:bg-orange-400">
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setSelectedFile(file);
                    setStatus("");
                    setReport(null);
                    setJobRecommendations([]);
                  }
                }}
              />
            </label>

            <a
              href="#features"
              className="rounded-2xl border border-zinc-700 bg-black px-8 py-4 font-black text-white transition hover:border-orange-500"
            >
              View Features
            </a>
          </div>

          {selectedFile && (
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
              <p className="text-green-400">✓ Resume Uploaded</p>

              <p className="mt-4 text-xl font-bold">{selectedFile.name}</p>

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="mt-8 rounded-xl bg-white px-8 py-3 font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Analyze Resume"}
              </button>

              {status && <p className="mt-5 text-orange-400">{status}</p>}

              {(isLoading || jobsLoading) && (
                <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
              )}

              {jobsLoading && (
                <p className="mt-4 text-sm text-orange-400">
                  Finding AI job recommendations...
                </p>
              )}
            </div>
          )}

          {report && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={downloadImprovedResume}
                className="rounded-xl bg-green-500 px-7 py-3 font-bold text-black transition hover:bg-green-400"
              >
                Download Improved Resume
              </button>

              <button
                onClick={copyFullReport}
                className="rounded-xl bg-orange-500 px-7 py-3 font-bold text-black transition hover:bg-orange-400"
              >
                Copy Full Report
              </button>
            </div>
          )}
        </section>

        {report && (
          <ReportSection
            report={report}
            copyText={copyText}
            jobRecommendations={jobRecommendations}
          />
        )}

        <Pricing />

        <Footer />
      </div>
    </main>
  );
}

function ReportSection({
  report,
  copyText,
  jobRecommendations,
}: {
  report: Report;
  copyText: (text: string) => void;
  jobRecommendations: any[];
}) {
  return (
    <div className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-left shadow-2xl md:p-10">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
          AI Recruiter Verdict
        </p>

        <h2 className="mt-3 text-4xl font-extrabold text-orange-500 md:text-6xl">
          Resume Roast Report
        </h2>

        {report.fileName && (
          <p className="mt-3 text-sm text-gray-500">{report.fileName}</p>
        )}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <GaugeCard title="ATS Score" value={report.atsScore} />
        <GaugeCard title="Recruiter Score" value={report.recruiterScore} />
        <ProbabilityCard value={report.hiringProbability} />
      </div>

      <RoastCard report={report} />

      <div className="grid gap-8 md:grid-cols-2">
        <ListCard title="✅ Strengths" items={report.strengths} />
        <ListCard title="❌ Weaknesses" items={report.weaknesses} />
      </div>

      <ListCard title="🔑 Missing Keywords" items={report.missingKeywords} />

      <CopyCard
        title="✍️ Improved Professional Summary"
        text={report.improvedSummary}
        copyText={copyText}
      />

      <CopyListCard
        title="🚀 Rewritten Resume Bullets"
        items={report.rewrittenBullets}
        copyText={copyText}
      />

      <CopyListCard
        title="🛠 Optimized Skills"
        items={report.optimizedSkills}
        copyText={copyText}
      />

      <ListCard
        title="🎯 Interview Questions"
        items={report.interviewQuestions}
      />

      <JobMatches jobs={report.jobMatches || []} />

      {jobRecommendations.length > 0 ? (
        <div className="mt-8">
          <h3 className="mb-5 text-2xl font-extrabold text-orange-400">
            AI Job Recommendations
          </h3>
          <JobRecommendations jobs={jobRecommendations} />
        </div>
      ) : null}

      <TailorResume report={report} />

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-black p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Resume Roast Preview Report
        </p>
        <p className="mt-2 text-gray-400">
          Built to roast weak resumes, rescue strong careers, and mildly offend
          bullet points.
        </p>
      </div>
    </div>
  );
}

function RoastCard({ report }: { report: Report }) {
  const roastTitle =
    report.atsScore >= 80
      ? "☕ Coffee Break Feedback"
      : report.atsScore >= 60
      ? "🔥 Recruiter Roast"
      : "🚨 ATS Crime Report";

  const funnyVerdict =
    report.atsScore >= 80
      ? "This resume is interview-ready, but a few bullets are still wearing casual slippers to a formal meeting."
      : report.atsScore >= 60
      ? "Your resume has good experience, but it is making recruiters dig like they are searching for treasure."
      : "This resume is not hopeless. But right now, ATS systems are looking at it like it joined the wrong meeting.";

  return (
    <div className="mt-8 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-zinc-900 to-black p-8">
      <h3 className="text-2xl font-extrabold text-orange-400">{roastTitle}</h3>
      <p className="mt-5 rounded-2xl border border-zinc-800 bg-black p-5 text-lg leading-8 text-gray-200">
        {funnyVerdict}
      </p>
      <p className="mt-5 leading-8 text-gray-300">{report.roast}</p>
    </div>
  );
}

function GaugeCard({ title, value }: { title: string; value: number }) {
  const score = Math.max(0, Math.min(100, value));
  const pathColor =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
      <div className="mx-auto h-44 w-44">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            textColor: pathColor,
            pathColor,
            trailColor: "#27272a",
            textSize: "22px",
          })}
        />
      </div>
      <p className="mt-5 text-lg font-bold text-gray-300">{title}</p>
    </div>
  );
}

function ProbabilityCard({ value }: { value: string }) {
  const color = value.toLowerCase().includes("high")
    ? "text-green-400"
    : value.toLowerCase().includes("low")
    ? "text-red-400"
    : "text-orange-400";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
      <p className="text-lg font-bold text-gray-400">Hiring Probability</p>
      <p className={`mt-10 text-6xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h3 className="text-2xl font-extrabold text-orange-400">{title}</h3>
      <ul className="mt-5 list-disc space-y-3 pl-5 text-gray-300">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>No data available.</li>
        )}
      </ul>
    </div>
  );
}

function CopyCard({
  title,
  text,
  copyText,
}: {
  title: string;
  text: string;
  copyText: (text: string) => void;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h3 className="text-2xl font-extrabold text-orange-400">{title}</h3>
      <button
        onClick={() => copyText(text)}
        className="mt-4 rounded-xl border border-zinc-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-zinc-800"
      >
        Copy
      </button>
      <p className="mt-5 leading-8 text-gray-300">{text}</p>
    </div>
  );
}

function CopyListCard({
  title,
  items,
  copyText,
}: {
  title: string;
  items: string[];
  copyText: (text: string) => void;
}) {
  const combined = items.map((item) => `• ${item}`).join("\n");

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h3 className="text-2xl font-extrabold text-orange-400">{title}</h3>
      <button
        onClick={() => copyText(combined)}
        className="mt-4 rounded-xl border border-zinc-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-zinc-800"
      >
        Copy
      </button>

      <ul className="mt-5 list-disc space-y-3 pl-5 text-gray-300">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>No data available.</li>
        )}
      </ul>
    </div>
  );
}