import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free AI Resume Checker India | ATS Score & Resume Review",
  description:
    "Check your resume with AI. Get your ATS score, recruiter score, missing keywords, resume feedback and job-ready improvements instantly.",
  keywords: [
    "AI resume checker India",
    "free ATS resume checker",
    "resume score checker",
    "AI resume review",
    "resume analyzer India",
  ],
};

export default function AIResumeCheckerPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
          Free AI Resume Checker
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          AI Resume Checker Built for Job Seekers in India
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          Upload your resume and instantly get your ATS score, recruiter score,
          missing keywords, strengths, weaknesses and personalized improvements.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500"
        >
          Check My Resume Free
        </Link>

        <p className="mt-4 text-sm text-gray-400">
          No credit card required.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          {
            title: "ATS Score",
            description:
              "See how well your resume performs against applicant tracking systems.",
          },
          {
            title: "Recruiter Score",
            description:
              "Understand how recruiters may evaluate your resume within seconds.",
          },
          {
            title: "Missing Keywords",
            description:
              "Identify important skills and keywords missing from your resume.",
          },
          {
            title: "Resume Roast",
            description:
              "Get direct and honest feedback about what is hurting your chances.",
          },
          {
            title: "Resume Improvements",
            description:
              "Receive stronger summaries, bullet points and skill recommendations.",
          },
          {
            title: "Job Matches",
            description:
              "Discover relevant job opportunities based on your resume and experience.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="mt-3 leading-7 text-gray-400">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold">
          Why Use an AI Resume Checker?
        </h2>

        <div className="mt-6 space-y-5 leading-8 text-gray-300">
          <p>
            Most resumes are rejected before a recruiter reads them. Applicant
            tracking systems scan resumes for relevant skills, keywords,
            experience and formatting.
          </p>

          <p>
            OffernHire analyzes your resume like both an ATS system and a
            recruiter. It highlights weak sections, missing keywords and unclear
            achievements so you can improve your chances of getting shortlisted.
          </p>

          <p>
            Instead of giving you a generic score, OffernHire provides practical
            recommendations you can use immediately.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold">How It Works</h2>

        <div className="mt-8 space-y-6">
          {[
            "Upload your existing resume.",
            "Our AI analyzes your resume structure, skills and experience.",
            "Receive your ATS score, recruiter score and detailed feedback.",
            "Improve or tailor your resume for relevant job roles.",
          ].map((step, index) => (
            <div
              key={step}
              className="flex gap-4 rounded-2xl border border-white/10 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold">
                {index + 1}
              </span>
              <p className="pt-1 text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

        <div className="mt-8 space-y-6">
          {[
            {
              question: "Is the AI resume checker free?",
              answer:
                "Yes. Free users can analyze one resume per day and receive personalized job matches.",
            },
            {
              question: "What is an ATS score?",
              answer:
                "An ATS score estimates how well your resume matches the structure, keywords and content commonly evaluated by applicant tracking systems.",
            },
            {
              question: "Can OffernHire improve my resume?",
              answer:
                "Yes. OffernHire identifies weaknesses and suggests improved summaries, bullet points, skills and missing keywords.",
            },
            {
              question: "Is this suitable for freshers?",
              answer:
                "Yes. Freshers, experienced professionals and career switchers can all use OffernHire.",
            },
          ].map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-3 leading-7 text-gray-400">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-500/30 bg-purple-500/10 px-6 py-14">
          <h2 className="text-3xl font-bold">
            Find Out What Is Wrong With Your Resume
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Get your ATS score, recruiter feedback and actionable resume
            improvements in minutes.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500"
          >
            Analyze My Resume Free
          </Link>
        </div>
      </section>
    </main>
  );
}