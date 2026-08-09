import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing | OffernHire",
  description: "Choose the OffernHire plan that fits your job search.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            Pricing
          </p>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            Choose how you want to job search.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Start free and upgrade when you need more powerful career tools.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-md rounded-3xl border border-orange-500/40 bg-zinc-950 p-8">
          <p className="text-sm font-black uppercase tracking-wider text-orange-500">
            OffernHire Pro
          </p>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-black">₹199</span>
            <span className="mb-2 text-zinc-500">/ month</span>
          </div>

          <p className="mt-4 text-zinc-400">
            Unlock more tools to improve your applications and job search.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-zinc-300">
            <li>✓ Unlimited resume analysis</li>
            <li>✓ AI resume tailoring</li>
            <li>✓ Cover letters</li>
            <li>✓ Interview preparation</li>
            <li>✓ Resume history</li>
            <li>✓ Premium career tools</li>
          </ul>

          <Link
            href="/#pricing"
            className="mt-8 block rounded-xl bg-orange-500 px-6 py-4 text-center text-sm font-black text-black hover:bg-orange-400"
          >
            Get Pro →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
