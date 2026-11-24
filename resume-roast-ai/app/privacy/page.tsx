import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | OffernHire",
  description:
    "Learn how OffernHire collects, uses, processes and protects personal information.",
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
          Last updated: November 24, 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p className="mt-3">
              OffernHire ("we", "our" or "us") respects your privacy.
              This Privacy Policy explains how OffernHire collects,
              uses, processes, stores and shares personal information
              when you visit www.offernhire.com or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Information We Collect
            </h2>
            <p className="mt-3">Depending on how you use our services, we may collect:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Name, email address and account information.</li>
              <li>Resume files, filenames and information contained in uploaded resumes.</li>
              <li>Job descriptions and other information you provide.</li>
              <li>Resume analysis activity, usage records and subscription status.</li>
              <li>Payment confirmations and transaction-related details.</li>
              <li>Technical information such as browser, device and website usage data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. How We Use Your Information
            </h2>
            <p className="mt-3">We use information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide resume analysis and career-related services.</li>
              <li>Generate resume insights, job matches and interview preparation material.</li>
              <li>Manage accounts, subscriptions and usage limits.</li>
              <li>Provide customer support and respond to enquiries.</li>
              <li>Maintain security, prevent misuse and improve our services.</li>
              <li>Meet applicable legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Resume Processing and AI Services
            </h2>
            <p className="mt-3">
              When you upload a resume for analysis, its contents and
              filename are sent to OpenAI through its API to generate
              the requested results.
            </p>
            <p className="mt-3">
              Our current application saves resume-analysis reports
              in your browser's local storage for future reference.
              These reports may contain extracted personal and
              professional information. They are not currently
              maintained as account-based reports on our servers.
            </p>
            <p className="mt-3">
              We do not currently upload original resume files to
              Supabase Storage through the resume-analysis process
              reviewed for this policy. OpenAI processes submitted
              information under its applicable API terms and data
              retention practices.
            </p>
            <p className="mt-3">
              Please avoid uploading unnecessary sensitive information,
              such as passwords, financial account details, government
              identification numbers or confidential information
              belonging to others.
            </p>
            <p className="mt-3">
              AI-generated results may contain inaccuracies and should
              be reviewed before you rely on them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Third-Party Service Providers
            </h2>
            <p className="mt-3">
              We use third-party providers to operate our services.
              These may include:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Google for account authentication and analytics.</li>
              <li>OpenAI for AI-powered resume processing.</li>
              <li>Supabase for database and account-related usage records.</li>
              <li>Vercel for website hosting and infrastructure.</li>
              <li>Razorpay for payment collection and subscription billing.</li>
              <li>Adzuna and other job-data providers for job listings.</li>
            </ul>
            <p className="mt-3">
              These providers may process information under their own
              privacy policies and service terms. Information may be
              processed outside India depending on the provider and
              service configuration, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Payments and Subscriptions
            </h2>
            <p className="mt-3">
              Payments and subscription transactions are handled by
              Razorpay and its supported payment partners. OffernHire
              does not directly store complete card numbers, UPI
              credentials or banking passwords. We may receive
              payment confirmations, subscription status and
              transaction-related information needed to manage
              your account and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Browser Storage, Cookies and Analytics
            </h2>
            <p className="mt-3">
              OffernHire uses browser local storage to save
              resume-analysis reports for future reference. These
              reports may include resume filenames, analysis dates
              and extracted resume information. Clearing browser
              storage or website data may remove these reports.
            </p>
            <p className="mt-3">
              We use Google Analytics to understand website traffic
              and usage and improve our services. Google Analytics
              may use cookies or similar technologies to collect
              information such as page visits, interactions,
              browser and device information.
            </p>
            <p className="mt-3">
              You can manage or delete cookies through your browser
              settings. Blocking cookies may affect certain website
              features. Where consent is required by applicable law,
              we will seek it through an appropriate mechanism.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Data Retention and Deletion
            </h2>
            <p className="mt-3">
              We retain personal information only for as long as
              reasonably necessary to provide our services, maintain
              account and subscription records, prevent misuse,
              resolve disputes and meet applicable legal obligations.
            </p>
            <p className="mt-3">
              Resume-analysis reports currently saved in your browser
              remain there until the relevant browser storage is
              cleared. Users can clear this information through
              their browser settings.
            </p>
            <p className="mt-3">
              You may request access to, correction of or deletion
              of eligible personal information by emailing
              team@offernhire.com. Requests will be reviewed and
              handled subject to identity verification and applicable
              legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              9. Data Security
            </h2>
            <p className="mt-3">
              We use reasonable technical and organisational
              safeguards designed to protect personal information
              against unauthorised access, disclosure, alteration
              or misuse. However, no online service or storage
              system can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              10. Your Responsibilities
            </h2>
            <p className="mt-3">
              You are responsible for ensuring that you have the
              right to upload and share any resume, job description
              or third-party information you provide. Please review
              documents before uploading them and avoid sharing
              unnecessary sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              11. Third-Party Websites
            </h2>
            <p className="mt-3">
              Our website may link to external job portals,
              employers and other services. We do not control
              their content or privacy practices. Please review
              their policies before sharing information with them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              12. Policy Updates
            </h2>
            <p className="mt-3">
              We may update this policy when our services, data
              practices, providers or legal obligations change.
              The latest version will be published on this page
              with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              13. Contact and Grievances
            </h2>
            <p className="mt-3">
              For privacy questions, personal-data requests or
              grievances, contact:
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
          </section>
        </div>
      </div>
    </main>
  );
}
