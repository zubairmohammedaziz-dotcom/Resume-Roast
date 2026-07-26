"use client";

import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const values = [
  {
    title: "Career First",
    description:
      "Every feature begins with one question: will this help a job seeker make a better career decision?",
    icon: HeartHandshake,
  },
  {
    title: "Honest Intelligence",
    description:
      "We aim to provide practical, transparent guidance—not inflated scores, empty promises, or generic advice.",
    icon: SearchCheck,
  },
  {
    title: "Privacy by Design",
    description:
      "Resumes contain deeply personal information. We build with security, responsibility, and user trust at the core.",
    icon: LockKeyhole,
  },
  {
    title: "Continuous Improvement",
    description:
      "Hiring evolves constantly. Our product improves through recruiter insight, technology, and real user needs.",
    icon: Lightbulb,
  },
];

const problems = [
  "Candidates apply without knowing whether the role is genuinely right for them.",
  "Most rejections arrive without useful feedback or a clear reason.",
  "One generic resume is used across roles with completely different expectations.",
  "Job seekers prepare for interviews only after an opportunity becomes urgent.",
];

const expertise = [
  {
    title: "Hiring & Interview Insight",
    description:
      "Practical understanding of how candidates are assessed, shortlisted, coached, and selected.",
    icon: Users,
  },
  {
    title: "Operations Leadership",
    description:
      "Years of experience building teams, improving performance, and helping professionals grow.",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI & Product Engineering",
    description:
      "Modern technology designed to turn complex career decisions into clear, usable actions.",
    icon: BrainCircuit,
  },
];

export default function OurStory() {
  function scrollToAnalyzer() {
    document.getElementById("resume-analyzer")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 px-5 py-16 shadow-2xl shadow-black/40 sm:px-6 md:px-12 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/[0.09] blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-amber-500/[0.04] blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-orange-500/[0.05] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Our Story
          </div>

          <h2
            id="our-story-heading"
            className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl"
          >
            Helping professionals make smarter career decisions.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
            Finding the right job should not depend on luck, guesswork, or
            sending hundreds of applications into silence. OffernHire was
            created to give job seekers the clarity, preparation, and
            confidence they deserve.
          </p>

          <p className="mt-5 text-lg font-black text-white md:text-xl">
            We do not help people apply to more jobs.
            <span className="text-orange-400">
              {" "}
              We help them apply to the right jobs.
            </span>
          </p>
        </header>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/[0.07] blur-3xl"
            />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                Why we exist
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
                The job search is full of uncertainty.
              </h3>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Talented professionals spend hours searching, editing resumes,
                and applying—often without knowing how recruiters will evaluate
                them or whether a role genuinely fits their experience.
              </p>

              <p className="mt-4 text-base leading-8 text-zinc-400">
                Most platforms are designed to increase application volume.
                OffernHire is designed to improve application quality and help
                people understand what to do next.
              </p>
            </div>
          </article>

          <aside className="rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-500/[0.1] via-white/[0.025] to-white/[0.015] p-7 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Target className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              The problem we are solving
            </p>

            <div className="mt-6 space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-4"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-orange-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold leading-6 text-zinc-200">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <BrainCircuit className="h-5 w-5" aria-hidden="true" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                Built with real hiring insight
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Experience from the real world. Technology built for what comes
                next.
              </h3>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                OffernHire is built at the intersection of hiring, operations,
                product thinking, and software engineering.
              </p>

              <p className="mt-4 text-base leading-8 text-zinc-400">
                Our founder brings nearly a decade of experience leading
                operations, interviewing candidates, coaching professionals,
                improving performance, and working with global organizations.
                That experience is combined with a technology-focused team
                building practical AI tools for modern job seekers.
              </p>

              <blockquote className="mt-7 border-l-2 border-orange-500 pl-5 text-lg font-black leading-8 text-white">
                “Will this improve the candidate&apos;s chances of getting
                shortlisted?”
              </blockquote>

              <p className="mt-3 pl-5 text-sm leading-6 text-zinc-500">
                This is the question behind every recommendation we build.
              </p>
            </div>

            <div className="grid gap-4">
              {expertise.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition duration-300 hover:border-orange-500/25 hover:bg-orange-500/[0.04]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300 transition group-hover:bg-orange-500/15 group-hover:text-orange-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div>
                      <h4 className="text-base font-black text-white">
                        {title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.1] to-white/[0.02] p-7 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Target className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              Our Mission
            </p>

            <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
              Make high-quality career guidance accessible to everyone.
            </h3>

            <p className="mt-5 text-base leading-8 text-zinc-400">
              Our mission is to help millions of professionals make smarter
              career decisions through trustworthy AI, practical guidance, and
              tools designed around real hiring expectations.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-zinc-300">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Our Vision
            </p>

            <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
              A future where every job seeker knows where they stand.
            </h3>

            <p className="mt-5 text-base leading-8 text-zinc-400">
              We are building toward a world where professionals understand
              their strongest opportunities, know what recruiters expect, and
              approach every application with clarity and confidence.
            </p>
          </article>
        </div>

        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              What guides us
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
              Principles that put job seekers first.
            </h3>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-500/25 hover:bg-orange-500/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300 transition group-hover:bg-orange-500/15 group-hover:text-orange-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h4 className="mt-5 text-lg font-black text-white">{title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/[0.14] via-orange-500/[0.07] to-white/[0.025] p-7 text-center md:p-12">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>

            <h3 className="mt-6 text-3xl font-black tracking-tight text-white md:text-4xl">
              Your next opportunity deserves more than guesswork.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-300">
              Understand your profile, discover stronger opportunities, and
              prepare every application with purpose.
            </p>

            <button
              type="button"
              onClick={scrollToAnalyzer}
              className="group mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-black text-black shadow-[0_0_35px_rgba(249,115,22,0.2)] transition duration-200 hover:bg-orange-400 hover:shadow-[0_0_45px_rgba(249,115,22,0.3)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Analyze My Resume Free
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Built with privacy in mind
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                No payment required to start
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}