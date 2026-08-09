import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI Resume Analyzer & ATS Resume Checker | OffernHire",
  description:
    "Analyze your resume with AI. Get an ATS score, recruiter score, resume roast, actionable improvements and job-match insights with OffernHire.",
};

export default function ResumeAnalyzerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            AI Resume Analyzer
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Find out why your resume
            <span className="text-orange-500"> gets rejected.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg">
            Upload your resume and let OffernHire analyze it like an ATS and
            recruiter. Get your ATS score, recruiter score, weaknesses,
            improvements and job-match insights in minutes.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/#resume-analyzer"
              className="rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black transition hover:bg-orange-400"
            >
              Analyze My Resume Free →
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-xl border border-zinc-700 px-7 py-4 text-sm font-bold text-white transition hover:border-orange-500"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-zinc-500">
            <span>✓ ATS analysis</span>
            <span>✓ Recruiter analysis</span>
            <span>✓ Actionable feedback</span>
            <span>✓ No credit card required</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            More than a score
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Understand exactly what needs fixing.
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            A high-quality resume isn't just about keywords. OffernHire looks
            at your resume from multiple angles so you know what recruiters
            are likely to see.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "ATS Score",
              text: "See how well your resume is structured for applicant tracking systems.",
            },
            {
              title: "Recruiter Score",
              text: "Understand how your resume performs from a human recruiter's perspective.",
            },
            {
              title: "Resume Roast",
              text: "Get direct, practical feedback on the weaknesses holding your resume back.",
            },
            {
              title: "Keyword Analysis",
              text: "Identify missing or weak keywords that can affect your chances of being shortlisted.",
            },
            {
              title: "Actionable Improvements",
              text: "Get specific recommendations instead of generic resume advice.",
            },
            {
              title: "Job Match Insights",
              text: "Understand which opportunities are more aligned with your current profile.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                ✦
              </div>

              <h3 className="text-lg font-black">{feature.title}</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
              Simple process
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Analyze your resume in three steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Upload your resume",
                text: "Upload your existing resume and let OffernHire process your profile.",
              },
              {
                number: "02",
                title: "Get your analysis",
                text: "Receive your ATS score, recruiter score and detailed improvement recommendations.",
              },
              {
                number: "03",
                title: "Improve and apply",
                text: "Fix the weaknesses, tailor your resume and focus on jobs where you have a stronger chance.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-zinc-800 bg-black p-7"
              >
                <div className="text-sm font-black text-orange-500">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-black">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
        <h2 className="text-3xl font-black sm:text-5xl">
          Stop guessing why you're not getting interviews.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-zinc-400">
          Analyze your resume, understand what's holding you back and make
          every application stronger.
        </p>

        <Link
          href="/#resume-analyzer"
          className="mt-8 inline-flex rounded-xl bg-orange-500 px-8 py-4 text-sm font-black text-black transition hover:bg-orange-400"
        >
          Analyze My Resume Free →
        </Link>
      </section>

      <Footer />
    </main>
  );
}