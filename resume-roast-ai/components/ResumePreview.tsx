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
  const structuredExperience = experience.filter(
    (item) =>
      item?.jobTitle ||
      item?.company ||
      item?.duration ||
      item?.bullets?.length
  );

  const contactItems = [
    contact.location,
    contact.email,
    contact.phone,
    contact.linkedin,
  ].filter((item): item is string => Boolean(item?.trim()));

  return (
    <div className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-[#111111] p-3 sm:p-5 lg:p-7">
      <article
        id="resume-preview"
        className="resume-preview mx-auto min-h-[1120px] w-[794px] bg-white px-[58px] py-[52px] text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <header className="border-b border-slate-300 pb-6 text-center">
          <h1 className="text-[30px] font-semibold uppercase tracking-[0.08em] text-slate-950">
            {name}
          </h1>

          <p className="mt-2 text-[13px] font-medium text-slate-600">
            {headline}
          </p>

          {contactItems.length > 0 && (
            <p className="mx-auto mt-3 max-w-[650px] text-[10.5px] leading-5 text-slate-500">
              {contactItems.join("  •  ")}
            </p>
          )}
        </header>

        <ResumeSection title="Professional Summary">
          <p className="text-[11.5px] leading-[1.75] text-slate-700">
            {summary || "Professional summary not available."}
          </p>
        </ResumeSection>

        <ResumeSection title="Professional Experience">
          {structuredExperience.length > 0 ? (
            <div className="space-y-7">
              {structuredExperience.map((item, index) => {
                const itemBullets = Array.isArray(item.bullets)
                  ? item.bullets.filter(Boolean)
                  : [];

                return (
                  <section
                    key={`${item.company}-${item.jobTitle}-${index}`}
                    className="break-inside-avoid"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="min-w-0">
                        {item.jobTitle && (
                          <h3 className="text-[12px] font-semibold text-slate-950">
                            {item.jobTitle}
                          </h3>
                        )}

                        {item.company && (
                          <p className="mt-1 text-[10.5px] font-medium text-slate-600">
                            {item.company}
                          </p>
                        )}
                      </div>

                      {item.duration && (
                        <p className="shrink-0 pt-0.5 text-right text-[9.5px] font-medium text-slate-500">
                          {item.duration}
                        </p>
                      )}
                    </div>

                    {itemBullets.length > 0 && (
                      <ul className="mt-3 space-y-2 pl-4 text-[10.5px] leading-[1.65] text-slate-700">
                        {itemBullets.map((bullet, bulletIndex) => (
                          <li
                            key={`${bullet}-${bulletIndex}`}
                            className="list-disc pl-1 marker:text-slate-500"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-2 pl-4 text-[10.5px] leading-[1.65] text-slate-700">
              {bullets.length > 0 ? (
                bullets.map((bullet, index) => (
                  <li
                    key={`${bullet}-${index}`}
                    className="list-disc pl-1 marker:text-slate-500"
                  >
                    {bullet}
                  </li>
                ))
              ) : (
                <li className="list-disc">Experience details not available.</li>
              )}
            </ul>
          )}
        </ResumeSection>

        {skills.length > 0 && (
          <ResumeSection title="Core Skills">
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>
        )}

        {projects.length > 0 && (
          <ResumeSection title="Projects">
            <div className="space-y-5">
              {projects.map((project, index) => (
                <section
                  key={`${project.title}-${index}`}
                  className="break-inside-avoid"
                >
                  {project.title && (
                    <h3 className="text-[11.5px] font-semibold text-slate-950">
                      {project.title}
                    </h3>
                  )}

                  {project.description && (
                    <p className="mt-1.5 text-[10.5px] leading-[1.65] text-slate-700">
                      {project.description}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </ResumeSection>
        )}

        {certifications.length > 0 && (
          <ResumeSection title="Certifications">
            <ul className="space-y-2 pl-4 text-[10.5px] leading-[1.65] text-slate-700">
              {certifications.map((certification, index) => (
                <li
                  key={`${certification}-${index}`}
                  className="list-disc pl-1 marker:text-slate-500"
                >
                  {certification}
                </li>
              ))}
            </ul>
          </ResumeSection>
        )}

        {education.length > 0 && (
          <ResumeSection title="Education">
            <div className="space-y-5">
              {education.map((item, index) => (
                <section
                  key={`${item.degree}-${item.college}-${index}`}
                  className="flex break-inside-avoid items-start justify-between gap-8"
                >
                  <div className="min-w-0">
                    {item.degree && (
                      <h3 className="text-[11.5px] font-semibold text-slate-950">
                        {item.degree}
                      </h3>
                    )}

                    {item.college && (
                      <p className="mt-1 text-[10px] text-slate-600">
                        {item.college}
                      </p>
                    )}
                  </div>

                  {item.year && (
                    <p className="shrink-0 text-right text-[9.5px] font-medium text-slate-500">
                      {item.year}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </ResumeSection>
        )}
      </article>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 break-inside-avoid-page">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-950">
          {title}
        </h2>

        <div className="h-px flex-1 bg-slate-300" />
      </div>

      {children}
    </section>
  );
}