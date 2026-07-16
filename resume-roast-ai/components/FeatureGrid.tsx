import {
  BarChart3,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  Mail,
  Target,
  WandSparkles,
} from "lucide-react";

const copilotSteps = [
  {
    step: "01",
    icon: FileSearch,
    eyebrow: "Understand",
    title: "Profile intelligence",
    description:
      "See how recruiters and ATS systems interpret your experience, strengths and career positioning.",
    outcome: "Know exactly what is holding you back.",
  },
  {
    step: "02",
    icon: Target,
    eyebrow: "Improve",
    title: "Application strategy",
    description:
      "Identify missing keywords, weak sections and the highest-impact improvements before applying.",
    outcome: "Fix the gaps that reduce interview chances.",
  },
  {
    step: "03",
    icon: BriefcaseBusiness,
    eyebrow: "Discover",
    title: "Career opportunities",
    description:
      "Explore roles aligned with your actual experience, skills, seniority and career direction.",
    outcome: "Focus on opportunities where you can compete.",
  },
  {
    step: "04",
    icon: WandSparkles,
    eyebrow: "Tailor",
    title: "Targeted resume",
    description:
      "Rewrite your summary, skills and experience around the role you want without losing authenticity.",
    outcome: "Submit a stronger resume for every role.",
  },
  {
    step: "05",
    icon: Mail,
    eyebrow: "Apply",
    title: "Application toolkit",
    description:
      "Create a focused cover letter that connects your background directly to the employer’s needs.",
    outcome: "Apply faster without sounding generic.",
  },
  {
    step: "06",
    icon: BarChart3,
    eyebrow: "Prepare",
    title: "Interview readiness",
    description:
      "Practice likely questions generated from your resume, strengths, weaknesses and target role.",
    outcome: "Walk into interviews better prepared.",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#090909] px-5 py-16 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:px-8 md:px-12 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute right-[-160px] top-[-180px] h-[420px] w-[420px] rounded-full bg-orange-500/[0.08] blur-[130px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
      </div>

      <div className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                AI Career Copilot
              </p>
            </div>

            <h2
              id="features-title"
              className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white md:text-5xl lg:text-6xl"
            >
              One intelligent workflow for your entire application journey.
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-base leading-8 text-zinc-400">
              Resume Roast connects resume analysis, career discovery,
              application tailoring and interview preparation so every step
              improves the next.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <ValuePill label="Resume intelligence" />
              <ValuePill label="Career matching" />
              <ValuePill label="Application strategy" />
              <ValuePill label="Interview readiness" />
            </div>
          </div>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute bottom-10 left-[32px] top-10 hidden w-px bg-gradient-to-b from-orange-500/50 via-white/10 to-transparent xl:block"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copilotSteps.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d] p-6 transition duration-200 hover:-translate-y-1 hover:border-orange-500/25 hover:bg-[#111111] hover:shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent transition group-hover:via-orange-500/40"
                  />

                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.07] text-orange-400">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
                        Step {feature.step}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300">
                        {feature.eyebrow}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/25 p-4">
                    <div className="flex gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400">
                        <CheckIcon />
                      </span>

                      <p className="text-xs leading-5 text-zinc-400">
                        {feature.outcome}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-orange-500/20 bg-orange-500/[0.055]">
          <div className="grid gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:items-center md:px-7">
            <div className="flex gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 sm:flex">
                <FileText className="h-5 w-5" strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-base font-semibold text-white">
                  One resume upload. A complete career action plan.
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Understand your profile, identify stronger opportunities,
                  tailor your application and prepare for interviews without
                  switching between disconnected tools.
                </p>
              </div>
            </div>

            <a
              href="#resume-analyzer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(249,115,22,0.14)] transition hover:bg-orange-400 hover:shadow-[0_0_38px_rgba(249,115,22,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
            >
              Start my free analysis
              <ArrowRightIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuePill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-zinc-500">
      {label}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path
        d="m6 12 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}