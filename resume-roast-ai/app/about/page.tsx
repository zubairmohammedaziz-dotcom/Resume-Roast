import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About OffernHire | AI Career Copilot",
  description:
    "Learn how OffernHire helps job seekers improve resumes, find better opportunities and build stronger job applications.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
          About OffernHire
        </p>

        <h1 className="mt-5 text-4xl font-black sm:text-6xl">
          Your AI Career Copilot.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          OffernHire helps job seekers understand their resume, identify
          stronger opportunities and create better applications — all in one
          AI-powered career workspace.
        </p>

        <Link
          href="/resume-analyzer"
          className="mt-10 inline-flex rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black hover:bg-orange-400"
        >
          Analyze My Resume →
        </Link>
      </section>

      <Footer />
    </main>
  );
}
