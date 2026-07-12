type ExperienceItem = {
  jobTitle?: string;
  company?: string;
  duration?: string;
  bullets?: string[];
};

type EducationItem = {
  degree?: string;
  college?: string;
  year?: string;
};

type ProjectItem = {
  title?: string;
  description?: string;
};

type Props = {
  name?: string;
  headline?: string;
  contact?: {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
};
  summary: string;
  bullets: string[];
  skills: string[];

  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: string[];
  projects?: ProjectItem[];
};

export default function ResumePreview({
  name = "Candidate Name",
  headline = "Professional Candidate",
  contact = {},
  summary,
  bullets,
  skills,
  experience = [],
  education = [],
  certifications = [],
  projects = [],
}: Props) {
  const hasStructuredExperience = experience.some(
    (item) =>
      item?.jobTitle ||
      item?.company ||
      item?.duration ||
      item?.bullets?.length
  );

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

  {(contact?.location ||
    contact?.email ||
    contact?.phone ||
    contact?.linkedin) && (
    <p className="mt-2 text-xs text-slate-600">
      {[
        contact.location,
        contact.email,
        contact.phone,
        contact.linkedin,
      ]
        .filter(Boolean)
        .join(" • ")}
    </p>
  )}
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
            Professional Experience
          </h2>

          {hasStructuredExperience ? (
            <div className="mt-5 space-y-8">
              {experience.map((item, index) => (
                <div key={`${item.company}-${item.jobTitle}-${index}`}>
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      {item.jobTitle && (
                        <h3 className="text-base font-black text-slate-950">
                          {item.jobTitle}
                        </h3>
                      )}

                      {item.company && (
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.company}
                        </p>
                      )}
                    </div>

                    {item.duration && (
                      <p className="shrink-0 text-xs font-bold text-slate-500">
                        {item.duration}
                      </p>
                    )}
                  </div>

                  {item.bullets?.length ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-800">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-800">
              {bullets?.length ? (
                bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`}>{bullet}</li>
                ))
              ) : (
                <li>Experience highlights not available.</li>
              )}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
            Core Skills
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-800">
            {skills?.length ? skills.join(" • ") : "Skills not available."}
          </p>
        </section>

        {projects.length > 0 && (
          <section className="mt-8">
            <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
              Projects
            </h2>

            <div className="mt-5 space-y-5">
              {projects.map((project, index) => (
                <div key={`${project.title}-${index}`}>
                  {project.title && (
                    <h3 className="text-base font-black text-slate-950">
                      {project.title}
                    </h3>
                  )}

                  {project.description && (
                    <p className="mt-2 text-sm leading-7 text-slate-800">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section className="mt-8">
            <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
              Certifications
            </h2>

            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-800">
              {certifications.map((certification, index) => (
                <li key={`${certification}-${index}`}>{certification}</li>
              ))}
            </ul>
          </section>
        )}

        {education.length > 0 && (
          <section className="mt-8">
            <h2 className="border-b-2 border-orange-500 pb-2 text-sm font-black uppercase tracking-[0.16em]">
              Education
            </h2>

            <div className="mt-5 space-y-5">
              {education.map((item, index) => (
                <div
                  key={`${item.degree}-${item.college}-${index}`}
                  className="flex items-start justify-between gap-6"
                >
                  <div>
                    {item.degree && (
                      <h3 className="text-base font-black text-slate-950">
                        {item.degree}
                      </h3>
                    )}

                    {item.college && (
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {item.college}
                      </p>
                    )}
                  </div>

                  {item.year && (
                    <p className="shrink-0 text-xs font-bold text-slate-500">
                      {item.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}