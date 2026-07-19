import Link from "next/link";
import { Mail, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black text-white">
              OffernHire
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              AI-powered career copilot helping professionals analyze,
              optimize and tailor resumes to land more interviews.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Product
            </h4>

            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <a href="#features" className="hover:text-orange-400">
                  Features
                </a>
              </li>

              <li>
                <a href="#pricing" className="hover:text-orange-400">
                  Pricing
                </a>
              </li>

              <li>
                <a href="#resume-analyzer" className="hover:text-orange-400">
                  Resume Analyzer
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h4>

            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 hover:text-orange-400"
                >
                  <ShieldCheck size={16} />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 hover:text-orange-400"
                >
                  <FileText size={16} />
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/refund"
                  className="hover:text-orange-400"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-2 hover:text-orange-400"
                >
                  <HelpCircle size={16} />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>

            <div className="space-y-3 text-sm text-zinc-400">
              <p className="flex items-center gap-2">
                <Mail size={16} />
                support@resumeroast.ai
              </p>

              <p>
                Hyderabad, India
              </p>

              <p>
                Built with ❤️ for job seekers worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Offer N Hire. All rights reserved.
          </p>

          <p>
            Secure payments powered by Stripe.
          </p>
        </div>
      </div>
    </footer>
  );
}