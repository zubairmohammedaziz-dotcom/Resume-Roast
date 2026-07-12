"use client";

import type { JobMatch } from "../types/report";

type Props = {
  jobs: JobMatch[];
};

const companyLogos: Record<string, string> = {
  Google: "G",
  Amazon: "A",
  DoorDash: "D",
  Microsoft: "M",
  Adobe: "A",
  Atlassian: "A",
  Salesforce: "S",
};

export default function JobMatches({ jobs }: Props) {
  if (!jobs || jobs.length === 0) return null;

 function handleTailor(job: JobMatch) {
  const jobDescription = `
Company: ${job.company}
Role: ${job.role}
Location: ${job.location}
Salary: ${job.salary}

Why this role matches:
${(job.whyMatched || []).map((item) => `- ${item}`).join("\n")}

Skills to include or improve:
${(job.missingSkills || []).map((item) => `- ${item}`).join("\n")}

Create a tailored ATS resume for this role.
`;

  window.dispatchEvent(
    new CustomEvent("tailor-job", {
      detail: jobDescription,
    })
  );

  setTimeout(() => {
    const section = document.getElementById("tailor-resume-section");

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    section.classList.add(
      "ring-4",
      "ring-orange-500",
      "ring-offset-4",
      "ring-offset-black"
    );

    setTimeout(() => {
      section.classList.remove(
        "ring-4",
        "ring-orange-500",
        "ring-offset-4",
        "ring-offset-black"
      );
    }, 2000);

    setTimeout(() => {
     const textarea = document.getElementById(
  "job-description"
) as HTMLTextAreaElement | null;

textarea?.focus();
    }, 700);
  }, 150);
}

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-orange-400">
            🎯 Best Job Matches
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Roles picked based on your resume, skills, seniority, and career direction.
          </p>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">
          AI Matched
        </span>
      </div>

      <div className="grid gap-5">
        {jobs.map((job, index) => {
          const logo = companyLogos[job.company] || job.company.charAt(0);

          return (
            <div
              key={`${job.company}-${job.role}-${index}`}
              className="rounded-2xl border border-zinc-700 bg-black p-6 transition hover:border-orange-500 hover:bg-zinc-950"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-black">
                    {logo}
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                      {job.company}
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold text-white">
                      {job.role}
                    </h3>

                    <p className="mt-2 text-gray-400">{job.location}</p>
                    <p className="mt-1 font-bold text-green-400">{job.salary}</p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-4xl font-extrabold text-green-400">
                    {job.match}%
                  </div>
                  <div className="text-sm text-gray-500">Match</div>

                  <div className="mt-2 text-orange-400">
                    {"★".repeat(Math.min(5, Math.ceil(job.match / 20)))}
                    <span className="text-zinc-700">
                      {"★".repeat(5 - Math.min(5, Math.ceil(job.match / 20)))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="font-bold text-white">Why you match</p>

                <ul className="mt-3 space-y-2 text-sm">
                  {(job.whyMatched || []).length > 0 ? (
                    job.whyMatched.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-green-400">
                        ✓ {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">
                      Resume shows relevant experience for this role.
                    </li>
                  )}
                </ul>

                {(job.missingSkills || []).length > 0 && (
                  <>
                    <p className="mt-4 font-bold text-orange-400">
                      Missing skills to improve match
                    </p>

                    <ul className="mt-2 space-y-2 text-sm">
                      {job.missingSkills.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
                >
                  Apply Now →
                </a>

                <button
                  onClick={() => handleTailor(job)}
                  className="rounded-xl border border-zinc-700 px-5 py-3 font-bold text-white transition hover:bg-zinc-800"
                >
                  Tailor Resume
                </button>
                <button
  onClick={() => {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    const exists = saved.find(
      (item: any) =>
        item.company === job.company &&
        item.role === job.role
    );

    if (!exists) {
      localStorage.setItem(
        "savedJobs",
        JSON.stringify([...saved, job])
      );
      alert("Job saved!");
    } else {
      alert("Already saved.");
    }
  }}
  className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-500"
>
  ❤️ Save Job
</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}