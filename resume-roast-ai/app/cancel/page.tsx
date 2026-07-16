import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
          <CreditCard className="h-10 w-10 text-orange-400" />
        </div>

        <h1 className="text-4xl font-black text-white">
          Your payment was not completed
        </h1>

        <p className="mt-5 text-lg text-zinc-400">
          No charge was made.
        </p>

        <p className="mt-2 text-zinc-500">
          You can continue using the free plan or return to pricing whenever
          you are ready to unlock Pro.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 font-bold text-black transition hover:bg-orange-400"
          >
            Return to Pricing
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-bold text-white transition hover:border-zinc-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue with Free
          </Link>
        </div>
      </div>
    </main>
  );
}