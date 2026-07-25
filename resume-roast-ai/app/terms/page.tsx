import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | OffernHire",
  description:
    "Terms and Conditions governing the use of OffernHire.",
};

export default function TermsPage() {
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
              By accessing or using OffernHire, you agree to these Terms
              & Conditions. If you do not agree with these terms, you
              should not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Service description
            </h2>

            <p className="mt-3">
              OffernHire provides AI-assisted resume analysis, resume
              tailoring, job matching, cover-letter generation,
              interview preparation and related career-support
              features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. No employment guarantee
            </h2>

            <p className="mt-3">
              OffernHire does not guarantee interviews, job offers,
              employment, salary outcomes, recruiter responses or
              acceptance by an employer or applicant-tracking system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. User responsibilities
            </h2>

            <p className="mt-3">
              You are responsible for reviewing and verifying all
              generated content before using it. Resumes, cover
              letters, application documents and job-related
              information must remain truthful, accurate and
              appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Prohibited use
            </h2>

            <p className="mt-3">
              You may not misuse the service, bypass access or usage
              limits, interfere with platform security, upload unlawful
              or malicious content, impersonate another person,
              automate unauthorized access or use OffernHire for
              fraudulent purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Accounts and access
            </h2>

            <p className="mt-3">
              You are responsible for maintaining the security of your
              account and for activity conducted through it. We may
              restrict or suspend access where misuse, fraud, security
              risks or material violations of these terms are
              identified.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Subscriptions and billing
            </h2>

            <p className="mt-3">
              Paid plans are billed according to the price and billing
              cycle displayed during checkout. Subscription payments
              are processed through Razorpay. Recurring subscriptions
              may renew automatically until cancelled, subject to the
              payment method and authorization provided during
              checkout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Cancellation
            </h2>

            <p className="mt-3">
              You may request cancellation of an active subscription.
              Cancellation prevents future renewal charges, while paid
              access may continue until the end of the current billing
              period, where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              9. AI-generated content
            </h2>

            <p className="mt-3">
              AI-generated content may contain inaccuracies, omissions
              or unsuitable recommendations. You should independently
              review, edit and verify all outputs before relying on them
              or submitting them to an employer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              10. Third-party services and job listings
            </h2>

            <p className="mt-3">
              OffernHire may display information or links supplied by
              third-party providers. We do not control third-party
              websites, job availability, employer information,
              application processes or hiring decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              11. Intellectual property
            </h2>

            <p className="mt-3">
              The OffernHire website, branding, software, interface,
              design and platform content are protected by applicable
              intellectual-property laws. You retain ownership of the
              original content you upload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              12. Availability and changes
            </h2>

            <p className="mt-3">
              We may modify, suspend or discontinue parts of the
              service, features, usage limits or pricing. We may also
              update these terms when reasonably necessary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              13. Limitation of liability
            </h2>

            <p className="mt-3">
              To the maximum extent permitted by applicable law,
              OffernHire will not be liable for indirect, incidental,
              special or consequential losses resulting from your use
              of, or inability to use, the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              14. Contact
            </h2>

            <p className="mt-3">
              Questions about these terms may be sent to{" "}
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