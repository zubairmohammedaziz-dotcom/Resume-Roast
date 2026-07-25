import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
          Payment successful
        </p>

        <h1 className="mt-4 text-4xl font-black text-white">
          Welcome to OffernHire Pro
        </h1>

        <p className="mt-5 text-lg text-zinc-400">
          Your subscription is now active.
        </p>

        <p className="mt-2 leading-7 text-zinc-500">
          Your Pro access will be synchronized with your account. You
          can now continue to your dashboard and use the premium tools
          included in your plan.
        </p>

        <Link
          href="/dashboard"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-8 py-3 font-bold text-black transition hover:bg-orange-400"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}