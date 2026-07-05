export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 px-6 py-20 text-center shadow-2xl md:px-12">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-400">
          Resume Roast AI
        </p>

        <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-7xl">
          From Resume
          <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
            to Offer Letter.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Your AI Career Copilot that helps you optimize your resume, tailor it
          for every job, generate recruiter-ready cover letters, prepare for
          interviews, and increase your chances of getting hired.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#resume-analyzer"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-sm font-black text-black transition hover:scale-105 hover:bg-orange-400"
          >
            Analyze Resume Free
          </a>

          <a
            href="#features"
            className="rounded-2xl border border-zinc-700 bg-black px-8 py-4 text-sm font-black text-white transition hover:border-orange-500"
          >
            Watch Demo
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
            ★★★★★ Built for Job Seekers
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
            ✓ ATS Optimization
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
            ✓ AI Resume Tailoring
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
            ✓ Interview Prep
          </span>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-4xl font-black text-green-400">92%</p>
            <p className="mt-2 text-sm text-zinc-400">ATS Match</p>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
            <p className="text-4xl font-black text-orange-400">30s</p>
            <p className="mt-2 text-sm text-zinc-400">Resume Tailoring</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <p className="text-4xl font-black text-cyan-400">15+</p>
            <p className="mt-2 text-sm text-zinc-400">Interview Qs</p>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5">
            <p className="text-4xl font-black text-purple-400">1</p>
            <p className="mt-2 text-sm text-zinc-400">Career Copilot</p>
          </div>
        </div>
      </div>
    </section>
  );
}