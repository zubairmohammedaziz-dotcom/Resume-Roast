export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] px-6 py-20 shadow-2xl md:px-12 md:py-28">
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-orange-400" />

          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            AI-powered career workspace
          </span>
        </div>

        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-7xl">
          Turn your resume into
          <span className="block text-orange-400">
            a stronger application.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
          Analyze your resume, discover relevant roles, tailor your application
          and prepare for interviews from one focused workspace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#resume-analyzer"
            className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            Analyze my resume
            <ArrowRightIcon />
          </a>

          <a
            href="#features"
            className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Explore features
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          <TrustItem
            title="ATS analysis"
            description="Identify gaps before applying"
          />

          <TrustItem
            title="Targeted resume"
            description="Tailored to the role"
          />

          <TrustItem
            title="Application toolkit"
            description="Cover letter and interview prep"
          />
        </div>

        <div className="mx-auto mt-16 max-w-5xl rounded-[1.75rem] border border-white/10 bg-[#101010] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 md:p-7">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                  Resume analysis
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Know what recruiters see
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <MetricPill label="ATS score" value="92%" />
                <MetricPill label="Keywords" value="18" />
                <MetricPill label="Status" value="Ready" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <PreviewCard
                title="Analysis"
                description="Scores, strengths and priority improvements."
              />

              <PreviewCard
                title="Job matches"
                description="Relevant roles based on your actual profile."
              />

              <PreviewCard
                title="Tailored resume"
                description="A targeted application ready to download."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
      <div className="flex items-center gap-2">
        <CheckIcon />
        <p className="text-sm font-medium text-white">{title}</p>
      </div>

      <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function PreviewCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 text-left">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
        <DocumentIcon />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-emerald-400"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.8"
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