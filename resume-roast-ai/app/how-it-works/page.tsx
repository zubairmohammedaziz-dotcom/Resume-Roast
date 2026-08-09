import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "How OffernHire Works",
  description: "See how OffernHire helps you improve your resume and find better job opportunities.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            How It Works
          </p>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            From resume to better opportunities.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            OffernHire analyzes your resume, identifies where you stand,
            matches you with relevant opportunities, and helps you build a
            stronger application.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Upload your resume",
              text: "Upload your existing resume and let OffernHire analyze your profile.",
            },
            {
              number: "02",
              title: "Understand your score",
              text: "Get ATS, recruiter and resume insights so you know what is helping or hurting your chances.",
            },
            {
              number: "03",
              title: "Apply smarter",
              text: "Find relevant jobs and tailor your application instead of blindly applying to hundreds of roles.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7"
            >
              <span className="text-sm font-black text-orange-500">
                {step.number}
              </span>

              <h2 className="mt-5 text-xl font-black">{step.title}</h2>

              <p className="mt-3 leading-7 text-zinc-400">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/resume-analyzer"
            className="inline-flex rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black hover:bg-orange-400"
          >
            Analyze My Resume Free →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
