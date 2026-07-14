type Props = {
  score: number;
  keywordCount: number;
};

export default function ATSDashboard({
  score,
  keywordCount,
}: Props) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  const status =
    safeScore >= 85
      ? "Application ready"
      : safeScore >= 70
      ? "Strong foundation"
      : safeScore >= 55
      ? "Needs refinement"
      : "Major improvements needed";

  const statusDescription =
    safeScore >= 85
      ? "Your resume is strongly aligned with the target role."
      : safeScore >= 70
      ? "A few targeted improvements can strengthen your application."
      : safeScore >= 55
      ? "Improve the highlighted sections before applying."
      : "Review your structure, keywords and experience positioning.";

  return (
    <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#101010]">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Application health
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
            Targeted resume overview
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 md:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Analysis complete
        </div>
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-[1.1fr_1fr_1fr]">
        <ScorePanel score={safeScore} />

        <MetricPanel
          label="Relevant keywords"
          value={String(keywordCount)}
          description="Skills aligned with the target role"
          icon={<KeywordIcon />}
        />

        <MetricPanel
          label="Resume status"
          value={status}
          description={statusDescription}
          icon={<StatusIcon />}
          compactValue
        />
      </div>
    </section>
  );
}

function ScorePanel({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  const scoreLabel =
    score >= 85
      ? "Excellent"
      : score >= 70
      ? "Strong"
      : score >= 55
      ? "Developing"
      : "Needs work";

  return (
    <div className="bg-[#101010] p-6">
      <div className="flex items-center gap-5">
        <div className="relative h-[86px] w-[86px] shrink-0">
          <svg
            viewBox="0 0 80 80"
            className="h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#27272a"
              strokeWidth="6"
            />

            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#f97316"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {score}
            </span>

            <span className="text-[9px] uppercase tracking-wide text-zinc-600">
              score
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-500">
            ATS match
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {scoreLabel}
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Estimated alignment with the selected job description.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricPanel({
  label,
  value,
  description,
  icon,
  compactValue = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  compactValue?: boolean;
}) {
  return (
    <div className="bg-[#101010] p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-medium text-zinc-500">
          {label}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-zinc-500">
          {icon}
        </span>
      </div>

      <p
        className={`mt-6 font-semibold text-white ${
          compactValue
            ? "max-w-[220px] text-lg leading-7"
            : "text-4xl tracking-tight"
        }`}
      >
        {value}
      </p>

      <p className="mt-3 max-w-[240px] text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function KeywordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M10 4H4v6l9.5 9.5a2 2 0 0 0 2.8 0l3.2-3.2a2 2 0 0 0 0-2.8L10 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle
        cx="7.5"
        cy="7.5"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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