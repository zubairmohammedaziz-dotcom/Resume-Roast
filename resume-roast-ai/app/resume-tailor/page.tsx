import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResumeTailorPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <section className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            AI Resume Tailor
          </p>

          <h1 className="text-4xl font-black sm:text-6xl">
            Tailor your resume for the job you want.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Optimize your resume for a specific job description with
            AI-powered recommendations that help you stand out.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/resume-analyzer"
              className="rounded-xl bg-orange-500 px-6 py-3 font-black text-black hover:bg-orange-400"
            >
              Analyze My Resume →
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white hover:border-orange-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
