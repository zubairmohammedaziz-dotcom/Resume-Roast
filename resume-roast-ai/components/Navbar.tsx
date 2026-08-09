"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}

export default function Navbar() {
  const { data: session, status } = useSession();

  // Track a successful Google login only after authentication completes.
  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const pendingLogin = sessionStorage.getItem("offernhire_pending_google_login");

    if (pendingLogin !== "true") return;

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "login", {
        method: "Google",
      });
    }

    sessionStorage.removeItem("offernhire_pending_google_login");
  }, [status, session]);

  const handleGoogleSignIn = async () => {
    sessionStorage.setItem("offernhire_pending_google_login", "true");

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-black text-black">
            O
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
                onClick={handleGoogleSignIn}
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