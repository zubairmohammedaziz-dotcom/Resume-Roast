import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | OffernHire",
  description:
    "Learn how OffernHire collects, processes, stores and protects user information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-300">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-orange-400 transition hover:text-orange-300"
        >
          ← Back to OffernHire
        </Link>

        <h1 className="mt-8 text-4xl font-black text-white">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Last updated: July 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">
              1. Information we collect
            </h2>

            <p className="mt-3">
              We may collect your name, email address, account
              information, uploaded resume content, job descriptions,
              usage information and subscription status when you use
              OffernHire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. How we use your information
            </h2>

            <p className="mt-3">
              We use your information to provide resume analysis, job
              matching, resume tailoring, cover-letter generation,
              interview preparation, account support, product
              improvement, fraud prevention and subscription
              management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. Resume and document data
            </h2>

            <p className="mt-3">
              Resume and job-description content is processed to provide
              the career services you request. You should not upload
              unnecessary highly sensitive information, including
              passwords, financial account details, government
              identification numbers or confidential third-party data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Third-party services
            </h2>

            <p className="mt-3">
              We may use trusted third-party providers for
              authentication, hosting, artificial intelligence,
              analytics, database services, job data and payments.
              These providers may include Google, OpenAI, Supabase,
              Vercel, Razorpay and job-search or analytics providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Payments
            </h2>

            <p className="mt-3">
              Payments and subscription transactions are processed by
              Razorpay and its supported payment partners. OffernHire
              does not directly store your complete card, bank-account
              or UPI credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Local browser storage
            </h2>

            <p className="mt-3">
              Some product information, including resume-analysis
              history, saved opportunities, usage limits and plan
              status, may be stored in your browser using local or
              session storage. Clearing browser data may remove locally
              stored information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Data retention and deletion
            </h2>

            <p className="mt-3">
              We retain information only for as long as reasonably
              necessary to operate the service, comply with legal
              obligations, prevent fraud and resolve disputes. You may
              request deletion of eligible account information by
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Security
            </h2>

            <p className="mt-3">
              We use reasonable technical and organizational safeguards
              designed to protect user information. However, no online
              service, transmission method or storage system can
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              9. Your responsibilities
            </h2>

            <p className="mt-3">
              You are responsible for reviewing documents before
              uploading them and for ensuring that you have permission
              to process any information belonging to another person.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              10. Policy updates
            </h2>

            <p className="mt-3">
              We may update this policy when our services, providers or
              legal obligations change. The latest version will be
              published on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              11. Contact
            </h2>

            <p className="mt-3">
              For privacy questions or eligible deletion requests,
              contact{" "}
              <a
                href="mailto:team@offernhire.com"
                className="font-semibold text-orange-400 transition hover:text-orange-300"
              >
                team@offernhire.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}