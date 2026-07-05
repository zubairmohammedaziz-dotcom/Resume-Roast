type Props = {
  name?: string;
  headline?: string;
  summary: string;
  bullets: string[];
  skills: string[];
};

export default function ResumePreview({
  name = "Zubair Mohammed",
  headline = "Operations Manager | Program Manager | Business Operations",
  summary,
  bullets,
  skills,
}: Props) {
  return (
    <div className="mt-8 overflow-x-auto rounded-3xl bg-zinc-900 p-10">
      <div className="mx-auto w-[850px] rounded-lg bg-white p-16 text-slate-950 shadow-2xl">
        <header className="border-b-2 border-slate-900 pb-6 text-center">
          <h1 className="text-4xl font-black uppercase tracking-[0.08em]">
            {name}
          </h1>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            {headline}
          </p>

          <p className="mt-3 text-xs text-slate-600">
            Hyderabad, India • Email • Phone • LinkedIn
          </p>
        </header>

        <section className="mt-8">
          <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
            Professional Summary
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-800">
            {summary || "Summary not available."}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
            Work Experience
          </h2>

          <div className="mt-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Operations / Program Management
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Resume Experience Highlights
                </p>
              </div>

              <p className="text-xs font-bold text-slate-500">
                Recent Experience
              </p>
            </div>

            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-800">
              {bullets?.length ? (
                bullets.map((bullet) => <li key={bullet}>{bullet}</li>)
              ) : (
                <li>Experience highlights not available.</li>
              )}
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
            Core Skills
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-800">
            {skills?.length ? skills.join(" • ") : "Skills not available."}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
            Education
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-800">
            Education details can be added from the uploaded resume.
          </p>
        </section>
      </div>
    </div>
  );
}