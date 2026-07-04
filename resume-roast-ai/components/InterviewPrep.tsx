"use client";

import { useState } from "react";

interface Props {
  jobDescription: string;
  report: any;
}

export default function InterviewPrep({
  jobDescription,
  report,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any>(null);

  async function generateInterview() {
    setLoading(true);

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription,
        resumeSummary: report?.summary,
        resumeBullets: report?.experienceHighlights,
        skills: report?.optimizedSkills,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setQuestions(data);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-6 mt-8">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          🎯 AI Interview Preparation
        </h2>

        <button
          onClick={generateInterview}
          disabled={loading}
          className="rounded-lg bg-orange-500 px-5 py-2 text-white font-semibold hover:bg-orange-600"
        >
          {loading ? "Generating..." : "Generate Interview Questions"}
        </button>

      </div>

      {!questions && (
        <p className="mt-4 text-zinc-400">
          Click the button to generate interview questions tailored to this job.
        </p>
      )}

      {questions && (
        <div className="space-y-8 mt-8">

          <Section
            title="HR Questions"
            data={questions.hrQuestions}
          />

          <Section
            title="Leadership Questions"
            data={questions.leadershipQuestions}
          />

          <Section
            title="Technical Questions"
            data={questions.technicalQuestions}
          />

          <div>

            <h2 className="font-bold text-xl mb-3">
              Final Interview Tips
            </h2>

            <ul className="list-disc ml-6 space-y-2">
              {questions.finalTips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>

          </div>

        </div>
      )}

    </div>
  );
}

function Section({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
  return (
    <div>

      <h2 className="font-bold text-xl mb-4">
        {title}
      </h2>

      <div className="space-y-5">

        {data?.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-700 p-4"
          >

            <h3 className="font-semibold text-orange-400">
              Q{i + 1}. {item.question}
            </h3>

            <p className="mt-3 whitespace-pre-wrap">
              {item.answer}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}