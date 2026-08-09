import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WhyOffernHirePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <section className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-orange-400">
            Why OffernHire
          </p>

          <h1 className="text-4xl font-black sm:text-6xl">
            More than a job portal.
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-400">
            Most platforms help you find jobs. OffernHire helps you understand
            which jobs are worth applying for — and how to become a stronger
            candidate for them.
          </p>

          <div className="mt-14 grid gap-6 text-left md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">
              <h2 className="text-xl font-black">Understand your resume</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Get ATS, recruiter and resume insights before sending another
                application.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">
              <h2 className="text-xl font-black">Find better-fit jobs</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Focus on opportunities that actually match your experience,
                skills and career goals.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">
              <h2 className="text-xl font-black">Apply smarter</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Improve and tailor your application instead of blindly applying
                to hundreds of roles.
              </p>
            </div>
          </div>

          <Link
            href="/resume-analyzer"
            className="mt-12 inline-flex rounded-xl bg-orange-500 px-7 py-4 font-black text-black hover:bg-orange-400"
          >
            Try OffernHire Free →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
