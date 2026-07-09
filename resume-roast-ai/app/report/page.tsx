"use client";

import { useEffect, useState } from "react";
import { downloadResumePdf } from "../../lib/pdfResume";

export default function ReportPage() {
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedResumeReport");
    if (saved) setItem(JSON.parse(saved));
  }, []);

  if (!item) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold text-orange-500">No report selected</h1>
        <a href="/dashboard" className="text-orange-400">
          Back to Dashboard
        </a>
      </main>
    );
  }

  const report = item.report;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <a href="/dashboard" className="text-orange-400">
        ← Back to Dashboard
      </a>

      <h1 className="text-4xl font-bold text-orange-500 mt-6">
        Resume Roast Report
      </h1>

      <p className="text-gray-400 mb-4">{item.resumeName}</p>

      <button
        onClick={() => downloadResumePdf(report)}
        className="mb-8 rounded-xl bg-orange-500 px-5 py-3 font-bold text-black hover:bg-orange-400"
      >
        Download PDF Report
      </button>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Score title="ATS Score" value={report.atsScore} />
        <Score title="Recruiter Score" value={report.recruiterScore} />
        <Score title="Hiring Probability" value={report.hiringProbability} />
      </div>

      <Section title="Recruiter Roast" content={report.roast} />
      <List title="Strengths" items={report.strengths} />
      <List title="Weaknesses" items={report.weaknesses} />
      <List title="Missing Keywords" items={report.missingKeywords} />
      <Section title="Improved Summary" content={report.improvedSummary} />
      <List title="Optimized Skills" items={report.optimizedSkills} />
      <List title="Interview Questions" items={report.interviewQuestions} />
      <List
        title="Job Matches"
        items={report.jobMatches?.map(
          (j: any) => `${j.company} - ${j.role} - ${j.match}% match`
        )}
      />
    </main>
  );
}

function Score({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-4xl font-bold text-orange-400">{value ?? "N/A"}</h2>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string }) {
  if (!content) return null;

  return (
    <section className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 mb-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-3">{title}</h2>
      <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </section>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 mb-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-3">{title}</h2>
      <ul className="list-disc pl-6 text-gray-300 space-y-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}