const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Resume Roast", "ATS Score", "Basic Suggestions"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499/mo",
    features: [
      "Unlimited Resume Roasts",
      "AI Resume Tailoring",
      "Cover Letters",
      "Interview Prep",
      "Resume History",
      "Premium Templates",
    ],
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section className="mt-24 rounded-[2rem] border border-zinc-800 bg-zinc-950 px-6 py-16 md:px-12">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
          Pricing
        </p>
        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
          Start Free. Upgrade When Ready.
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-8 ${
              plan.highlight
                ? "border-orange-500 bg-orange-500/10"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <h3 className="text-3xl font-black text-white">{plan.name}</h3>
            <p className="mt-4 text-5xl font-black text-orange-400">
              {plan.price}
            </p>

            <ul className="mt-8 space-y-4 text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button className="mt-8 w-full rounded-xl bg-orange-500 px-6 py-3 font-black text-black hover:bg-orange-400">
              {plan.highlight ? "Upgrade Soon" : "Start Free"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}