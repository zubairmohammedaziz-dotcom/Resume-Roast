import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const comparisonRows = [
  {
    traditional: "Show you thousands of job listings",
    offernHire: "Identifies the opportunities where your profile is strongest",
  },
  {
    traditional: "Leave you to judge whether you are a good fit",
    offernHire: "Explains why you match and where recruiters may hesitate",
  },
  {
    traditional: "Encourage you to apply to more jobs",
    offernHire: "Helps you apply strategically to the right jobs",
  },
  {
    traditional: "Provide the same resume for every application",
    offernHire: "Tailors your resume and cover letter for the specific role",
  },
  {
    traditional: "Stop after you click Apply",
    offernHire: "Prepares you for the interview before you apply",
  },
];

const trustPoints = [
  {
    icon: FileSearch,
    title: "Recruiter intelligence",
    description:
      "Understand your ATS readiness, recruiter appeal and the risks weakening your profile.",
  },
  {
    icon: Target,
    title: "Opportunity intelligence",
    description:
      "Compare best-fit, safer and stretch opportunities based on your real experience.",
  },
  {
    icon: Sparkles,
    title: "Application intelligence",
    description:
      "Generate a targeted resume, cover letter and interview strategy for each important role.",
  },
  {
    icon: ShieldCheck,
    title: "Private and secure",
    description:
      "Your resume is processed securely and used only to deliver your career analysis.",
  },
];

export default function WhyOffernHire() {
  return (
    <section
      aria-labelledby="why-offernhire-title"
      className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#090909] px-5 py-16 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:px-8 md:px-12 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-orange-500/[0.08] blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                Why OffernHire
              </p>
            </div>

            <h2
              id="why-offernhire-title"
              className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white md:text-5xl lg:text-6xl"
            >
              Job portals help you find openings.
              <span className="mt-2 block text-orange-400">
                OffernHire helps you decide where to apply.
              </span>
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-base leading-8 text-zinc-400">
              OffernHire does not replace job portals. It gives you the
              intelligence they do not: where you are competitive, what could
              get you rejected, and how to prepare a stronger application
              before you apply.
            </p>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#0d0d0d]">
          <div className="grid border-b border-white/[0.08] md:grid-cols-2">
            <div className="px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-zinc-500">
                  <BriefcaseBusiness className="h-5 w-5" strokeWidth={1.7} />
                </span>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Traditional job portals
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-300">
                    More listings. More guesswork.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.08] bg-orange-500/[0.035] px-5 py-5 sm:px-7 md:border-l md:border-t-0">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.08] text-orange-400">
                  <Target className="h-5 w-5" strokeWidth={1.7} />
                </span>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                    OffernHire
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Better decisions. Stronger applications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {comparisonRows.map((row, index) => (
              <div
                key={row.traditional}
                className="grid border-b border-white/[0.07] last:border-b-0 md:grid-cols-2"
              >
                <div className="flex gap-3 px-5 py-5 sm:px-7">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-zinc-700" />
                  <p className="text-sm leading-6 text-zinc-500">
                    {row.traditional}
                  </p>
                </div>

                <div className="flex gap-3 border-t border-white/[0.07] bg-orange-500/[0.02] px-5 py-5 sm:px-7 md:border-l md:border-t-0">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                    strokeWidth={1.7}
                  />
                  <p className="text-sm leading-6 text-zinc-300">
                    {row.offernHire}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
              Why job seekers choose OffernHire
            </p>

            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">
              Everything you need before you click Apply.
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-500 md:text-base">
              One connected workspace to understand your profile, choose better
              opportunities, strengthen your application and prepare for the
              interview.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[1.4rem] border border-white/[0.08] bg-[#0d0d0d] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/20 hover:bg-[#111111]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.07] text-orange-400">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>

                  <h4 className="mt-5 text-base font-semibold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-orange-500/20 bg-orange-500/[0.055]">
          <div className="grid gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:items-center md:px-7">
            <div>
              <p className="text-base font-semibold text-white">
                OffernHire does not help you apply to more jobs.
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                It helps you apply to the right jobs with a stronger strategy,
                better evidence and a complete application.
              </p>
            </div>

            <a
              href="#resume-analyzer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(249,115,22,0.14)] transition hover:bg-orange-400 hover:shadow-[0_0_38px_rgba(249,115,22,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
            >
              Analyze my resume free
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}