import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OurStoryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <section className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-orange-400">
            Our Story
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            We built OffernHire because job hunting was broken.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            Job seekers are expected to apply to hundreds of jobs, rewrite
            resumes, understand ATS systems, prepare for interviews, and still
            figure out which opportunities are actually worth pursuing.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            OffernHire was created to bring all of that into one intelligent
            career platform — helping you understand your resume, find better
            opportunities, and apply with more confidence.
          </p>

          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-orange-500/30 bg-zinc-950 p-8 text-left">
            <h2 className="text-2xl font-black">Our mission</h2>

            <p className="mt-4 leading-7 text-zinc-400">
              Stop job seekers from wasting time applying everywhere.
              Help them understand where they have the best chance of getting
              hired — and give them the tools to get there.
            </p>
          </div>

          <Link
            href="/resume-analyzer"
            className="mt-10 inline-flex rounded-xl bg-orange-500 px-7 py-4 font-black text-black hover:bg-orange-400"
          >
            Analyze My Resume Free →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
