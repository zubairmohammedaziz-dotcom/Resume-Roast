"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-black sm:h-10 sm:w-10 sm:text-xl">
            R
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white sm:text-lg">
              OffernHire AI
            </p>

            <p className="hidden text-xs text-zinc-500 sm:block">
              From Resume to Offer Letter — AI Career Copilot
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-zinc-400 md:flex">
          <Link href="/#features" className="hover:text-orange-400">
            Features
          </Link>

          <Link href="/#resume-analyzer" className="hover:text-orange-400">
            Analyzer
          </Link>

          <Link href="/#pricing" className="hover:text-orange-400">
            Pricing
          </Link>

          <Link href="/#faq" className="hover:text-orange-400">
            FAQ
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-zinc-800 sm:h-10 sm:w-24" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-white hover:border-orange-500 sm:px-4 sm:text-sm"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 sm:block"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/dashboard",
                  })
                }
                className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-white hover:border-orange-500 hover:text-orange-400 sm:px-4 sm:text-sm"
              >
                Sign In
              </button>

              <Link
                href="/#resume-analyzer"
                className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-black hover:bg-orange-400 sm:px-5 sm:text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}