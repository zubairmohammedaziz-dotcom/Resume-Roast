import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI Job Matching | OffernHire",
  description:
    "Find job opportunities that match your resume, skills, and career profile.",
};

export default function JobMatchingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            AI Job Matching
          </p>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            Stop applying everywhere.
            <br />
            Apply where you fit.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            OffernHire helps you identify opportunities that align with your
            resume, experience, skills, and career goals.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Profile Match",
              text: "Compare your resume against job requirements to understand how strong your fit is.",
            },
            {
              title: "Better Opportunities",
              text: "Focus your job search on roles where your experience gives you a stronger chance.",
            },
            {
              title: "Apply Smarter",
              text: "Use your match insights to decide which opportunities deserve your time.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7"
            >
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/resume-analyzer"
            className="inline-flex rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black hover:bg-orange-400"
          >
            Analyze My Resume →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
