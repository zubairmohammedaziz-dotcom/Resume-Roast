import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Mail,
  Target,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    eyebrow: "Analyze",
    title: "Resume intelligence",
    description:
      "Understand how recruiters and ATS systems evaluate your resume before you apply.",
  },
  {
    icon: Target,
    eyebrow: "Improve",
    title: "ATS optimization",
    description:
      "Identify missing keywords, weak sections and opportunities to improve relevance.",
  },
  {
    icon: WandSparkles,
    eyebrow: "Tailor",
    title: "Targeted resume",
    description:
      "Rewrite your summary, skills and experience for the role you want.",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "Discover",
    title: "Job matching",
    description:
      "Find roles aligned with your experience, seniority and career direction.",
  },
  {
    icon: Mail,
    eyebrow: "Apply",
    title: "Cover letter",
    description:
      "Generate a focused letter that connects your background to the target role.",
  },
  {
    icon: BarChart3,
    eyebrow: "Prepare",
    title: "Interview preparation",
    description:
      "Practice questions generated from your resume and the job description.",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="mt-24 rounded-[2rem] border border-white/10 bg-[#0b0b0b] px-6 py-16 md:px-12 md:py-20"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Complete workflow
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Everything you need to submit a stronger application.
          </h2>
        </div>

        <p className="max-w-2xl text-base leading-8 text-zinc-400 lg:justify-self-end">
          Resume Roast turns scattered career tools into one guided workflow,
          from the first upload to the final application.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="group rounded-[1.5rem] border border-white/10 bg-[#101010] p-6 transition duration-200 hover:-translate-y-1 hover:border-zinc-600 hover:bg-[#131313]"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-orange-400">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
                  {feature.eyebrow}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {feature.description}
              </p>

              <div className="mt-6 h-px w-full bg-white/5 transition group-hover:bg-orange-500/20" />
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col justify-between gap-5 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-6 md:flex-row md:items-center">
        <div>
          <p className="font-medium text-white">
            Start with one resume upload
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Resume Roast guides you through every step after that.
          </p>
        </div>

        <a
          href="#resume-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
        >
          Analyze resume
          <ArrowRightIcon />
        </a>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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