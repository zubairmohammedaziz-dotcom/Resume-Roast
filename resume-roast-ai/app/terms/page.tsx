import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Resume Roast AI",
  description: "Terms and Conditions for Resume Roast AI.",
};

export default function TermsPage() {
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
          Terms & Conditions
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Last updated: July 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">
              1. Acceptance of terms
            </h2>
            <p className="mt-3">
              By accessing or using Resume Roast AI, you agree to these Terms &
              Conditions. If you do not agree, you should not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Service description
            </h2>
            <p className="mt-3">
              Resume Roast AI provides AI-assisted resume analysis, resume
              tailoring, job matching, cover-letter generation, interview
              preparation and related career-support features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. No employment guarantee
            </h2>
            <p className="mt-3">
              Resume Roast AI does not guarantee interviews, job offers,
              employment, salary outcomes or acceptance by any employer or
              applicant-tracking system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. User responsibilities
            </h2>
            <p className="mt-3">
              You are responsible for reviewing all generated content before
              using it. You must ensure that resumes, cover letters and job
              applications remain truthful, accurate and appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Prohibited use
            </h2>
            <p className="mt-3">
              You may not misuse the service, attempt to bypass access limits,
              interfere with platform security, upload unlawful content,
              impersonate another person or use the service for fraudulent
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Subscriptions and billing
            </h2>
            <p className="mt-3">
              Paid plans are billed according to the price and billing cycle
              displayed at checkout. Subscriptions may renew automatically
              until cancelled. Applicable taxes may be added where required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. AI-generated content
            </h2>
            <p className="mt-3">
              AI-generated content may contain inaccuracies or omissions. You
              should independently review, edit and verify all outputs before
              submitting them to an employer or relying on them professionally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Intellectual property
            </h2>
            <p className="mt-3">
              The Resume Roast AI website, branding, software, design and
              platform content are protected by applicable intellectual
              property laws. You retain ownership of the original content you
              upload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              9. Availability and changes
            </h2>
            <p className="mt-3">
              We may modify, suspend or discontinue parts of the service,
              features or pricing. We may also update these terms when
              reasonably necessary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              10. Limitation of liability
            </h2>
            <p className="mt-3">
              To the maximum extent permitted by law, Resume Roast AI will not
              be liable for indirect, incidental, special or consequential
              losses resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              11. Contact
            </h2>
            <p className="mt-3">
              Questions about these terms may be sent to
              support@resumeroast.ai.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}