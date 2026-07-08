type JobRecommendation = {
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  whyMatched: string[];
  missingSkills: string[];
  url: string;
};

export default function JobRecommendations({
  jobs,
}: {
  jobs: JobRecommendation[];
}) {
  return (
    <div className="space-y-6">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6"
        >
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">{job.role}</h3>
              <p className="text-zinc-400">{job.company}</p>
              <p className="text-sm text-zinc-500">{job.location}</p>
            </div>

            <p className="text-2xl font-black text-green-400">
              {job.match}%
            </p>
          </div>

          <p className="mt-3 font-bold text-orange-400">{job.salary}</p>

          <div className="mt-5">
            <h4 className="font-bold text-white">Why it matches</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              {job.whyMatched.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h4 className="font-bold text-red-400">Missing Skills</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              {job.missingSkills.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <a
            href={job.url}
            target="_blank"
            className="mt-5 inline-block rounded-xl bg-orange-500 px-5 py-2 font-bold text-black hover:bg-orange-400"
          >
            View Job
          </a>
        </div>
      ))}
    </div>
  );
}