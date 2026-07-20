"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-black">
            R
          </div>

          <div>
            <p className="text-lg font-black text-white">OffernHire AI</p>
            <p className="text-xs text-zinc-500">
              From Resume to Offer Letter- AI Career Copilot
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

          <a href="/#faq">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-800" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-orange-500 md:block"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800"
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
                className="hidden rounded-xl px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white md:block"
              >
                Sign In
              </button>

              <Link
                href="/#resume-analyzer"
                className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-black text-black hover:bg-orange-400"
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