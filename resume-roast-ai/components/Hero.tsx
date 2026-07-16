export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#090909] px-5 py-16 shadow-[0_36px_120px_rgba(0,0,0,0.48)] sm:px-8 md:px-12 md:py-24 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/[0.13] blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
              Your AI Career Copilot
            </span>
          </div>

          <h1
            id="hero-title"
            className="mx-auto mt-8 max-w-6xl text-balance text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[5.35rem]"
          >
            Stop applying blindly.
            <span className="mt-2 block bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              Start landing more interviews.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-pretty text-base leading-8 text-zinc-400 md:text-lg">
            Analyze your profile, understand what recruiters see, discover
            better-fit roles, tailor every application and prepare for
            interviews from one focused career workspace.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#resume-analyzer"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_36px_rgba(249,115,22,0.18)] transition duration-200 hover:bg-orange-400 hover:shadow-[0_0_42px_rgba(249,115,22,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] sm:w-auto sm:min-w-[220px]"
            >
              Analyze my resume free

              <ArrowRightIcon />
            </a>

            <a
              href="#features"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-zinc-300 transition duration-200 hover:border-white/20 hover:bg-white/[0.065] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] sm:w-auto sm:min-w-[190px]"
            >
              See how it works
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-600">
            <InlineTrustItem label="Free resume analysis" />
            <InlineTrustItem label="No credit card required" />
            <InlineTrustItem label="Private and secure" />
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-3">
          <OutcomeCard
            number="01"
            title="Understand your profile"
            description="See your ATS readiness, recruiter appeal and the gaps reducing your interview chances."
          />

          <OutcomeCard
            number="02"
            title="Find your best-fit roles"
            description="Identify career opportunities aligned with your experience, skills and seniority."
          />

          <OutcomeCard
            number="03"
            title="Apply with confidence"
            description="Tailor your resume, generate your cover letter and prepare for likely interview questions."
          />
        </div>

        <div className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#0d0d0d] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.48)] sm:p-4 md:p-5">
          <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-black/35">
            <div className="flex flex-col gap-5 border-b border-white/[0.08] px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/[0.08] text-orange-400">
                    <CopilotIcon />
                  </span>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                    Career Copilot Workspace
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-white md:text-3xl">
                  From resume to interview, in one guided journey.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Stop switching between scattered tools. Your analysis,
                  opportunities, tailored resume and interview preparation stay
                  connected.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MetricPill label="ATS" value="92" suffix="/100" />
                <MetricPill label="Match" value="87" suffix="%" />
                <MetricPill label="Status" value="Ready" />
              </div>
            </div>

            <div className="grid gap-px bg-white/[0.07] md:grid-cols-3">
              <PreviewCard
                eyebrow="Profile intelligence"
                title="Know what is holding you back"
                description="Get recruiter feedback, ATS scoring, missing keywords and clear priorities."
                icon={<AnalysisIcon />}
              />

              <PreviewCard
                eyebrow="Opportunity intelligence"
                title="Target roles that fit"
                description="Compare relevant career directions and understand why each role matches your profile."
                icon={<BriefcaseIcon />}
              />

              <PreviewCard
                eyebrow="Application intelligence"
                title="Build a stronger application"
                description="Create a targeted resume, cover letter and interview preparation for the role."
                icon={<DocumentIcon />}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold text-white">
              Your next application should not be another guess.
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              Upload your resume and get a clear action plan in minutes.
            </p>
          </div>

          <a
            href="#resume-analyzer"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#090909]"
          >
            Start with a free analysis
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function InlineTrustItem({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CheckIcon />
      {label}
    </span>
  );
}

function OutcomeCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-left transition duration-200 hover:border-orange-500/20 hover:bg-orange-500/[0.035]">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/[0.07] text-[10px] font-bold text-orange-300">
          {number}
        </span>

        <span className="h-px w-10 bg-gradient-to-r from-orange-500/40 to-transparent" />
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </article>
  );
}

function MetricPill({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="min-w-[82px] rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-3 text-left">
      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-white">
        {value}
        {suffix && (
          <span className="ml-0.5 text-[10px] font-medium text-zinc-600">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function PreviewCard({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="bg-[#0b0b0b] p-5 text-left sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-orange-400">
        {icon}
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </article>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5 text-emerald-400"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopilotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 3 4.8 7v5c0 4.6 2.8 7.6 7.2 9 4.4-1.4 7.2-4.4 7.2-9V7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.5 11 14.5 15.5 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalysisIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 18V9m5 9V5m5 13v-6m4 6V3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M9 6V4h6v2M4 8h16v11H4V8Zm0 4c5 2 11 2 16 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h5M10 17h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}