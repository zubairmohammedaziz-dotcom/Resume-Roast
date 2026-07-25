"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Flag,
  Layers3,
  ListChecks,
  IndianRupee,
  Lightbulb,
  MapPin,
  Radio,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

import type { JobMatch } from "../types/report";

type LiveJobMatch = JobMatch & {
  url?: string;
  source?: string;
  postedAt?: string;
  employmentType?: string;
  isLive?: boolean;
  description?: string;
  seniority?: string;
  searchLinks?: {
    linkedin?: string;
    indeed?: string;
    naukri?: string;
    foundit?: string;
  };
};

type Props = {
  jobs: JobMatch[];
};

type Platform = {
  name: string;
  url: string;
};

type SortMode = "best" | "fresh" | "fewest-gaps" | "salary";
type FilterMode = "all" | "live" | "saved" | "remote" | "pipeline";
type PipelineStage = "interested" | "preparing" | "applied" | "interview" | "offer";
type PipelineMap = Record<string, PipelineStage>;

type OpportunityIntelligence = {
  match: number;
  readiness: number;
  skillCoverage: number;
  gapRisk: "Low" | "Medium" | "High";
  verdict: "Apply now" | "Tailor first" | "Review carefully";
  fitLabel: "Excellent" | "Strong" | "Promising" | "Exploratory";
  freshnessScore: number;
  freshnessLabel: string;
  recruiterNote: string;
  nextAction: string;
  preparationMinutes: number;
  seniority: string;
};

const MAX_COMPARE_JOBS = 3;
const PIPELINE_STORAGE_KEY = "offernhire_job_pipeline";

export default function JobMatches({ jobs }: Props) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [openSearchMenu, setOpenSearchMenu] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<LiveJobMatch | null>(null);
  const [compareJobs, setCompareJobs] = useState<LiveJobMatch[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pipeline, setPipeline] = useState<PipelineMap>({});
  const menuAreaRef = useRef<HTMLDivElement | null>(null);

  const normalizedJobs = useMemo(
    () => ((jobs || []) as LiveJobMatch[]).filter(isLiveJobMatch),
    [jobs]
  );

  const visibleJobs = useMemo(() => {
    const filtered = normalizedJobs.filter((job) => {
      const key = getJobKey(job);
      const searchableText = `${job.role || ""} ${job.company || ""} ${job.location || ""} ${(job.whyMatched || []).join(" ")} ${(job.missingSkills || []).join(" ")}`.toLowerCase();
      const locationText = `${job.location || ""} ${job.employmentType || ""}`.toLowerCase();

      if (searchQuery.trim() && !searchableText.includes(searchQuery.trim().toLowerCase())) {
        return false;
      }

      if (filterMode === "live") {
        return Boolean(job.isLive && isSafeExternalUrl(job.url));
      }

      if (filterMode === "saved") {
        return savedJobs.includes(key);
      }

      if (filterMode === "remote") {
        return locationText.includes("remote") || locationText.includes("hybrid");
      }

      if (filterMode === "pipeline") {
        return Boolean(pipeline[key]);
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "fresh") {
        return getPostedTimestamp(b.postedAt) - getPostedTimestamp(a.postedAt);
      }

      if (sortMode === "fewest-gaps") {
        return (a.missingSkills?.length || 0) - (b.missingSkills?.length || 0);
      }

      if (sortMode === "salary") {
        return getSalarySortValue(b.salary) - getSalarySortValue(a.salary);
      }

      return Number(b.match || 0) - Number(a.match || 0);
    });
  }, [filterMode, normalizedJobs, pipeline, savedJobs, searchQuery, sortMode]);

  const liveJobCount = useMemo(
    () =>
      normalizedJobs.filter((job) => Boolean(job.isLive && isSafeExternalUrl(job.url)))
        .length,
    [normalizedJobs]
  );

  const topMatch = useMemo(
    () => Math.max(0, ...normalizedJobs.map((job) => Math.round(job.match || 0))),
    [normalizedJobs]
  );

  const priorityJobs = useMemo(
    () =>
      [...normalizedJobs]
        .sort((a, b) => {
          const aScore = getOpportunityIntelligence(a).readiness + Number(a.match || 0);
          const bScore = getOpportunityIntelligence(b).readiness + Number(b.match || 0);
          return bScore - aScore;
        })
        .slice(0, 3),
    [normalizedJobs]
  );

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem("savedJobs");
      const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
      const storedJobs = Array.isArray(parsedValue)
        ? parsedValue.filter(isLiveJobMatch)
        : [];

      setSavedJobs(storedJobs.map(getJobKey));
    } catch {
      setSavedJobs([]);
    }
  }, []);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(PIPELINE_STORAGE_KEY);
      const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : {};

      if (parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)) {
        setPipeline(parsedValue as PipelineMap);
      }
    } catch {
      setPipeline({});
    }
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setMessage(""), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!openSearchMenu) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        menuAreaRef.current &&
        !menuAreaRef.current.contains(event.target as Node)
      ) {
        setOpenSearchMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenSearchMenu(null);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openSearchMenu]);

  useEffect(() => {
    if (!selectedJob && !compareOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSelectedJob(null);
      setCompareOpen(false);
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [compareOpen, selectedJob]);

  if (normalizedJobs.length === 0) return null;

  function handleTailor(job: LiveJobMatch) {
    window.dispatchEvent(
      new CustomEvent("tailor-job", {
        detail: buildTailoringBrief(job),
      })
    );

    setSelectedJob(null);
    setMessage(`${job.role} at ${job.company} is ready in your application workspace.`);
  }

  function handleSave(job: LiveJobMatch) {
    try {
      const key = getJobKey(job);
      const storedValue = window.localStorage.getItem("savedJobs");
      const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
      const storedJobs = Array.isArray(parsedValue)
        ? parsedValue.filter(isLiveJobMatch)
        : [];
      const alreadySaved = storedJobs.some((item) => getJobKey(item) === key);

      if (alreadySaved) {
        const updated = storedJobs.filter((item) => getJobKey(item) !== key);
        window.localStorage.setItem("savedJobs", JSON.stringify(updated));
        setSavedJobs((current) => current.filter((item) => item !== key));
        setMessage("Opportunity removed from your saved jobs.");
        return;
      }

      window.localStorage.setItem("savedJobs", JSON.stringify([...storedJobs, job]));
      setSavedJobs((current) => [...current, key]);
      setMessage("Opportunity saved to your career pipeline.");
    } catch {
      setMessage("Unable to update this opportunity.");
    }
  }

  function updatePipeline(job: LiveJobMatch, stage: PipelineStage) {
    const key = getJobKey(job);
    const updated = { ...pipeline, [key]: stage };

    setPipeline(updated);

    try {
      window.localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(updated));
      setMessage(`${job.role} moved to ${formatPipelineStage(stage)}.`);
    } catch {
      setMessage("Unable to update your career pipeline.");
    }
  }

  function toggleCompare(job: LiveJobMatch) {
    const key = getJobKey(job);
    const alreadySelected = compareJobs.some((item) => getJobKey(item) === key);

    if (alreadySelected) {
      setCompareJobs((current) => current.filter((item) => getJobKey(item) !== key));
      return;
    }

    if (compareJobs.length >= MAX_COMPARE_JOBS) {
      setMessage("You can compare up to three opportunities at a time.");
      return;
    }

    setCompareJobs((current) => [...current, job]);
  }

  return (
    <section className="mt-8" aria-labelledby="opportunity-hub-title">
      <header className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0d0d0d] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="grid gap-7 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                OffernHire Opportunity Intelligence
              </p>
            </div>

            <h2
              id="opportunity-hub-title"
              className="mt-4 max-w-3xl text-2xl font-semibold tracking-[-0.035em] text-white md:text-4xl"
            >
              Know which opportunity deserves your time first.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500 sm:text-base">
              Every role is ranked using your profile fit, supported skill evidence,
              application readiness, freshness and risk—so you can prepare before you apply.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SummaryMetric label="Jobs ranked" value={`${normalizedJobs.length}`} />
            <SummaryMetric label="Live links" value={`${liveJobCount}`} />
            <SummaryMetric label="Top match" value={`${topMatch}%`} />
          </div>
        </div>

        <div className="border-t border-white/[0.07] bg-black/20 px-5 py-3 sm:px-6 lg:px-8">
          <p className="flex gap-2 text-xs leading-5 text-zinc-600">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
            Scores are explainable guidance based on the information available in your resume
            and the listing—not a promise of interview or selection.
          </p>
        </div>
      </header>

      <section className="mt-5 rounded-[1.5rem] border border-white/[0.08] bg-[#0b0b0b] p-4 sm:p-5" aria-label="Priority opportunities">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-orange-400">
              <ListChecks className="h-4 w-4" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">Your priority queue</p>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">Start with these opportunities</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-600">Ranked by profile match and application readiness—not merely listing order.</p>
          </div>
          <span className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">Decision support</span>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {priorityJobs.map((job, index) => {
            const intelligence = getOpportunityIntelligence(job);
            return (
              <button
                key={`priority-${getJobKey(job)}`}
                type="button"
                onClick={() => setSelectedJob(job)}
                className="group rounded-2xl border border-white/[0.08] bg-[#101010] p-4 text-left transition hover:border-orange-500/30 hover:bg-orange-500/[0.035]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.07] text-xs font-bold text-orange-300">{index + 1}</span>
                  <span className="text-xs font-semibold text-emerald-300">{intelligence.readiness}% ready</span>
                </div>
                <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-600">{job.company}</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">{job.role}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-zinc-600">{intelligence.verdict}</span>
                  <ArrowRight className="h-4 w-4 text-orange-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <CareerCommandCenter
        jobs={normalizedJobs}
        pipeline={pipeline}
        savedJobs={savedJobs}
        onSelectJob={setSelectedJob}
        onTailor={handleTailor}
        onPipelineChange={updatePipeline}
      />

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700" />
            <span className="sr-only">Search opportunities</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search role, company, city or skill"
              className="min-h-11 w-full rounded-xl border border-white/[0.09] bg-[#111] pl-10 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-500/40"
            />
          </label>

          <div className="flex flex-wrap gap-2" aria-label="Opportunity filters">
          <FilterButton active={filterMode === "all"} onClick={() => setFilterMode("all")}>All</FilterButton>
          <FilterButton active={filterMode === "live"} onClick={() => setFilterMode("live")}>Live</FilterButton>
          <FilterButton active={filterMode === "remote"} onClick={() => setFilterMode("remote")}>Remote / Hybrid</FilterButton>
          <FilterButton active={filterMode === "saved"} onClick={() => setFilterMode("saved")}>Saved</FilterButton>
          <FilterButton active={filterMode === "pipeline"} onClick={() => setFilterMode("pipeline")}>Pipeline</FilterButton>
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-600">
          <Filter className="h-3.5 w-3.5" />
          <span className="sr-only">Sort opportunities</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="min-h-10 rounded-xl border border-white/[0.09] bg-[#111] px-3 text-sm text-zinc-300 outline-none transition focus:border-orange-500/40"
          >
            <option value="best">Best profile match</option>
            <option value="fresh">Recently posted</option>
            <option value="fewest-gaps">Fewest skill gaps</option>
            <option value="salary">Highest salary signal</option>
          </select>
        </label>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300"
        >
          <Check className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      {visibleJobs.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/[0.1] bg-[#0b0b0b] p-8 text-center">
          <Search className="mx-auto h-6 w-6 text-zinc-700" />
          <p className="mt-3 text-sm font-semibold text-zinc-300">No opportunities match this filter.</p>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className="mt-4 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            Show all opportunities
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {visibleJobs.map((job, index) => {
            const key = getJobKey(job);
            const intelligence = getOpportunityIntelligence(job);
            const isTopMatch = sortMode === "best" && index === 0;
            const saved = savedJobs.includes(key);
            const compared = compareJobs.some((item) => getJobKey(item) === key);
            const platforms = createFallbackSearchLinks(job);
            const searchMenuOpen = openSearchMenu === key;
            const hasDirectApply = isSafeExternalUrl(job.url);
            const postedLabel = formatPostedDate(job.postedAt);

            return (
              <article
                key={`${key}-${index}`}
                className={`relative overflow-hidden rounded-[1.7rem] border bg-[#0b0b0b] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_80px_rgba(0,0,0,0.38)] ${
                  isTopMatch
                    ? "border-orange-500/35 shadow-[0_22px_70px_rgba(249,115,22,0.07)]"
                    : "border-white/[0.08] hover:border-white/[0.16]"
                }`}
              >
                {isTopMatch && (
                  <div className="flex items-center justify-between border-b border-orange-500/15 bg-orange-500/[0.075] px-5 py-2.5 sm:px-6">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                      <Star className="h-3.5 w-3.5" />
                      Best opportunity for your profile
                    </span>
                    <span className="hidden text-[10px] text-orange-300/60 sm:inline">Recommended first</span>
                  </div>
                )}

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
                    <div className="flex min-w-0 gap-4">
                      <CompanyMark company={job.company} />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-600">
                            {job.company || "Employer not listed"}
                          </p>

                          {job.isLive && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-emerald-300">
                              <Radio className="h-2.5 w-2.5" /> Live
                            </span>
                          )}

                          {job.source && (
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-medium text-zinc-500">
                              via {job.source}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
                          {job.role}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <MetadataBadge icon={<MapPin className="h-3.5 w-3.5" />} label={job.location || "India"} />
                          <MetadataBadge icon={<IndianRupee className="h-3.5 w-3.5" />} label={job.salary || "Not disclosed"} />
                          <MetadataBadge
                            icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
                            label={formatEmploymentType(job.employmentType) || job.seniority || intelligence.seniority}
                          />
                          {postedLabel && <MetadataBadge icon={<CalendarDays className="h-3.5 w-3.5" />} label={postedLabel} />}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[500px]">
                      <ScoreTile label="Profile match" value={`${intelligence.match}%`} tone="orange" />
                      <ScoreTile label="Readiness" value={`${intelligence.readiness}%`} tone="green" />
                      <ScoreTile label="Skill coverage" value={`${intelligence.skillCoverage}%`} />
                      <ScoreTile label="Gap risk" value={intelligence.gapRisk} tone={intelligence.gapRisk === "Low" ? "green" : intelligence.gapRisk === "High" ? "red" : "orange"} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">AI recruiter review</p>
                            <p className="mt-0.5 text-[10px] text-zinc-700">Evidence-led assessment, not a hiring guarantee</p>
                          </div>
                        </div>
                        <VerdictBadge verdict={intelligence.verdict} />
                      </div>

                      <p className="mt-4 text-sm leading-6 text-zinc-400">{intelligence.recruiterNote}</p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <MiniMetric label="Opportunity" value={intelligence.fitLabel} />
                        <MiniMetric label="Freshness" value={intelligence.freshnessLabel} />
                        <MiniMetric label="Prep time" value={`~${intelligence.preparationMinutes} min`} />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
                          <TrendingUp className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Best next action</p>
                          <p className="mt-0.5 text-[10px] text-zinc-700">What to do before leaving OffernHire</p>
                        </div>
                      </div>

                      <p className="mt-4 text-base font-semibold leading-6 text-zinc-200">{intelligence.nextAction}</p>

                      <div className="mt-5 space-y-2.5">
                        <ProgressStep complete={intelligence.readiness >= 75} label="Resume aligned" />
                        <ProgressStep complete={false} label="Tailored version prepared" />
                        <ProgressStep complete={false} label="Application reviewed" />
                      </div>
                    </section>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <EvidencePanel title="Why this role fits" subtitle="Signals supported by your resume" items={job.whyMatched || []} positive />
                    <GapPanel skills={job.missingSkills || []} />
                  </div>

                  <section className="mt-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#101010] text-orange-400">
                          <Layers3 className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Career pipeline</p>
                          <p className="mt-0.5 text-[10px] text-zinc-700">Track this opportunity from interest to offer</p>
                        </div>
                      </div>

                      <select
                        value={pipeline[key] || "interested"}
                        onChange={(event) => updatePipeline(job, event.target.value as PipelineStage)}
                        className="min-h-10 rounded-xl border border-white/[0.09] bg-[#111] px-3 text-sm text-zinc-300 outline-none transition focus:border-orange-500/40"
                        aria-label={`Pipeline stage for ${job.role}`}
                      >
                        <option value="interested">Interested</option>
                        <option value="preparing">Preparing</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                      </select>
                    </div>
                  </section>

                  <footer className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 xl:flex-row xl:items-center">
                    <div className="flex max-w-xl items-start gap-2 text-xs leading-5 text-zinc-700">
                      <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <p>Review the original listing before applying because availability, compensation and requirements may change.</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleSave(job)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
                      >
                        <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
                        {saved ? "Saved" : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCompare(job)}
                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                          compared
                            ? "border-orange-500/30 bg-orange-500/[0.08] text-orange-300"
                            : "border-white/[0.09] bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <Scale className="h-4 w-4" />
                        {compared ? "Comparing" : "Compare"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/30 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                        View intelligence
                      </button>

                      {hasDirectApply ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-500/[0.13]"
                        >
                          Apply externally <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <div className="relative" ref={searchMenuOpen ? menuAreaRef : undefined}>
                          <button
                            type="button"
                            aria-expanded={searchMenuOpen}
                            onClick={() => setOpenSearchMenu(searchMenuOpen ? null : key)}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/30 hover:text-white"
                          >
                            <Search className="h-4 w-4" /> Find role <ChevronDown className="h-4 w-4" />
                          </button>
                          {searchMenuOpen && <SearchMenu platforms={platforms} />}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTailor(job)}
                        className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
                      >
                        Prepare application
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {compareJobs.length > 0 && (
        <div className="sticky bottom-4 z-30 mt-5 rounded-2xl border border-orange-500/25 bg-[#101010]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Opportunity comparison</p>
              <p className="mt-1 text-xs text-zinc-600">{compareJobs.length} of {MAX_COMPARE_JOBS} selected</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCompareJobs([])} className="min-h-10 rounded-xl border border-white/[0.09] px-4 text-sm text-zinc-400 hover:text-white">Clear</button>
              <button type="button" onClick={() => setCompareOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-black hover:bg-orange-400">
                <Scale className="h-4 w-4" /> Compare now
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedJob && (
        <JobIntelligenceModal
          job={selectedJob}
          saved={savedJobs.includes(getJobKey(selectedJob))}
          onClose={() => setSelectedJob(null)}
          onSave={() => handleSave(selectedJob)}
          onTailor={() => handleTailor(selectedJob)}
          pipelineStage={pipeline[getJobKey(selectedJob)] || "interested"}
          onPipelineChange={(stage) => updatePipeline(selectedJob, stage)}
        />
      )}

      {compareOpen && (
        <CompareModal jobs={compareJobs} onClose={() => setCompareOpen(false)} onTailor={handleTailor} />
      )}
    </section>
  );
}


type CommandCenterTab = "strategy" | "evidence" | "pipeline" | "interview";
type JobNoteMap = Record<string, string>;
type WeeklyGoal = { applications: number; tailored: number; interviews: number };

const JOB_NOTES_STORAGE_KEY = "offernhire_job_notes";
const WEEKLY_GOAL_STORAGE_KEY = "offernhire_weekly_goal";

function CareerCommandCenter({
  jobs,
  pipeline,
  savedJobs,
  onSelectJob,
  onTailor,
  onPipelineChange,
}: {
  jobs: LiveJobMatch[];
  pipeline: PipelineMap;
  savedJobs: string[];
  onSelectJob: (job: LiveJobMatch) => void;
  onTailor: (job: LiveJobMatch) => void;
  onPipelineChange: (job: LiveJobMatch, stage: PipelineStage) => void;
}) {
  const [activeTab, setActiveTab] = useState<CommandCenterTab>("strategy");
  const [notes, setNotes] = useState<JobNoteMap>({});
  const [activeNoteJob, setActiveNoteJob] = useState<string | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>({ applications: 8, tailored: 5, interviews: 2 });

  useEffect(() => {
    try {
      const storedNotes = window.localStorage.getItem(JOB_NOTES_STORAGE_KEY);
      const parsedNotes: unknown = storedNotes ? JSON.parse(storedNotes) : {};
      if (parsedNotes && typeof parsedNotes === "object" && !Array.isArray(parsedNotes)) {
        setNotes(parsedNotes as JobNoteMap);
      }

      const storedGoal = window.localStorage.getItem(WEEKLY_GOAL_STORAGE_KEY);
      const parsedGoal: unknown = storedGoal ? JSON.parse(storedGoal) : null;
      if (parsedGoal && typeof parsedGoal === "object" && !Array.isArray(parsedGoal)) {
        const value = parsedGoal as Partial<WeeklyGoal>;
        setWeeklyGoal({
          applications: clampGoal(value.applications, 8),
          tailored: clampGoal(value.tailored, 5),
          interviews: clampGoal(value.interviews, 2),
        });
      }
    } catch {
      setNotes({});
    }
  }, []);

  const rankedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        const aIntel = getOpportunityIntelligence(a);
        const bIntel = getOpportunityIntelligence(b);
        return getDecisionScore(b, bIntel) - getDecisionScore(a, aIntel);
      }),
    [jobs]
  );

  const bestJob = rankedJobs[0];
  const safestJob = [...jobs].sort((a, b) => {
    const aIntel = getOpportunityIntelligence(a);
    const bIntel = getOpportunityIntelligence(b);
    return getRiskNumber(aIntel.gapRisk) - getRiskNumber(bIntel.gapRisk) || bIntel.readiness - aIntel.readiness;
  })[0];
  const stretchJob = [...jobs].sort((a, b) => {
    const aIntel = getOpportunityIntelligence(a);
    const bIntel = getOpportunityIntelligence(b);
    return bIntel.match + getRiskNumber(bIntel.gapRisk) * 6 - (aIntel.match + getRiskNumber(aIntel.gapRisk) * 6);
  })[0];

  const pipelineCounts = useMemo(() => {
    const counts: Record<PipelineStage, number> = { interested: 0, preparing: 0, applied: 0, interview: 0, offer: 0 };
    Object.values(pipeline).forEach((stage) => {
      if (stage in counts) counts[stage] += 1;
    });
    return counts;
  }, [pipeline]);

  const readinessAverage = jobs.length
    ? Math.round(jobs.reduce((sum, job) => sum + getOpportunityIntelligence(job).readiness, 0) / jobs.length)
    : 0;
  const strongFitCount = jobs.filter((job) => getOpportunityIntelligence(job).match >= 75).length;
  const lowRiskCount = jobs.filter((job) => getOpportunityIntelligence(job).gapRisk === "Low").length;
  const liveCount = jobs.filter((job) => Boolean(job.isLive && isSafeExternalUrl(job.url))).length;

  function saveNote(jobKey: string, value: string) {
    const updated = { ...notes, [jobKey]: value };
    setNotes(updated);
    try {
      window.localStorage.setItem(JOB_NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Notes remain available for this session when storage is unavailable.
    }
  }

  function updateGoal(field: keyof WeeklyGoal, value: number) {
    const updated = { ...weeklyGoal, [field]: Math.max(0, Math.min(50, value || 0)) };
    setWeeklyGoal(updated);
    try {
      window.localStorage.setItem(WEEKLY_GOAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Goal remains available for this session when storage is unavailable.
    }
  }

  if (!bestJob) return null;

  return (
    <section className="mt-5 overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-[#0b0b0b]" aria-labelledby="career-command-center-title">
      <div className="border-b border-white/[0.08] bg-gradient-to-r from-orange-500/[0.07] via-transparent to-transparent p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-orange-400">
              <Target className="h-4 w-4" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">Career decision command center</p>
            </div>
            <h3 id="career-command-center-title" className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
              Move from job discovery to a confident application decision.
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
              OffernHire converts every listing into an action plan: which role to prioritise, what evidence supports the fit, what could block you and exactly what to prepare next.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <CommandMetric label="Strong fits" value={`${strongFitCount}`} helper="75%+ match" />
            <CommandMetric label="Low risk" value={`${lowRiskCount}`} helper="Few gaps" />
            <CommandMetric label="Avg readiness" value={`${readinessAverage}%`} helper="Portfolio" />
            <CommandMetric label="Live roles" value={`${liveCount}`} helper="Verified links" />
          </div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-white/[0.08] bg-black/20 p-2" aria-label="Career command center views">
        <CommandTab active={activeTab === "strategy"} onClick={() => setActiveTab("strategy")} icon={<Target className="h-4 w-4" />} label="Decision strategy" />
        <CommandTab active={activeTab === "evidence"} onClick={() => setActiveTab("evidence")} icon={<ShieldCheck className="h-4 w-4" />} label="Evidence map" />
        <CommandTab active={activeTab === "pipeline"} onClick={() => setActiveTab("pipeline")} icon={<Layers3 className="h-4 w-4" />} label="Application pipeline" />
        <CommandTab active={activeTab === "interview"} onClick={() => setActiveTab("interview")} icon={<BriefcaseBusiness className="h-4 w-4" />} label="Interview advantage" />
      </nav>

      <div className="p-4 sm:p-5 lg:p-6">
        {activeTab === "strategy" && (
          <DecisionStrategyView
            bestJob={bestJob}
            safestJob={safestJob}
            stretchJob={stretchJob}
            rankedJobs={rankedJobs}
            savedJobs={savedJobs}
            onSelectJob={onSelectJob}
            onTailor={onTailor}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceMapView jobs={rankedJobs} onSelectJob={onSelectJob} onTailor={onTailor} />
        )}

        {activeTab === "pipeline" && (
          <PipelineCommandView
            jobs={rankedJobs}
            pipeline={pipeline}
            counts={pipelineCounts}
            weeklyGoal={weeklyGoal}
            notes={notes}
            activeNoteJob={activeNoteJob}
            onActiveNoteJob={setActiveNoteJob}
            onSaveNote={saveNote}
            onGoalChange={updateGoal}
            onPipelineChange={onPipelineChange}
            onSelectJob={onSelectJob}
          />
        )}

        {activeTab === "interview" && (
          <InterviewAdvantageView jobs={rankedJobs} onSelectJob={onSelectJob} onTailor={onTailor} />
        )}
      </div>
    </section>
  );
}

function DecisionStrategyView({
  bestJob,
  safestJob,
  stretchJob,
  rankedJobs,
  savedJobs,
  onSelectJob,
  onTailor,
}: {
  bestJob: LiveJobMatch;
  safestJob?: LiveJobMatch;
  stretchJob?: LiveJobMatch;
  rankedJobs: LiveJobMatch[];
  savedJobs: string[];
  onSelectJob: (job: LiveJobMatch) => void;
  onTailor: (job: LiveJobMatch) => void;
}) {
  const bestIntel = getOpportunityIntelligence(bestJob);
  const actions = buildSeventyTwoHourPlan(bestJob);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.035] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-300">
                <Star className="h-3.5 w-3.5" /> Best decision right now
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">{bestJob.company}</p>
              <h4 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{bestJob.role}</h4>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{bestIntel.recruiterNote}</p>
            </div>
            <DecisionGauge score={getDecisionScore(bestJob, bestIntel)} label="Decision score" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DecisionSignal label="Profile fit" value={`${bestIntel.match}%`} interpretation={bestIntel.fitLabel} />
            <DecisionSignal label="Application ready" value={`${bestIntel.readiness}%`} interpretation={bestIntel.verdict} />
            <DecisionSignal label="Skill evidence" value={`${bestIntel.skillCoverage}%`} interpretation="Resume-backed" />
            <DecisionSignal label="Risk exposure" value={bestIntel.gapRisk} interpretation={getRiskAdvice(bestIntel.gapRisk)} />
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => onTailor(bestJob)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-black transition hover:bg-orange-400">
              Prepare this application <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onSelectJob(bestJob)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-5 text-sm font-semibold text-zinc-300 transition hover:border-orange-500/30 hover:text-white">
              Open decision blueprint <Eye className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400"><Clock3 className="h-4 w-4" /></span>
            <div>
              <h4 className="text-sm font-semibold text-white">72-hour application plan</h4>
              <p className="mt-0.5 text-[10px] text-zinc-700">A focused sequence, not generic advice</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {actions.map((action, index) => (
              <div key={action.title} className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111] text-[10px] font-bold text-orange-300">{index + 1}</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-200">{action.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-600">{action.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StrategyCard title="Best overall" subtitle="Highest combined fit and readiness" job={bestJob} badge="Priority 1" onSelect={onSelectJob} />
        {safestJob && <StrategyCard title="Safest application" subtitle="Lowest gap exposure" job={safestJob} badge="Low risk" onSelect={onSelectJob} />}
        {stretchJob && <StrategyCard title="High-upside stretch" subtitle="Worth pursuing with targeted preparation" job={stretchJob} badge="Growth move" onSelect={onSelectJob} />}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h4 className="text-sm font-semibold text-white">Opportunity leaderboard</h4>
            <p className="mt-1 text-xs text-zinc-600">A transparent ranking using fit, readiness, freshness and gap exposure.</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">{savedJobs.length} saved</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[760px] space-y-2">
            {rankedJobs.slice(0, 6).map((job, index) => {
              const intel = getOpportunityIntelligence(job);
              const score = getDecisionScore(job, intel);
              return (
                <button key={`leader-${getJobKey(job)}`} type="button" onClick={() => onSelectJob(job)} className="grid w-full grid-cols-[42px_1.5fr_0.7fr_0.7fr_0.7fr_90px] items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-3 text-left transition hover:border-orange-500/25 hover:bg-orange-500/[0.025]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-xs font-bold text-zinc-500">{index + 1}</span>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{job.role}</p><p className="mt-0.5 truncate text-[10px] text-zinc-700">{job.company}</p></div>
                  <LeaderboardValue label="Match" value={`${intel.match}%`} />
                  <LeaderboardValue label="Ready" value={`${intel.readiness}%`} />
                  <LeaderboardValue label="Risk" value={intel.gapRisk} />
                  <span className="rounded-lg border border-orange-500/20 bg-orange-500/[0.06] px-3 py-2 text-center text-sm font-bold text-orange-300">{score}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function EvidenceMapView({ jobs, onSelectJob, onTailor }: { jobs: LiveJobMatch[]; onSelectJob: (job: LiveJobMatch) => void; onTailor: (job: LiveJobMatch) => void }) {
  const skillRows = buildSkillEvidenceRows(jobs);
  const strongestSkills = skillRows.filter((row) => row.coverage >= 65).slice(0, 6);
  const riskSkills = skillRows.filter((row) => row.gapCount > 0).sort((a, b) => b.gapCount - a.gapCount).slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
          <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-400" /><div><h4 className="text-sm font-semibold text-white">Resume-to-market evidence map</h4><p className="mt-1 text-xs text-zinc-600">See which strengths repeatedly support your applications.</p></div></div>
          <div className="mt-5 space-y-4">
            {strongestSkills.length ? strongestSkills.map((row) => <SkillEvidenceBar key={`strong-${row.skill}`} row={row} positive />) : <EmptyInsight label="Not enough repeated skill evidence yet." />}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
          <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-orange-400" /><div><h4 className="text-sm font-semibold text-white">Market gap concentration</h4><p className="mt-1 text-xs text-zinc-600">Skills blocking the largest number of relevant roles.</p></div></div>
          <div className="mt-5 space-y-4">
            {riskSkills.length ? riskSkills.map((row) => <SkillEvidenceBar key={`risk-${row.skill}`} row={row} />) : <EmptyInsight label="No recurring skill gaps detected across these roles." />}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h4 className="text-sm font-semibold text-white">Role-by-role evidence heatmap</h4><p className="mt-1 text-xs text-zinc-600">Green signals are supported; orange signals need positioning or proof.</p></div><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">Explainable matching</span></div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {jobs.slice(0, 8).map((job) => {
            const intel = getOpportunityIntelligence(job);
            const strengths = (job.whyMatched || []).slice(0, 4);
            const gaps = (job.missingSkills || []).slice(0, 4);
            return (
              <article key={`heat-${getJobKey(job)}`} className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">{job.company}</p><h5 className="mt-1 truncate text-sm font-semibold text-white">{job.role}</h5></div><span className="rounded-lg border border-white/[0.08] px-2 py-1 text-xs font-semibold text-zinc-400">{intel.skillCoverage}%</span></div>
                <div className="mt-4 grid grid-cols-8 gap-1" aria-label={`${job.role} evidence heatmap`}>
                  {Array.from({ length: 8 }).map((_, index) => {
                    const supported = index < Math.min(8, Math.round(intel.skillCoverage / 12.5));
                    return <span key={index} className={`h-2 rounded-full ${supported ? "bg-emerald-500/70" : "bg-orange-500/35"}`} />;
                  })}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2"><EvidenceMiniList title="Supported" items={strengths} positive /><EvidenceMiniList title="Needs proof" items={gaps} /></div>
                <div className="mt-4 flex gap-2"><button type="button" onClick={() => onSelectJob(job)} className="min-h-9 flex-1 rounded-lg border border-white/[0.09] text-xs font-semibold text-zinc-400 hover:text-white">Inspect</button><button type="button" onClick={() => onTailor(job)} className="min-h-9 flex-1 rounded-lg bg-orange-500 text-xs font-bold text-black hover:bg-orange-400">Fix gaps</button></div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PipelineCommandView({ jobs, pipeline, counts, weeklyGoal, notes, activeNoteJob, onActiveNoteJob, onSaveNote, onGoalChange, onPipelineChange, onSelectJob }: {
  jobs: LiveJobMatch[];
  pipeline: PipelineMap;
  counts: Record<PipelineStage, number>;
  weeklyGoal: WeeklyGoal;
  notes: JobNoteMap;
  activeNoteJob: string | null;
  onActiveNoteJob: (key: string | null) => void;
  onSaveNote: (key: string, value: string) => void;
  onGoalChange: (field: keyof WeeklyGoal, value: number) => void;
  onPipelineChange: (job: LiveJobMatch, stage: PipelineStage) => void;
  onSelectJob: (job: LiveJobMatch) => void;
}) {
  const appliedProgress = Math.min(100, Math.round((counts.applied / Math.max(1, weeklyGoal.applications)) * 100));
  const preparingProgress = Math.min(100, Math.round((counts.preparing / Math.max(1, weeklyGoal.tailored)) * 100));
  const interviewProgress = Math.min(100, Math.round((counts.interview / Math.max(1, weeklyGoal.interviews)) * 100));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
          <h4 className="text-sm font-semibold text-white">Weekly application operating plan</h4>
          <p className="mt-1 text-xs leading-5 text-zinc-600">Set deliberate targets instead of mass-applying without preparation.</p>
          <div className="mt-5 space-y-4">
            <GoalControl label="Quality applications" value={weeklyGoal.applications} onChange={(value) => onGoalChange("applications", value)} progress={appliedProgress} current={counts.applied} />
            <GoalControl label="Tailored applications" value={weeklyGoal.tailored} onChange={(value) => onGoalChange("tailored", value)} progress={preparingProgress} current={counts.preparing} />
            <GoalControl label="Interview outcomes" value={weeklyGoal.interviews} onChange={(value) => onGoalChange("interviews", value)} progress={interviewProgress} current={counts.interview} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h4 className="text-sm font-semibold text-white">Pipeline health</h4><p className="mt-1 text-xs text-zinc-600">Track movement and identify where applications are getting stuck.</p></div><span className="text-xs font-semibold text-orange-300">{Object.keys(pipeline).length} tracked roles</span></div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(["interested", "preparing", "applied", "interview", "offer"] as PipelineStage[]).map((stage) => <PipelineCountTile key={stage} stage={stage} value={counts[stage]} />)}
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <p className="text-xs font-semibold text-zinc-300">Pipeline diagnosis</p>
            <p className="mt-2 text-xs leading-5 text-zinc-600">{buildPipelineDiagnosis(counts)}</p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h4 className="text-sm font-semibold text-white">Application workspace</h4><p className="mt-1 text-xs text-zinc-600">Move roles through the pipeline and keep private preparation notes.</p></div><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">Stored on this device</span></div>
        <div className="mt-5 space-y-3">
          {jobs.slice(0, 10).map((job) => {
            const key = getJobKey(job);
            const stage = pipeline[key] || "interested";
            const noteOpen = activeNoteJob === key;
            return (
              <article key={`pipeline-${key}`} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <button type="button" onClick={() => onSelectJob(job)} className="min-w-0 text-left"><p className="truncate text-sm font-semibold text-white hover:text-orange-300">{job.role}</p><p className="mt-1 truncate text-xs text-zinc-700">{job.company} · {job.location || "India"}</p></button>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select value={stage} onChange={(event) => onPipelineChange(job, event.target.value as PipelineStage)} className="min-h-10 rounded-xl border border-white/[0.09] bg-[#111] px-3 text-xs text-zinc-300 outline-none focus:border-orange-500/40">
                      <option value="interested">Interested</option><option value="preparing">Preparing</option><option value="applied">Applied</option><option value="interview">Interview</option><option value="offer">Offer</option>
                    </select>
                    <button type="button" onClick={() => onActiveNoteJob(noteOpen ? null : key)} className="min-h-10 rounded-xl border border-white/[0.09] px-3 text-xs font-semibold text-zinc-400 hover:text-white"><FileText className="mr-2 inline h-3.5 w-3.5" />{notes[key] ? "Edit note" : "Add note"}</button>
                  </div>
                </div>
                {noteOpen && <div className="mt-4 border-t border-white/[0.07] pt-4"><textarea value={notes[key] || ""} onChange={(event) => onSaveNote(key, event.target.value)} placeholder="Add recruiter name, application deadline, referral lead, interview notes or follow-up date..." className="min-h-24 w-full resize-y rounded-xl border border-white/[0.09] bg-[#0d0d0d] p-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-700 focus:border-orange-500/40" /></div>}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function InterviewAdvantageView({ jobs, onSelectJob, onTailor }: { jobs: LiveJobMatch[]; onSelectJob: (job: LiveJobMatch) => void; onTailor: (job: LiveJobMatch) => void }) {
  const selected = jobs[0];
  if (!selected) return null;
  const intel = getOpportunityIntelligence(selected);
  const questions = buildInterviewQuestions(selected);
  const stories = buildStoryPrompts(selected);
  const talkingPoints = buildRecruiterTalkingPoints(selected);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.035] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div><div className="flex items-center gap-2 text-orange-400"><BriefcaseBusiness className="h-4 w-4" /><p className="text-[10px] font-semibold uppercase tracking-[0.16em]">Interview advantage brief</p></div><h4 className="mt-3 text-xl font-semibold text-white">{selected.role}</h4><p className="mt-1 text-xs text-zinc-600">{selected.company}</p><p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">Your interview strategy should lead with the evidence behind the {intel.match}% match, then proactively address the highest-impact gap before the interviewer raises it.</p></div>
          <DecisionGauge score={getInterviewReadiness(selected)} label="Interview ready" />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => onSelectJob(selected)} className="min-h-11 rounded-xl border border-white/[0.1] px-5 text-sm font-semibold text-zinc-300 hover:text-white">Review full intelligence</button><button type="button" onClick={() => onTailor(selected)} className="min-h-11 rounded-xl bg-orange-500 px-5 text-sm font-bold text-black hover:bg-orange-400">Prepare resume first</button></div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <InterviewPanel title="Likely recruiter questions" subtitle="Generated from role signals" items={questions} icon={<ListChecks className="h-4 w-4" />} />
        <InterviewPanel title="Stories to prepare" subtitle="Evidence examples you should structure" items={stories} icon={<FileText className="h-4 w-4" />} />
        <InterviewPanel title="Your positioning message" subtitle="Points to repeat consistently" items={talkingPoints} icon={<Target className="h-4 w-4" />} />
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
        <h4 className="text-sm font-semibold text-white">Interview readiness across your top opportunities</h4><p className="mt-1 text-xs text-zinc-600">Prepare deeply for the roles most likely to convert, not equally for every listing.</p>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {jobs.slice(0, 6).map((job) => {
            const score = getInterviewReadiness(job);
            return <button key={`interview-${getJobKey(job)}`} type="button" onClick={() => onSelectJob(job)} className="rounded-xl border border-white/[0.07] bg-black/20 p-4 text-left transition hover:border-orange-500/25"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{job.role}</p><p className="mt-1 truncate text-xs text-zinc-700">{job.company}</p></div><span className="text-sm font-bold text-orange-300">{score}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-orange-500" style={{ width: `${score}%` }} /></div></button>;
          })}
        </div>
      </section>
    </div>
  );
}

function CommandMetric({ label, value, helper }: { label: string; value: string; helper: string }) { return <div className="min-w-[100px] rounded-xl border border-white/[0.08] bg-black/25 px-3 py-3"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-700">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value}</p><p className="mt-0.5 text-[9px] text-zinc-700">{helper}</p></div>; }
function CommandTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) { return <button type="button" onClick={onClick} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${active ? "bg-orange-500 text-black" : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"}`}>{icon}{label}</button>; }
function DecisionGauge({ score, label }: { score: number; label: string }) { const safe=Math.max(0,Math.min(100,score)); return <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-[7px] border-orange-500/20 bg-[#0d0d0d] shadow-inner"><p className="text-2xl font-bold text-white">{safe}</p><p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-700">{label}</p></div>; }
function DecisionSignal({ label, value, interpretation }: { label: string; value: string; interpretation: string }) { return <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-700">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p><p className="mt-1 truncate text-[10px] text-zinc-600">{interpretation}</p></div>; }
function StrategyCard({ title, subtitle, job, badge, onSelect }: { title: string; subtitle: string; job: LiveJobMatch; badge: string; onSelect: (job: LiveJobMatch) => void }) { const intel=getOpportunityIntelligence(job); return <button type="button" onClick={() => onSelect(job)} className="group rounded-2xl border border-white/[0.08] bg-[#101010] p-5 text-left transition hover:border-orange-500/25"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-300">{title}</p><p className="mt-1 text-[10px] text-zinc-700">{subtitle}</p></div><span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-zinc-600">{badge}</span></div><p className="mt-4 truncate text-sm font-semibold text-white">{job.role}</p><p className="mt-1 truncate text-xs text-zinc-700">{job.company}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs text-zinc-600">{intel.match}% match · {intel.gapRisk} risk</span><ArrowRight className="h-4 w-4 text-orange-400 transition group-hover:translate-x-0.5" /></div></button>; }
function LeaderboardValue({ label, value }: { label: string; value: string }) { return <div><p className="text-[9px] uppercase tracking-[0.12em] text-zinc-700">{label}</p><p className="mt-1 text-xs font-semibold text-zinc-300">{value}</p></div>; }
function SkillEvidenceBar({ row, positive=false }: { row: SkillEvidenceRow; positive?: boolean }) { return <div><div className="flex items-center justify-between gap-3"><p className="truncate text-xs font-semibold text-zinc-300">{row.skill}</p><p className={`text-xs font-semibold ${positive ? "text-emerald-300" : "text-orange-300"}`}>{positive ? `${row.coverage}% coverage` : `${row.gapCount} roles`}</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-orange-500"}`} style={{ width: `${positive ? row.coverage : Math.min(100,row.gapCount*20)}%` }} /></div></div>; }
function EmptyInsight({ label }: { label: string }) { return <div className="rounded-xl border border-dashed border-white/[0.09] p-5 text-center text-xs text-zinc-700">{label}</div>; }
function EvidenceMiniList({ title, items, positive=false }: { title: string; items: string[]; positive?: boolean }) { return <div><p className={`text-[9px] font-semibold uppercase tracking-[0.13em] ${positive ? "text-emerald-400" : "text-orange-400"}`}>{title}</p><div className="mt-2 space-y-1.5">{items.length ? items.map((item,index)=><p key={`${item}-${index}`} className="line-clamp-1 text-[10px] text-zinc-600">{positive ? "✓" : "•"} {item}</p>) : <p className="text-[10px] text-zinc-700">No signals listed</p>}</div></div>; }
function GoalControl({ label, value, onChange, progress, current }: { label: string; value: number; onChange: (value:number)=>void; progress:number; current:number }) { return <div><div className="flex items-center justify-between gap-3"><label className="text-xs font-semibold text-zinc-300">{label}</label><div className="flex items-center gap-2"><span className="text-[10px] text-zinc-700">{current}/{value}</span><input type="number" min={0} max={50} value={value} onChange={(event)=>onChange(Number(event.target.value))} className="h-8 w-16 rounded-lg border border-white/[0.09] bg-black/20 px-2 text-center text-xs text-zinc-300 outline-none focus:border-orange-500/40" /></div></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-orange-500" style={{width:`${progress}%`}} /></div></div>; }
function PipelineCountTile({ stage, value }: { stage: PipelineStage; value: number }) { return <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3 text-center"><p className="text-lg font-semibold text-white">{value}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-700">{formatPipelineStage(stage)}</p></div>; }
function InterviewPanel({ title, subtitle, items, icon }: { title:string; subtitle:string; items:string[]; icon:ReactNode }) { return <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">{icon}</span><div><h4 className="text-sm font-semibold text-white">{title}</h4><p className="mt-0.5 text-[10px] text-zinc-700">{subtitle}</p></div></div><div className="mt-5 space-y-3">{items.map((item,index)=><div key={`${item}-${index}`} className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[9px] font-bold text-orange-300">{index+1}</span><p className="text-xs leading-5 text-zinc-500">{item}</p></div>)}</div></section>; }

type SkillEvidenceRow = { skill: string; supportCount: number; gapCount: number; coverage: number };
function buildSkillEvidenceRows(jobs: LiveJobMatch[]): SkillEvidenceRow[] { const map=new Map<string,{display:string;support:number;gap:number}>(); jobs.forEach(job=>{(job.whyMatched||[]).forEach(item=>{const skill=extractSkillLabel(item);const key=skill.toLowerCase();const current=map.get(key)||{display:skill,support:0,gap:0};current.support+=1;map.set(key,current)});(job.missingSkills||[]).forEach(item=>{const skill=extractSkillLabel(item);const key=skill.toLowerCase();const current=map.get(key)||{display:skill,support:0,gap:0};current.gap+=1;map.set(key,current)})}); return [...map.values()].map(value=>({skill:value.display,supportCount:value.support,gapCount:value.gap,coverage:Math.round((value.support/Math.max(1,value.support+value.gap))*100)})).sort((a,b)=>(b.supportCount+b.gapCount)-(a.supportCount+a.gapCount)); }
function extractSkillLabel(value:string){ const cleaned=value.replace(/^(experience (with|in)|strong|proven|knowledge of|missing|needs?|requires?)\s+/i,"").replace(/[.:;].*$/,"").trim(); return cleaned.length>52?`${cleaned.slice(0,49)}...`:cleaned||"Role evidence"; }
function getDecisionScore(job:LiveJobMatch,intel=getOpportunityIntelligence(job)){ const freshness=getFreshnessScore(job.postedAt); const riskPenalty=getRiskNumber(intel.gapRisk)*6; return Math.max(0,Math.min(100,Math.round(intel.match*.38+intel.readiness*.32+intel.skillCoverage*.18+freshness*.12-riskPenalty))); }
function getRiskNumber(risk:OpportunityIntelligence["gapRisk"]){ return risk==="High"?3:risk==="Medium"?2:1; }
function getRiskAdvice(risk:OpportunityIntelligence["gapRisk"]){ return risk==="Low"?"Apply confidently":risk==="Medium"?"Position gaps":"Build proof first"; }
function buildSeventyTwoHourPlan(job:LiveJobMatch){ const gaps=(job.missingSkills||[]).slice(0,2); return [{title:"Today · Build the evidence case",detail:`Review the original listing and collect 2–3 achievements that prove ${(job.whyMatched||[])[0]||"your strongest matching capability"}.`},{title:"Within 24 hours · Tailor deliberately",detail:gaps.length?`Address ${gaps.join(" and ")} through truthful transferable evidence, positioning or a focused learning proof.`:"Align your summary and strongest bullets to the role language without keyword stuffing."},{title:"Within 72 hours · Apply and follow through",detail:`Submit the reviewed application, record the source and prepare a concise reason for choosing ${job.company}.`}]; }
function buildPipelineDiagnosis(counts:Record<PipelineStage,number>){ if(counts.offer>0)return "You have offer-stage momentum. Protect decision quality by comparing role scope, compensation, manager quality and growth—not salary alone."; if(counts.interview>0)return "Your pipeline has interview traction. Shift effort from adding more low-priority roles to preparation, follow-ups and evidence-based storytelling."; if(counts.applied>3&&counts.interview===0)return "Applications are moving out but not converting yet. Tighten role selection, resume tailoring and referral outreach before increasing volume."; if(counts.preparing>3&&counts.applied===0)return "Preparation is becoming a bottleneck. Set a review deadline and submit the strongest applications instead of endlessly polishing."; return "Your pipeline is still early. Prioritise two strong-fit roles, tailor them deeply and track every next action."; }
function getInterviewReadiness(job:LiveJobMatch){ const intel=getOpportunityIntelligence(job); const evidence=Math.min(100,(job.whyMatched||[]).length*18); const gapPenalty=(job.missingSkills||[]).length*5; return Math.max(20,Math.min(98,Math.round(intel.readiness*.55+evidence*.3+intel.freshnessScore*.15-gapPenalty))); }
function buildInterviewQuestions(job:LiveJobMatch){ const strengths=(job.whyMatched||[]).slice(0,2); const gaps=(job.missingSkills||[]).slice(0,1); return [`Why are you interested in the ${job.role} opportunity at ${job.company}?`,strengths[0]?`Tell me about a measurable example that demonstrates ${strengths[0]}.`:"Which achievement best proves you can succeed in this role?",strengths[1]?`How have you applied ${strengths[1]} under pressure or ambiguity?`:"How do you prioritise when several stakeholders need results?",gaps[0]?`This role values ${gaps[0]}. How would you close or compensate for that gap?`:"What would your 30-day learning plan look like in this role?"]; }
function buildStoryPrompts(job:LiveJobMatch){ const signals=(job.whyMatched||[]).slice(0,3); return [signals[0]?`A STAR story proving ${signals[0]}.`:"A STAR story showing measurable business impact.",signals[1]?`A difficult situation where you used ${signals[1]}.`:"A story about influencing a difficult stakeholder.",signals[2]?`A recent example that demonstrates ${signals[2]}.`:"A failure or setback, what changed and the measurable outcome.","A concise example of learning a new tool, process or domain quickly."]; }
function buildRecruiterTalkingPoints(job:LiveJobMatch){ const intel=getOpportunityIntelligence(job); return [`Lead with the ${intel.fitLabel.toLowerCase()} profile fit, but support it with specific outcomes rather than adjectives.`,`Connect your experience directly to ${(job.whyMatched||[])[0]||"the role's highest-priority requirement"}.`,(job.missingSkills||[])[0]?`Address ${(job.missingSkills||[])[0]} honestly and show adjacent experience plus a credible ramp-up plan.`:"Emphasise that your core requirements are already evidenced in the resume.",`Close by explaining the value you expect to create for ${job.company} in the first 90 days.`]; }
function clampGoal(value:unknown,fallback:number){ const number=typeof value==="number"?value:Number(value); return Number.isFinite(number)?Math.max(0,Math.min(50,Math.round(number))):fallback; }

function JobIntelligenceModal({
  job,
  saved,
  onClose,
  onSave,
  onTailor,
  pipelineStage,
  onPipelineChange,
}: {
  job: LiveJobMatch;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onTailor: () => void;
  pipelineStage: PipelineStage;
  onPipelineChange: (stage: PipelineStage) => void;
}) {
  const intelligence = getOpportunityIntelligence(job);
  const hasDirectApply = isSafeExternalUrl(job.url);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${job.role} opportunity intelligence`}>
      <button type="button" aria-label="Close opportunity details" onClick={onClose} className="absolute inset-0 cursor-default" />

      <div className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-[1.8rem] border border-white/[0.1] bg-[#0b0b0b] shadow-[0_30px_120px_rgba(0,0,0,0.7)] sm:rounded-[1.8rem]">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#0b0b0b]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">Opportunity intelligence</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{job.role}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] text-zinc-500 transition hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreTile label="Profile match" value={`${intelligence.match}%`} tone="orange" />
            <ScoreTile label="Application readiness" value={`${intelligence.readiness}%`} tone="green" />
            <ScoreTile label="Skill coverage" value={`${intelligence.skillCoverage}%`} />
            <ScoreTile label="Opportunity risk" value={intelligence.gapRisk} tone={intelligence.gapRisk === "Low" ? "green" : intelligence.gapRisk === "High" ? "red" : "orange"} />
          </div>

          <section className="mt-5 rounded-2xl border border-orange-500/15 bg-orange-500/[0.045] p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">OffernHire verdict</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{intelligence.verdict}</p>
              </div>
              <VerdictBadge verdict={intelligence.verdict} />
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">{intelligence.recruiterNote}</p>
          </section>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <EvidencePanel title="Why you match" subtitle="Resume evidence supporting this opportunity" items={job.whyMatched || []} positive />
            <GapPanel skills={job.missingSkills || []} />
          </div>

          <section className="mt-5 rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Flag className="h-4 w-4 text-orange-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Application decision blueprint</p>
                  <p className="mt-0.5 text-[10px] text-zinc-700">A clear path from discovery to application</p>
                </div>
              </div>
              <select
                value={pipelineStage}
                onChange={(event) => onPipelineChange(event.target.value as PipelineStage)}
                className="min-h-10 rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-zinc-300 outline-none focus:border-orange-500/40"
                aria-label="Career pipeline stage"
              >
                <option value="interested">Interested</option>
                <option value="preparing">Preparing</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <DecisionStep icon={<Target className="h-4 w-4" />} title="Fit" detail={`${intelligence.match}% profile alignment`} />
              <DecisionStep icon={<SlidersHorizontal className="h-4 w-4" />} title="Improve" detail={`${job.missingSkills?.length || 0} priority gaps`} />
              <DecisionStep icon={<ArrowRight className="h-4 w-4" />} title="Act" detail={intelligence.nextAction} />
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-orange-400" />
              <div>
                <p className="text-sm font-semibold text-white">Job details</p>
                <p className="mt-0.5 text-[10px] text-zinc-700">Review without leaving OffernHire</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <MetadataBadge icon={<MapPin className="h-3.5 w-3.5" />} label={job.location || "India"} />
              <MetadataBadge icon={<IndianRupee className="h-3.5 w-3.5" />} label={job.salary || "Not disclosed"} />
              <MetadataBadge icon={<BriefcaseBusiness className="h-3.5 w-3.5" />} label={formatEmploymentType(job.employmentType) || job.seniority || intelligence.seniority} />
              {formatPostedDate(job.postedAt) && <MetadataBadge icon={<CalendarDays className="h-3.5 w-3.5" />} label={formatPostedDate(job.postedAt)} />}
            </div>

            <div className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-400">
              {job.description?.trim() || "The provider did not return a complete job description. Review the original listing before applying."}
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onSave} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-4 text-sm font-medium text-zinc-300 hover:text-white">
              <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save opportunity"}
            </button>
            {hasDirectApply && (
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-5 text-sm font-semibold text-emerald-300">
                Apply externally <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button type="button" onClick={onTailor} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-black hover:bg-orange-400">
              Prepare application <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionStep({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <div className="text-orange-400">{icon}</div>
      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-700">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-zinc-300">{detail}</p>
    </div>
  );
}

function CompareModal({ jobs, onClose, onTailor }: { jobs: LiveJobMatch[]; onClose: () => void; onTailor: (job: LiveJobMatch) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Compare opportunities">
      <button type="button" aria-label="Close comparison" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-[1.8rem] border border-white/[0.1] bg-[#0b0b0b] sm:rounded-[1.8rem]">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#0b0b0b]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">Decision workspace</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Compare your strongest opportunities</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] text-zinc-500 hover:text-white" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        <div className="overflow-x-auto p-5 sm:p-7">
          <div className="grid min-w-[820px] gap-4" style={{ gridTemplateColumns: `180px repeat(${jobs.length}, minmax(210px, 1fr))` }}>
            <CompareHeaderCell label="Opportunity" />
            {jobs.map((job) => <CompareJobHeader key={getJobKey(job)} job={job} />)}

            <CompareHeaderCell label="Profile match" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-match`} value={`${getOpportunityIntelligence(job).match}%`} />)}

            <CompareHeaderCell label="Readiness" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-ready`} value={`${getOpportunityIntelligence(job).readiness}%`} />)}

            <CompareHeaderCell label="Skill gaps" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-gaps`} value={`${job.missingSkills?.length || 0}`} />)}

            <CompareHeaderCell label="Risk" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-risk`} value={getOpportunityIntelligence(job).gapRisk} />)}

            <CompareHeaderCell label="Salary" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-salary`} value={job.salary || "Not disclosed"} />)}

            <CompareHeaderCell label="Location" />
            {jobs.map((job) => <CompareValue key={`${getJobKey(job)}-location`} value={job.location || "India"} />)}

            <CompareHeaderCell label="Recommended action" />
            {jobs.map((job) => (
              <div key={`${getJobKey(job)}-action`} className="rounded-xl border border-white/[0.08] bg-[#101010] p-4">
                <p className="text-sm font-semibold text-white">{getOpportunityIntelligence(job).verdict}</p>
                <button type="button" onClick={() => onTailor(job)} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300">Prepare <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareHeaderCell({ label }: { label: string }) {
  return <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/25 p-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">{label}</div>;
}

function CompareJobHeader({ job }: { job: LiveJobMatch }) {
  return (
    <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.045] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{job.company}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-white">{job.role}</p>
    </div>
  );
}

function CompareValue({ value }: { value: string }) {
  return <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#101010] p-4 text-sm text-zinc-300">{value}</div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-9 rounded-xl border px-3 text-xs font-semibold transition ${active ? "border-orange-500/30 bg-orange-500/[0.08] text-orange-300" : "border-white/[0.08] bg-black/20 text-zinc-500 hover:text-white"}`}>
      {children}
    </button>
  );
}

function ScoreTile({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "orange" | "green" | "red" }) {
  const valueClass = tone === "orange" ? "text-orange-300" : tone === "green" ? "text-emerald-300" : tone === "red" ? "text-red-300" : "text-white";
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101010] px-4 py-3.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-700">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: OpportunityIntelligence["verdict"] }) {
  const classes = verdict === "Apply now" ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300" : verdict === "Tailor first" ? "border-orange-500/20 bg-orange-500/[0.07] text-orange-300" : "border-red-500/20 bg-red-500/[0.07] text-red-300";
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] ${classes}`}>{verdict}</span>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-3">
      <p className="text-[9px] uppercase tracking-[0.13em] text-zinc-700">{label}</p>
      <p className="mt-1.5 text-xs font-semibold text-zinc-300">{value}</p>
    </div>
  );
}

function ProgressStep({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${complete ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-300" : "border-white/[0.1] text-zinc-700"}`}>
        {complete ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
    </div>
  );
}

function EvidencePanel({ title, subtitle, items, positive }: { title: string; subtitle: string; items: string[]; positive?: boolean }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${positive ? "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400" : "border-orange-500/15 bg-orange-500/[0.06] text-orange-400"}`}>
          <Check className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-[10px] text-zinc-700">{subtitle}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.length > 0 ? items.slice(0, 5).map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-zinc-400">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            {item}
          </li>
        )) : (
          <li className="text-sm leading-6 text-zinc-500">Your resume contains relevant signals, but the provider returned limited matching evidence.</li>
        )}
      </ul>
    </section>
  );
}

function GapPanel({ skills }: { skills: string[] }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/15 bg-orange-500/[0.06] text-orange-400">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Opportunity gaps</p>
          <p className="mt-0.5 text-[10px] text-zinc-700">Items to verify or address truthfully</p>
        </div>
      </div>

      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 6).map((skill, index) => (
            <span key={`${skill}-${index}`} className="rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-xs font-medium text-orange-300">{skill}</span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-zinc-500">No major supported-skill gaps were identified from the available listing data.</p>
      )}

      <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-5 text-zinc-600">Never add a missing skill unless you genuinely possess it. Tailoring should improve relevance—not invent experience.</p>
    </section>
  );
}

function SearchMenu({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="absolute bottom-[calc(100%+8px)] right-0 z-20 w-full min-w-[230px] overflow-hidden rounded-xl border border-white/[0.1] bg-[#111111] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
      {platforms.map((platform) => (
        <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white">
          <span>Search on <strong className="font-semibold text-zinc-200">{platform.name}</strong></span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}

function buildTailoringBrief(job: LiveJobMatch) {
  const actualDescription = job.description?.trim();

  return `
Target role: ${job.role}
Employer: ${job.company}
Location: ${job.location || "Not specified"}
Salary: ${job.salary || "Not disclosed"}
Employment type: ${formatEmploymentType(job.employmentType) || "Not specified"}
Job source: ${job.source || "Live job provider"}
Original job link: ${job.url || "Not available"}

${actualDescription ? `LIVE JOB DESCRIPTION:\n${actualDescription}\n` : ""}

WHY THIS ROLE MATCHED:
${(job.whyMatched || []).map((item) => `- ${item}`).join("\n") || "- Review the candidate evidence against this role."}

POTENTIAL GAPS:
${(job.missingSkills || []).map((item) => `- ${item}`).join("\n") || "- No major gaps identified."}

Create a truthful, premium and ATS-safe resume specifically for this opportunity.
Use the live job description when supplied.
Do not invent experience, tools, metrics or qualifications.
`.trim();
}

function getOpportunityIntelligence(job: LiveJobMatch): OpportunityIntelligence {
  const match = clamp(Math.round(job.match || 0));
  const gaps = job.missingSkills?.length || 0;
  const evidenceCount = job.whyMatched?.length || 0;
  const hasDescription = Boolean(job.description?.trim());
  const hasSalary = Boolean(job.salary?.trim());
  const isLive = Boolean(job.isLive && isSafeExternalUrl(job.url));
  const freshnessScore = getFreshnessScore(job.postedAt);

  const skillCoverage = clamp(
    Math.round(match * 0.72 + Math.min(evidenceCount, 5) * 5 - Math.min(gaps, 6) * 4)
  );

  const readiness = clamp(
    Math.round(
      match * 0.55 +
        skillCoverage * 0.24 +
        freshnessScore * 0.09 +
        (hasDescription ? 6 : 0) +
        (hasSalary ? 2 : 0) +
        (isLive ? 4 : 0) -
        Math.min(gaps, 6) * 3
    )
  );

  const gapRisk: OpportunityIntelligence["gapRisk"] =
    gaps <= 1 && match >= 75 ? "Low" : gaps >= 4 || match < 58 ? "High" : "Medium";

  const verdict: OpportunityIntelligence["verdict"] =
    readiness >= 78 && gapRisk !== "High"
      ? "Apply now"
      : readiness >= 55
        ? "Tailor first"
        : "Review carefully";

  const fitLabel: OpportunityIntelligence["fitLabel"] =
    match >= 85 ? "Excellent" : match >= 72 ? "Strong" : match >= 58 ? "Promising" : "Exploratory";

  const freshnessLabel = freshnessScore >= 85 ? "Very recent" : freshnessScore >= 60 ? "Recent" : freshnessScore >= 35 ? "Aging" : "Verify status";

  const recruiterNote = buildRecruiterNote(job, match, gaps, evidenceCount, verdict);

  const nextAction =
    verdict === "Apply now"
      ? "Tailor your resume to the live description, review the final version and apply today."
      : verdict === "Tailor first"
        ? "Strengthen the supported keywords and achievements before opening the external application."
        : "Review the seniority and missing requirements before investing time in this application.";

  const preparationMinutes = Math.max(8, Math.min(35, 10 + gaps * 4 + (hasDescription ? 4 : 8)));

  return {
    match,
    readiness,
    skillCoverage,
    gapRisk,
    verdict,
    fitLabel,
    freshnessScore,
    freshnessLabel,
    recruiterNote,
    nextAction,
    preparationMinutes,
    seniority: match >= 80 ? "Aligned seniority" : match >= 60 ? "Review experience" : "Career transition",
  };
}

function buildRecruiterNote(job: LiveJobMatch, match: number, gaps: number, evidenceCount: number, verdict: OpportunityIntelligence["verdict"]) {
  const strongestEvidence = job.whyMatched?.[0]?.trim();
  const primaryGap = job.missingSkills?.[0]?.trim();
  const opening = strongestEvidence
    ? `Your strongest supported signal is ${lowercaseFirst(strongestEvidence)}.`
    : evidenceCount > 0
      ? "Your resume shows several relevant signals for this role."
      : "The available data suggests some alignment, but the evidence is limited.";

  const gapSentence = gaps === 0
    ? "No major supported-skill gap was identified from the available listing data."
    : primaryGap
      ? `The first item to verify is ${primaryGap}; address it only if it reflects your real experience.`
      : `${gaps} potential gaps should be reviewed before applying.`;

  const closing = verdict === "Apply now"
    ? "A focused, role-specific resume should make this a high-priority application."
    : verdict === "Tailor first"
      ? "The opportunity is worth pursuing, but a generic resume may undersell your fit."
      : "Treat this as a considered application rather than a priority submission.";

  return `${opening} ${gapSentence} ${closing} Current profile alignment: ${match}%.`;
}

function formatPipelineStage(stage: PipelineStage) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function lowercaseFirst(value: string) {
  if (!value) return value;
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getJobKey(job: LiveJobMatch) {
  return job.url || `${job.company || "company"}-${job.role || "role"}-${job.location || "location"}`;
}

function createFallbackSearchLinks(job: LiveJobMatch): Platform[] {
  const role = job.role?.trim() || "jobs";
  const location = normalizeLocation(job.location);
  const query = encodeURIComponent(role);
  const encodedLocation = encodeURIComponent(location);
  const roleSlug = slugify(role);
  const locationSlug = slugify(location);

  return [
    { name: "LinkedIn", url: job.searchLinks?.linkedin || `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${encodedLocation}` },
    { name: "Indeed India", url: job.searchLinks?.indeed || `https://in.indeed.com/jobs?q=${query}&l=${encodedLocation}` },
    { name: "Naukri", url: job.searchLinks?.naukri || `https://www.naukri.com/${roleSlug}-jobs-in-${locationSlug}` },
    { name: "Foundit", url: job.searchLinks?.foundit || `https://www.foundit.in/search/${roleSlug}-jobs-in-${locationSlug}` },
  ];
}

function normalizeLocation(location?: string) {
  if (!location) return "India";
  const cleaned = location.replace(/\s*\/\s*/g, " ").replace(/\bremote\b/gi, "").trim();
  return cleaned || "India";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function isSafeExternalUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getPostedTimestamp(value?: string) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getFreshnessScore(value?: string) {
  const timestamp = getPostedTimestamp(value);
  if (!timestamp) return 35;
  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  if (days <= 1) return 100;
  if (days <= 3) return 90;
  if (days <= 7) return 78;
  if (days <= 14) return 62;
  if (days <= 30) return 42;
  return 20;
}

function getSalarySortValue(value?: string) {
  if (!value) return 0;
  const matches = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/g);
  if (!matches?.length) return 0;
  return Math.max(...matches.map(Number).filter(Number.isFinite));
}

function formatPostedDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
}

function formatEmploymentType(value?: string) {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isLiveJobMatch(value: unknown): value is LiveJobMatch {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.company === "string" && typeof record.role === "string";
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[96px] rounded-xl border border-white/[0.08] bg-black/25 px-3 py-3 sm:min-w-[108px] sm:px-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">{label}</p>
      <p className="mt-1.5 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function CompanyMark({ company }: { company: string }) {
  const initials = (company || "Company").split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("");
  return <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-zinc-950 text-sm font-semibold text-orange-200 shadow-inner">{initials || "CO"}</div>;
}

function MetadataBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101010] px-3 py-1.5 text-xs font-medium text-zinc-500">{icon}{label}</span>;
}