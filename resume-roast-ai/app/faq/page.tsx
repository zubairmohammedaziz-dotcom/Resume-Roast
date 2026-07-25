import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center & FAQ | OffernHire",
  description:
    "Frequently asked questions about OffernHire resume analysis, job matching, subscriptions and privacy.",
};

const faqs = [
  {
    question: "What does OffernHire do?",
    answer:
      "OffernHire analyzes your resume, estimates ATS and recruiter readiness, identifies improvement areas, suggests stronger content, recommends relevant opportunities and helps tailor your application for specific roles.",
  },
  {
    question: "Is OffernHire free?",
    answer:
      "Yes. OffernHire includes a Free plan with limited usage. The Pro plan unlocks additional resume analyses, job matches, resume tailoring, cover letters, interview preparation and other premium features subject to the plan shown on the pricing page.",
  },
  {
    question: "Does OffernHire guarantee interviews or job offers?",
    answer:
      "No. OffernHire helps improve application quality, but hiring outcomes depend on your qualifications, experience, job-market conditions, employer requirements, competition and interview performance.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "OffernHire uses trusted providers for hosting, authentication, AI processing, database services and payments. You should avoid uploading unnecessary highly sensitive information such as passwords, banking details or government identification numbers.",
  },
  {
    question: "Will OffernHire invent experience or achievements?",
    answer:
      "OffernHire is designed to improve the presentation of information you provide without intentionally fabricating facts. You remain responsible for reviewing and verifying all generated content before using it.",
  },
  {
    question: "Where is my resume history stored?",
    answer:
      "Some resume reports and saved opportunities may currently be stored in your browser. Clearing browser data or using another browser or device may remove or prevent access to locally stored history.",
  },
  {
    question: "Can I cancel Pro?",
    answer:
      "Yes. You may request cancellation of your subscription to prevent future renewal charges. Where applicable, access may continue until the end of the current paid billing period.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Payments are generally non-refundable after paid access begins. Billing reviews may be considered for duplicate charges, incorrect billing or verified technical access issues. Please review the Refund Policy for complete details.",
  },
  {
    question: "How are payments processed?",
    answer:
      "Payments are processed securely through Razorpay and its supported payment partners. OffernHire does not directly store your complete card, bank-account or UPI credentials.",
  },
  {
    question: "Can I submit generated content without checking it?",
    answer:
      "No. You should always review, edit and verify every tailored resume, cover letter, interview answer and recommendation before submitting or using it professionally.",
  },
  {
    question: "Are the job listings controlled by OffernHire?",
    answer:
      "No. Job information and application links may come from third-party providers. Availability, employer details, application requirements and hiring decisions are controlled by the relevant third party or employer.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact the OffernHire Team at team@offernhire.com for account, subscription, privacy, billing or technical-support questions.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-300">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-orange-400 transition hover:text-orange-300"
        >
          ← Back to OffernHire
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-400">
            Help Center
          </p>

          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
            Learn how OffernHire analyzes resumes, recommends
            opportunities, processes subscriptions and protects your
            information.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-5 transition open:border-orange-500/30 open:bg-orange-500/[0.04]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-white">
                <span>{faq.question}</span>

                <span
                  aria-hidden="true"
                  className="text-xl font-normal text-orange-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-white/[0.07] pt-4 leading-7 text-zinc-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-6">
          <h2 className="text-lg font-bold text-white">
            Still need help?
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Contact{" "}
            <a
              href="mailto:team@offernhire.com"
              className="font-semibold text-orange-400 transition hover:text-orange-300"
            >
              team@offernhire.com
            </a>{" "}
            and include your account email and a clear description of
            the issue.
          </p>
        </div>
      </div>
    </main>
  );
}