import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center shadow-2xl">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>

        <h1 className="text-4xl font-black text-white">
          Welcome to Resume Roast Pro
        </h1>

        <p className="mt-5 text-lg text-zinc-400">
          Your subscription is now active.
        </p>

        <p className="mt-2 text-zinc-500">
          You now have access to unlimited resume analysis,
          AI tailoring, cover letters, interview preparation,
          premium exports and resume history.
        </p>

        <Link
          href="/dashboard"
          className="mt-10 inline-flex rounded-xl bg-orange-500 px-8 py-4 font-bold text-black transition hover:bg-orange-400"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}