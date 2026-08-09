import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const comparisonRows = [
  [
    "Show you thousands of job listings",
    "Identify the opportunities where your profile is strongest",
  ],
  [
    "Leave you to judge whether you are a good fit",
    "Explain why you match and where recruiters may hesitate",
  ],
  [
    "Encourage you to apply to more jobs",
    "Help you apply strategically to the right jobs",
  ],
  [
    "Provide the same resume for every application",
    "Tailor your resume and cover letter for the specific role",
  ],
  [
    "Stop after you click Apply",
    "Prepare you for the interview before you apply",
  ],
];

const intelligenceCards = [
  {
    number: "01",
    title: "Recruiter intelligence",
    text: "Understand how recruiters and ATS systems may evaluate your profile — including the strengths and weaknesses that can affect your chances.",
  },
  {
    number: "02",
    title: "Opportunity intelligence",
    text: "Understand which roles are genuinely aligned with your experience instead of applying blindly to hundreds of openings.",
  },
  {
    number: "03",
    title: "Application intelligence",
    text: "Build a stronger application with role-specific resume, cover letter and interview preparation.",
  },
  {
    number: "04",
    title: "One connected workspace",
    text: "Keep your resume analysis, job matching, tailoring and career preparation connected in one place.",
  },
];

const differencePoints = [
  "We focus on application quality, not application volume.",
  "We help you understand why a role fits before you apply.",
  "We turn your resume into actionable career intelligence.",
  "We help you prepare for what happens after you click Apply.",
];

export default function WhyOffernHirePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 sm:py-20">
        <section className="mx-auto max-w-5xl">
          {/* Hero */}
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-orange-500/40 bg-orange-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                Why OffernHire
              </div>

              <h1 className="text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">
                Job portals help you
                <br />
                find openings.
                <br />
                <span className="text-orange-500">
                  OffernHire helps you
                  <br />
                  decide where to apply.
                </span>
              </h1>
            </div>

            <p className="max-w-xl text-sm leading-7 text-zinc-500 md:pb-2">
              OffernHire does not replace job portals. It gives you the
              intelligence they do not: where you are competitive, what could
              get you rejected, and how to prepare a stronger application
              before you apply.
            </p>
          </div>

          {/* Comparison */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
            <div className="grid grid-cols-2 border-b border-zinc-800">
              <div className="border-r border-zinc-800 p-5 sm:p-6">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Traditional job portals
                </div>

                <p className="mt-2 text-xs font-bold text-zinc-300">
                  More listings. More guesswork.
                </p>
              </div>

              <div className="bg-orange-500/[0.03] p-5 sm:p-6">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
                  OffernHire
                </div>

                <p className="mt-2 text-xs font-bold text-white">
                  Better decisions. Stronger applications.
                </p>
              </div>
            </div>

            {comparisonRows.map(([traditional, offernhire], index) => (
              <div
                key={index}
                className="grid grid-cols-2 border-b border-zinc-800 last:border-b-0"
              >
                <div className="flex gap-3 border-r border-zinc-800 p-5 text-[11px] leading-5 text-zinc-500 sm:p-6">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-700" />
                  <span>{traditional}</span>
                </div>

                <div className="flex gap-3 bg-orange-500/[0.02] p-5 text-[11px] leading-5 text-zinc-400 sm:p-6">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-500 text-[9px] text-emerald-400">
                    ✓
                  </span>

                  <span>{offernhire}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Core Difference */}
          <section className="mt-16">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
                  The OffernHire difference
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Stop asking,
                  <br />
                  <span className="text-orange-500">
                    “How many jobs can I apply to?”
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">
                  Start asking, “Which jobs give me the strongest chance of
                  getting hired — and what can I do to improve that chance?”
                </p>
              </div>

              <div className="space-y-3">
                {differencePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/5 text-xs font-black text-orange-400">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-zinc-300">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Intelligence Section */}
          <section className="mt-16">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
              Why job seekers choose OffernHire
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Everything you need before you click Apply.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
              One connected workspace to understand your profile, choose
              better opportunities, strengthen your application and prepare
              for the interview.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {intelligenceCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-orange-500/30"
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/5 text-[9px] font-black text-orange-400">
                    {card.number}
                  </div>

                  <h3 className="text-sm font-black text-white">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-zinc-500">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What OffernHire Is Not */}
          <section className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-950 p-7 sm:p-9">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">
                  What OffernHire is not
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  We are not another job board.
                </h2>
              </div>

              <div>
                <p className="text-sm leading-7 text-zinc-400">
                  We are not trying to replace the platforms where jobs are
                  listed. We sit before the application and help you make a
                  better decision about where to spend your time.
                </p>

                <p className="mt-4 text-sm font-bold leading-7 text-zinc-300">
                  Find jobs anywhere.
                  <span className="text-orange-400">
                    {" "}
                    Use OffernHire to decide which ones are worth your effort.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="mt-8 flex flex-col gap-6 rounded-2xl border border-orange-500/30 bg-orange-500/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-black text-white">
                Your next application should be a smarter one.
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Understand your profile before you decide where to apply.
              </p>
            </div>

            <Link
              href="/resume-analyzer"
              className="shrink-0 rounded-xl bg-orange-500 px-6 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400"
            >
              Analyze My Resume Free →
            </Link>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}