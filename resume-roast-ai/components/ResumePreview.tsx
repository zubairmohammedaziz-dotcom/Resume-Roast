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
    <div className="mt-8 rounded-3xl bg-zinc-800 p-8">
      <div className="mx-auto max-w-[820px] rounded bg-white px-12 py-10 text-slate-950 shadow-2xl">
        <header className="border-b-2 border-slate-900 pb-5">
          <h1 className="text-3xl font-black uppercase tracking-wide text-slate-950">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {headline}
          </p>
        </header>

        <section className="mt-7">
          <h2 className="border-b-2 border-orange-500 pb-2 text-base font-black uppercase tracking-wide text-slate-950">
            Professional Summary
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-900">
            {summary || "Summary not available."}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="border-b-2 border-orange-500 pb-2 text-base font-black uppercase tracking-wide text-slate-950">
            Professional Experience
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-900">
            {bullets?.length ? (
              bullets.map((bullet) => <li key={bullet}>{bullet}</li>)
            ) : (
              <li>Experience highlights not available.</li>
            )}
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="border-b-2 border-orange-500 pb-2 text-base font-black uppercase tracking-wide text-slate-950">
            Core Skills
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills?.length ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-900"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-700">Skills not available.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}