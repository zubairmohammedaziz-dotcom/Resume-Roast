const features = [
  {
    icon: "📄",
    title: "Resume Roast",
    description:
      "Get a detailed AI review of your resume with actionable feedback on formatting, content, and recruiter appeal.",
  },
  {
    icon: "🎯",
    title: "ATS Optimization",
    description:
      "Identify missing keywords and optimize your resume to pass Applicant Tracking Systems.",
  },
  {
    icon: "✍️",
    title: "AI Resume Tailoring",
    description:
      "Tailor your resume to any job description in seconds with AI-powered rewriting.",
  },
  {
    icon: "💼",
    title: "Cover Letter Generator",
    description:
      "Generate personalized cover letters that match the role and highlight your strengths.",
  },
  {
    icon: "🎤",
    title: "Interview Preparation",
    description:
      "Practice AI-generated interview questions based on your resume and the target job description.",
  },
  {
    icon: "📊",
    title: "Job Match Analysis",
    description:
      "Understand how closely your resume matches a job and what you need to improve before applying.",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="mt-24 rounded-[2rem] border border-zinc-800 bg-zinc-950 px-6 py-16 md:px-12"
    >
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
          Everything You Need
        </p>

        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
          One Platform.
          <span className="block text-orange-400">
            Every Step of Your Career Journey.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          Resume Roast AI brings together every tool you need to improve your
          resume, prepare for interviews, and land your next opportunity.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-[0_20px_60px_rgba(249,115,22,.15)]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
              {feature.icon}
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white group-hover:text-orange-400">
              {feature.title}
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}