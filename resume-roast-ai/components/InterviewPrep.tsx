"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Lightbulb,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

interface Props {
  jobDescription: string;
  report: {
    summary?: string;
    experienceHighlights?: string[];
    optimizedSkills?: string[];
  };
}

type Difficulty = "Foundation" | "Intermediate" | "Advanced";
type QuestionCategory =
  | "Introduction"
  | "Behavioral"
  | "Leadership"
  | "Role-specific"
  | "HR and closing";

type InterviewQuestion = {
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  whyItIsAsked: string;
  answerStrategy: string;
  sampleAnswer: string;
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  recruiterScorecard: string[];
  followUpQuestions: string[];
  mistakesToAvoid: string[];
};

type InterviewPack = {
  targetRole: string;
  employerName: string;
  interviewReadinessScore: number;
  readinessSummary: string;
  strongestThemes: string[];
  preparationGaps: string[];
  openingPitch: string;
  questions: InterviewQuestion[];
  questionsToAsk: string[];
  salaryAnswer: string;
  finalTips: string[];
};

const categoryOrder: QuestionCategory[] = [
  "Introduction",
  "Behavioral",
  "Leadership",
  "Role-specific",
  "HR and closing",
];

export default function InterviewPrep({
  jobDescription,
  report,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState<InterviewPack | null>(null);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<QuestionCategory>("Introduction");
  const [expandedQuestion, setExpandedQuestion] =
    useState<number | null>(0);
  const [message, setMessage] = useState("");

  const visibleQuestions = useMemo(() => {
    if (!pack) return [];

    return pack.questions.filter(
      (question) => question.category === activeCategory
    );
  }, [activeCategory, pack]);

  async function generateInterview() {
    if (jobDescription.trim().length < 100) {
      setError(
        "Add a complete job description of at least 100 characters."
      );
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          resumeSummary: report?.summary,
          resumeBullets: report?.experienceHighlights || [],
          skills: report?.optimizedSkills || [],
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setError(
          data.message ||
            "The interview preparation could not be generated."
        );
        return;
      }

      setPack(data as InterviewPack);
      setActiveCategory("Introduction");
      setExpandedQuestion(0);
      setMessage("Your role-specific interview pack is ready.");
    } catch (requestError) {
      console.error("Interview preparation error:", requestError);
      setError(
        "Something went wrong while generating interview preparation."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyText(
    text: string,
    successMessage: string
  ) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(successMessage);
    } catch {
      setMessage("Unable to copy. Please try again.");
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] shadow-2xl">
      <header className="border-b border-white/10 bg-[#101010] p-5 md:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                Interview Copilot
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Role-specific interview preparation
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              Prepare truthful STAR answers, understand what recruiters
              evaluate and practise realistic follow-up questions for the
              target role.
            </p>
          </div>

          <button
            type="button"
            onClick={generateInterview}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner />
                Building interview pack
              </>
            ) : pack ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate pack
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate interview pack
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-5 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {message && !error && (
          <div className="mt-5 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </div>
        )}
      </header>

      {loading && <InterviewLoading />}

      {!pack && !loading && (
        <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#101010] text-orange-400">
            <MessageSquareText className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white">
            Build your premium interview pack
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            The pack will include 15 tailored questions, spoken sample
            answers, STAR coaching, recruiter scorecards, follow-ups,
            salary guidance and intelligent questions to ask.
          </p>
        </div>
      )}

      {pack && !loading && (
        <div className="p-4 md:p-6">
          <InterviewOverview pack={pack} />

          <section className="mt-5 rounded-2xl border border-white/10 bg-[#101010] p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
                  60–90 second introduction
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  Your opening pitch
                </h3>
              </div>

              <CopyButton
                onClick={() =>
                  copyText(pack.openingPitch, "Opening pitch copied.")
                }
              />
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">
              {pack.openingPitch}
            </p>
          </section>

          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {categoryOrder.map((category) => {
                const count = pack.questions.filter(
                  (question) => question.category === category
                ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setExpandedQuestion(0);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      activeCategory === category
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                        : "border-white/10 bg-black/20 text-zinc-500 hover:text-white"
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-60">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {visibleQuestions.map((question, index) => (
              <QuestionCard
                key={`${question.question}-${index}`}
                question={question}
                number={index + 1}
                expanded={expandedQuestion === index}
                onToggle={() =>
                  setExpandedQuestion(
                    expandedQuestion === index ? null : index
                  )
                }
                onCopy={() =>
                  copyText(
                    question.sampleAnswer,
                    "Sample answer copied."
                  )
                }
              />
            ))}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <TextPanel
              eyebrow="Salary conversation"
              title="Professional salary response"
              text={pack.salaryAnswer}
              onCopy={() =>
                copyText(pack.salaryAnswer, "Salary response copied.")
              }
            />

            <ListPanel
              eyebrow="Close strongly"
              title="Questions to ask the interviewer"
              items={pack.questionsToAsk}
            />
          </div>

          <div className="mt-5">
            <ListPanel
              eyebrow="Final preparation"
              title="Interview-day checklist"
              items={pack.finalTips}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function InterviewOverview({ pack }: { pack: InterviewPack }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Readiness"
          value={`${pack.interviewReadinessScore}%`}
          description="Evidence-based preparation score"
        />

        <MetricCard
          icon={<Target className="h-4 w-4" />}
          label="Target role"
          value={pack.targetRole || "Target role"}
          description={pack.employerName || "Employer not identified"}
        />

        <MetricCard
          icon={<MessageSquareText className="h-4 w-4" />}
          label="Questions"
          value={`${pack.questions.length}`}
          description="Tailored practice questions"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#101010] p-5">
        <p className="text-sm leading-7 text-zinc-400">
          {pack.readinessSummary}
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ThemeList
            title="Strongest interview themes"
            items={pack.strongestThemes}
            tone="positive"
          />

          <ThemeList
            title="Preparation priorities"
            items={pack.preparationGaps}
            tone="warning"
          />
        </div>
      </div>
    </>
  );
}

function QuestionCard({
  question,
  number,
  expanded,
  onToggle,
  onCopy,
}: {
  question: InterviewQuestion;
  number: number;
  expanded: boolean;
  onToggle: () => void;
  onCopy: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-5 p-5 text-left"
      >
        <div className="flex min-w-0 gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-black">
            {number}
          </span>

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge label={question.category} />
              <DifficultyBadge difficulty={question.difficulty} />
            </div>

            <h3 className="mt-3 text-base font-semibold leading-7 text-white">
              {question.question}
            </h3>

            <p className="mt-2 text-xs leading-5 text-zinc-600">
              {question.whyItIsAsked}
            </p>
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-5">
          <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.05] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-300">
              Answer strategy
            </p>

            <p className="mt-2 text-sm leading-7 text-zinc-300">
              {question.answerStrategy}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Interview-ready sample answer
              </p>

              <CopyButton onClick={onCopy} />
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-300">
              {question.sampleAnswer}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              STAR answer map
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <StarCard
                letter="S"
                label="Situation"
                text={question.starFramework.situation}
              />
              <StarCard
                letter="T"
                label="Task"
                text={question.starFramework.task}
              />
              <StarCard
                letter="A"
                label="Action"
                text={question.starFramework.action}
              />
              <StarCard
                letter="R"
                label="Result"
                text={question.starFramework.result}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <CompactList
              title="Recruiter scorecard"
              icon={<Users className="h-4 w-4" />}
              items={question.recruiterScorecard}
            />

            <CompactList
              title="Likely follow-ups"
              icon={<MessageSquareText className="h-4 w-4" />}
              items={question.followUpQuestions}
            />

            <CompactList
              title="Mistakes to avoid"
              icon={<AlertTriangle className="h-4 w-4" />}
              items={question.mistakesToAvoid}
            />
          </div>
        </div>
      )}
    </article>
  );
}

function InterviewLoading() {
  const steps = [
    "Analysing the role and hiring criteria",
    "Matching verified resume evidence",
    "Building STAR-based sample answers",
    "Creating recruiter follow-ups and scorecards",
  ];

  return (
    <div className="p-5 md:p-6">
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-5">
        <div className="flex items-center gap-3">
          <Spinner />
          <div>
            <p className="text-sm font-semibold text-white">
              Building your interview preparation pack
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              This can take a few moments because every answer is tailored
              and reviewed.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  index === 0
                    ? "animate-pulse bg-orange-400"
                    : "bg-zinc-800"
                }`}
              />
              <span className="text-xs text-zinc-500">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
      <div className="text-orange-400">{icon}</div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-lg font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-600">{description}</p>
    </div>
  );
}

function ThemeList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "warning";
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              tone === "positive"
                ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300"
                : "border-orange-500/20 bg-orange-500/[0.06] text-orange-300"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function StarCard({
  letter,
  label,
  text,
}: {
  letter: string;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-black">
          {letter}
        </span>
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>

      <p className="mt-3 text-xs leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

function CompactList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-orange-400">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.13em]">
          {title}
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-xs leading-5 text-zinc-500"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextPanel({
  eyebrow,
  title,
  text,
  onCopy,
}: {
  eyebrow: string;
  title: string;
  text: string;
  onCopy: () => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        </div>

        <CopyButton onClick={onCopy} />
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
        {text}
      </p>
    </section>
  );
}

function ListPanel({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-sm leading-6 text-zinc-400"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/[0.07] text-[10px] font-semibold text-orange-300">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CopyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 text-xs font-medium text-zinc-400 transition hover:text-white"
    >
      <Clipboard className="h-3.5 w-3.5" />
      Copy
    </button>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-500">
      {label}
    </span>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const classes = {
    Foundation:
      "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300",
    Intermediate:
      "border-orange-500/20 bg-orange-500/[0.06] text-orange-300",
    Advanced:
      "border-red-500/20 bg-red-500/[0.06] text-red-300",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] ${classes[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}