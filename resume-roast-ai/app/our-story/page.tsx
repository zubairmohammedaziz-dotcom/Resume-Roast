import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OurStoryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <section className="text-center">
            <p className="mb-5 inline-flex rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              Our Story
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Helping professionals make
              <br />
              <span className="text-orange-400">
                smarter career decisions.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
              Finding the right job should not depend on luck, guesswork, or
              sending hundreds of applications into silence. OffernHire was
              created to give job seekers clarity, preparation, and confidence
              before they apply.
            </p>

            <p className="mx-auto mt-5 max-w-3xl text-sm font-bold leading-7 text-zinc-300">
              We do not help people apply to more jobs.
              <span className="text-orange-400">
                {" "}
                We help them apply to the right jobs.
              </span>
            </p>
          </section>

          {/* Why We Exist */}
          <section className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                ◎
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                Why we exist
              </p>

              <h2 className="mt-3 text-2xl font-black">
                The job search is full of uncertainty.
              </h2>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                Talented professionals spend hours searching, editing resumes,
                applying, and waiting — without knowing how recruiters will
                evaluate them or whether a role is genuinely right for their
                experience.
              </p>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Most platforms are designed to increase application volume.
                OffernHire is designed to improve application quality and help
                people understand what to do next.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-zinc-950 p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                The problem we are solving
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Candidates apply without knowing whether the role is genuinely right for them.",
                  "Most rejections arrive without useful feedback or clear reasons.",
                  "One generic resume is often used across completely different roles.",
                  "Job seekers spend more time applying instead of improving their chances.",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-800 bg-black/40 p-4 text-sm leading-6 text-zinc-300"
                  >
                    <span className="mr-3 text-orange-400">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-7 md:p-9">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                  Built with real-world insight
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Experience from the real world. Technology built for what
                  comes next.
                </h2>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  OffernHire is built around a simple understanding of hiring,
                  operations, digital careers, and what actually happens
                  between a candidate applying and a recruiter making a
                  decision.
                </p>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Our goal is not to replace human judgment. It is to give
                  candidates better information before that judgment happens.
                </p>

                <div className="mt-6 border-l-2 border-orange-500 pl-5">
                  <p className="text-sm font-bold leading-6 text-zinc-200">
                    “Will this improve the candidate&apos;s chances of getting
                    shortlisted?”
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    That is the question behind every product decision we make.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Hiring & Interview Insight",
                    text: "Practical understanding of how candidates are assessed, shortlisted, and interviewed.",
                  },
                  {
                    title: "Operations Leadership",
                    text: "Years of experience building teams, improving performance, and helping professionals grow.",
                  },
                  {
                    title: "AI & Product Engineering",
                    text: "Modern technology designed to turn complex career decisions into useful, actionable guidance.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-zinc-800 bg-black p-5"
                  >
                    <h3 className="text-sm font-black">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission + Future */}
          <section className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                Our mission
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Make high-quality career guidance accessible to everyone.
              </h2>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                Our mission is to help millions of professionals make smarter
                career decisions through practical guidance, intelligence, and
                tools designed around real hiring expectations.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                Our vision
              </p>

              <h2 className="mt-3 text-2xl font-black">
                A future where every job seeker knows where they stand.
              </h2>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                We are building toward a world where professionals understand
                their strongest opportunities, know what recruiters expect,
                and approach every application with clarity and confidence.
              </p>
            </div>
          </section>

          {/* Principles */}
          <section className="mt-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
              What guides us
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Principles that put job seekers first.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Career First",
                  text: "Build technology around what genuinely helps job seekers move forward.",
                },
                {
                  title: "Honest Intelligence",
                  text: "Give practical guidance instead of telling candidates what they simply want to hear.",
                },
                {
                  title: "Privacy by Design",
                  text: "Treat career information responsibly and build with user trust in mind.",
                },
                {
                  title: "Continuous Improvement",
                  text: "Keep improving our technology, insights, and experience as hiring evolves.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left"
                >
                  <div className="mb-4 h-9 w-9 rounded-lg border border-zinc-700 bg-black" />

                  <h3 className="text-sm font-black">{item.title}</h3>

                  <p className="mt-3 text-xs leading-6 text-zinc-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-zinc-950 p-8 text-center">
            <h2 className="text-2xl font-black">
              Your next application should be smarter.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Understand your resume, identify stronger opportunities, and
              prepare before you click Apply.
            </p>

            <Link
              href="/resume-analyzer"
              className="mt-7 inline-flex rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black transition hover:bg-orange-400"
            >
              Analyze My Resume Free →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}