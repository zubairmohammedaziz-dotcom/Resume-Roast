import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | OffernHire",
  description: "Terms and Conditions governing the use of OffernHire.",
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
          Last updated: November 24, 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using OffernHire, you agree to these Terms
              & Conditions and our Privacy Policy. If you do not agree,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">2. Our Services</h2>
            <p className="mt-3">
              OffernHire provides online career-support tools, including
              resume analysis, resume tailoring, job matching,
              cover-letter generation and interview preparation.
              Features may change or be updated over time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">3. Accounts and Eligibility</h2>
            <p className="mt-3">
              You must provide accurate information when creating or
              accessing an account. You are responsible for maintaining
              the security of your account and all activity carried out
              through it. You must not use another person's account
              without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">4. Free and Paid Plans</h2>
            <p className="mt-3">
              OffernHire may offer free and paid features. Free usage
              limits and Pro plan benefits are displayed on the website
              or during checkout. Free resume analysis is limited to
              one successful analysis per account. Pro subscribers
              receive access to the paid features described at the
              time of purchase, subject to an active subscription and
              applicable usage terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">5. Subscriptions and Payments</h2>
            <p className="mt-3">
              Paid plans are billed at the price and frequency shown
              during checkout. Payments are processed through Razorpay
              and its supported payment partners. Subscriptions may
              renew automatically where recurring billing has been
              authorised during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">6. Cancellation and Refunds</h2>
            <p className="mt-3">
              You may request cancellation to prevent future subscription
              renewals. Access may continue until the end of the current
              paid billing period, where applicable. Refund requests are
              handled under our Refund Policy and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7. AI-Generated Content</h2>
            <p className="mt-3">
              Our tools may use AI to generate resume feedback,
              recommendations and other career-related content.
              AI-generated results may contain errors or omissions.
              You are responsible for reviewing and verifying all
              content before relying on it or submitting it to an employer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">8. No Employment Guarantee</h2>
            <p className="mt-3">
              OffernHire does not guarantee interviews, job offers,
              employment, salary outcomes, recruiter responses or
              acceptance by an employer or applicant-tracking system.
              Hiring decisions are made by employers and recruiters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">9. User Responsibilities</h2>
            <p className="mt-3">
              You must ensure that the resumes, documents and other
              information you upload or provide are accurate and that
              you have the right to share them. You must not upload
              unlawful, misleading, malicious or unauthorised content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">10. Prohibited Use</h2>
            <p className="mt-3">
              You must not misuse the platform, bypass usage limits,
              interfere with its security, attempt unauthorised access,
              impersonate another person or use the service for
              fraudulent or unlawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">11. Third-Party Services and Job Listings</h2>
            <p className="mt-3">
              Job listings and certain features may be provided through
              third-party services. OffernHire does not control
              third-party websites, job availability, employer
              information, application processes or hiring decisions.
              Your use of third-party services may be subject to
              their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">12. Intellectual Property</h2>
            <p className="mt-3">
              The OffernHire name, branding, website, software,
              interface and platform content belong to OffernHire
              or its respective rights holders and are protected
              by applicable laws. You retain ownership of the
              original content you upload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">13. Service Availability and Changes</h2>
            <p className="mt-3">
              We aim to keep the platform available but do not guarantee
              uninterrupted access. We may update, modify, suspend or
              discontinue features, usage limits or pricing where
              reasonably necessary, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">14. Limitation of Liability</h2>
            <p className="mt-3">
              To the extent permitted by applicable law, OffernHire
              is not responsible for indirect or consequential losses
              arising from the use of the platform. Nothing in these
              Terms excludes liability or consumer rights that cannot
              lawfully be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">15. Suspension or Termination</h2>
            <p className="mt-3">
              We may restrict or suspend access where we reasonably
              identify fraud, misuse, security risks or material
              violations of these Terms, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">16. Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of India, subject
              to applicable consumer-protection laws and the jurisdiction
              of competent courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">17. Contact and Grievances</h2>
            <p className="mt-3">
              For questions or complaints about these Terms, contact:
            </p>
            <p className="mt-3">
              <strong className="text-white">OffernHire Team</strong>
              <br />
              Hyderabad, Telangana, India
              <br />
              Email:{" "}
              <a
                href="mailto:team@offernhire.com"
                className="font-semibold text-orange-400 transition hover:text-orange-300"
              >
                team@offernhire.com
              </a>
            </p>
            <p className="mt-3">
              We aim to acknowledge consumer grievances within 48 hours
              and address them within one month, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">18. Updates to These Terms</h2>
            <p className="mt-3">
              We may update these Terms when our services, business
              practices or legal requirements change. The latest version
              and its effective date will be published on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
