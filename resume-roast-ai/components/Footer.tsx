import Link from "next/link";
import {
  FileText,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-black">
                O
              </span>

              <div>
                <h3 className="text-xl font-black text-white">
                  OffernHire
                </h3>

                <p className="text-xs text-zinc-500">
                  Your AI Career Copilot
                </p>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              AI-powered career tools that help job seekers
              analyze, optimize and tailor resumes for stronger
              applications.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Product
            </h4>

            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/#features"
                  className="transition hover:text-orange-400"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="/#pricing"
                  className="transition hover:text-orange-400"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="/#resume-analyzer"
                  className="transition hover:text-orange-400"
                >
                  Resume Analyzer
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="transition hover:text-orange-400"
                >
                  Career Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h4>

            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 transition hover:text-orange-400"
                >
                  <ShieldCheck size={16} />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 transition hover:text-orange-400"
                >
                  <FileText size={16} />
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/refund"
                  className="transition hover:text-orange-400"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-2 transition hover:text-orange-400"
                >
                  <HelpCircle size={16} />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>

            <div className="space-y-3 text-sm text-zinc-400">
              <a
                href="mailto:team@offernhire.com"
                className="flex items-center gap-2 transition hover:text-orange-400"
              >
                <Mail size={16} />
                team@offernhire.com
              </a>

              <p>Hyderabad, India</p>

              <p>
                Built for job seekers across India and beyond.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} OffernHire. All rights
            reserved.
          </p>

          <p>
            Secure payments powered by Razorpay.
          </p>
        </div>
      </div>
    </footer>
  );
}