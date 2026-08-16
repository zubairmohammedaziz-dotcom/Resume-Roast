"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  // Track a successful Google login only after authentication completes.
  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const pendingLogin = sessionStorage.getItem(
      "offernhire_pending_google_login"
    );

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-black sm:h-10 sm:w-10">
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-bold text-zinc-400 md:flex">
          <Link
            href="/"
            className="transition hover:text-orange-400"
          >
            Home
          </Link>

          <Link
            href="/how-it-works"
            className="transition hover:text-orange-400"
          >
            How It Works
          </Link>

          <Link
            href="/resume-analyzer"
            className="transition hover:text-orange-400"
          >
            Resume Analyzer
          </Link>

          <Link
            href="/job-matching"
            className="transition hover:text-orange-400"
          >
            Job Matching
          </Link>

          <Link
            href="/pricing"
            className="transition hover:text-orange-400"
          >
            Pricing
          </Link>

          {/* About Dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition hover:text-orange-400"
            >
              About
              <span className="text-xs">▾</span>
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-56 translate-y-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                href="/our-story"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
              >
                Our Story
              </Link>

              <Link
                href="/why-offernhire"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
              >
                Why OffernHire
              </Link>
            </div>
          </div>
        </nav>

        {/* Account Actions + Mobile Menu Button */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-zinc-800 sm:h-10 sm:w-24" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-white transition hover:border-orange-500 hover:text-orange-400 sm:block sm:px-4 sm:text-sm"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 sm:block"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-white transition hover:border-orange-500 hover:text-orange-400 sm:px-4 sm:text-sm"
              >
                Sign In
              </button>

              <Link
                href="/resume-analyzer"
                className="hidden rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-black transition hover:bg-orange-400 sm:block sm:px-5 sm:text-sm"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 text-white transition hover:border-orange-500 hover:text-orange-400 md:hidden"
          >
            {mobileMenuOpen ? (
              <span className="text-xl leading-none">×</span>
            ) : (
              <span className="text-xl leading-none">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-black px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              Home
            </Link>

            <Link
              href="/how-it-works"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              How It Works
            </Link>

            <Link
              href="/resume-analyzer"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              Resume Analyzer
            </Link>

            <Link
              href="/job-matching"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              Job Matching
            </Link>

            <Link
              href="/pricing"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              Pricing
            </Link>

            {/* Mobile About */}
            <button
              type="button"
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-orange-400"
            >
              <span>About</span>
              <span className="text-xs">
                {mobileAboutOpen ? "▲" : "▼"}
              </span>
            </button>

            {mobileAboutOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-zinc-800 pl-3">
                <Link
                  href="/our-story"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-900 hover:text-orange-400"
                >
                  Our Story
                </Link>

                <Link
                  href="/why-offernhire"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-900 hover:text-orange-400"
                >
                  Why OffernHire
                </Link>
              </div>
            )}

            {session && (
              <>
                <div className="my-2 border-t border-zinc-800" />

                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
                >
                  Sign Out
                </button>
              </>
            )}

            {!session && (
              <Link
                href="/resume-analyzer"
                onClick={closeMobileMenu}
                className="mt-2 rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}