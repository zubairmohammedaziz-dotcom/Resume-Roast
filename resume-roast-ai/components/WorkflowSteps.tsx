type Props = {
  activeStep?: number;
};

const steps = ["Upload", "Analyze", "Jobs", "Tailor", "Preview", "Interview"];

export default function WorkflowSteps({ activeStep = 4 }: Props) {
  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
        Resume Roast Workflow
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isDone = stepNumber < activeStep;

          return (
            <div
              key={step}
              className={`rounded-2xl border p-4 text-center ${
                isActive
                  ? "border-orange-500 bg-orange-500/10"
                  : isDone
                  ? "border-green-500/40 bg-green-500/10"
                  : "border-zinc-800 bg-black"
              }`}
            >
              <div
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full font-black ${
                  isActive
                    ? "bg-orange-500 text-black"
                    : isDone
                    ? "bg-green-500 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {isDone ? "✓" : stepNumber}
              </div>

              <p
                className={`mt-3 text-sm font-bold ${
                  isActive
                    ? "text-orange-300"
                    : isDone
                    ? "text-green-300"
                    : "text-zinc-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}