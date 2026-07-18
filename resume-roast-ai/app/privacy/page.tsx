import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Resume Roast AI",
  description: "Privacy Policy for Resume Roast AI.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-300">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-orange-400 hover:text-orange-300"
        >
          ← Back to Resume Roast AI
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
              We may collect your name, email address, account information,
              uploaded resume content, job descriptions, usage data and payment
              status when you use Resume Roast AI.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. How we use your information
            </h2>
            <p className="mt-3">
              We use your information to provide resume analysis, job matching,
              resume tailoring, account support, product improvement, fraud
              prevention and subscription management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. Resume and document data
            </h2>
            <p className="mt-3">
              Resume content is processed only to provide the requested career
              services. Do not upload confidential, highly sensitive or
              unnecessary personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Third-party services
            </h2>
            <p className="mt-3">
              We may use third-party providers for authentication, hosting,
              artificial intelligence, analytics, job data and payments,
              including services such as Google, OpenAI, Supabase, Vercel,
              Stripe and job-search providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Payments
            </h2>
            <p className="mt-3">
              Payment information is processed by Stripe. Resume Roast AI does
              not directly store your complete card details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Data retention and deletion
            </h2>
            <p className="mt-3">
              We retain information only for as long as reasonably necessary
              to operate the service, meet legal obligations and resolve
              disputes. You may request deletion of your account and associated
              data by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Security
            </h2>
            <p className="mt-3">
              We use reasonable technical and organizational safeguards, but no
              internet service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Contact
            </h2>
            <p className="mt-3">
              For privacy questions or deletion requests, contact us at
              support@resumeroast.ai.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}