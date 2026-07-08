"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-black">
            R
          </div>
          <div>
            <p className="text-lg font-black text-white">Resume Roast AI</p>
            <p className="text-xs text-zinc-500">From Resume to Offer Letter</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-bold text-zinc-400 md:flex">
          <a href="#features" className="hover:text-orange-400">Features</a>
          <a href="#resume-analyzer" className="hover:text-orange-400">Analyzer</a>
          <a href="#pricing" className="hover:text-orange-400">Pricing</a>
          <a href="#faq" className="hover:text-orange-400">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border border-zinc-700"
                />
              )}

              <button
                onClick={() => signOut()}
                className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-bold text-white hover:border-orange-500"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-bold text-white hover:border-orange-500"
            >
              Login
            </button>
          )}

          <a
            href="#resume-analyzer"
            className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-black text-black hover:bg-orange-400"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}