import Link from "next/link";

export const metadata = {
  title: "FAQ | Resume Roast AI",
  description: "Frequently asked questions about Resume Roast AI.",
};

const faqs = [
  {
    question: "What does Resume Roast AI do?",
    answer:
      "Resume Roast AI analyzes your resume, scores it for ATS and recruiter readiness, identifies weaknesses, suggests improvements, matches you with relevant jobs and helps tailor your resume for specific roles.",
  },
  {
    question: "Is Resume Roast AI free?",
    answer:
      "Yes. The Free plan includes limited resume analysis and basic feedback. Pro unlocks resume tailoring, cover letters, premium PDF export, additional job matches, history and other advanced features.",
  },
  {
    question: "Does Resume Roast AI guarantee interviews or job offers?",
    answer:
      "No. The platform helps improve your application quality, but hiring outcomes depend on factors such as your experience, job market conditions, employer requirements and interview performance.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "We use trusted service providers for hosting, authentication, AI processing, payments and storage. You should avoid uploading unnecessary highly sensitive information such as government identification numbers or banking details.",
  },
  {
    question: "Will Resume Roast AI invent experience or achievements?",
    answer:
      "The product is designed to work from the information you provide and improve positioning without fabricating facts. You are still responsible for reviewing all output before using it.",
  },
  {
    question: "Can I cancel Pro anytime?",
    answer:
      "Yes. You may cancel your subscription at any time. Access may continue until the end of the current paid billing period, and future renewals will stop.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Payments are generally non-refundable once access begins. Refunds may be considered for duplicate charges, incorrect billing or verified technical issues. Please review the Refund Policy for details.",
  },
  {
    question: "How are payments processed?",
    answer:
      "Payments are processed securely through Stripe. Resume Roast AI does not directly store your complete card details.",
  },
  {
    question: "Can I use the tailored resume without checking it?",
    answer:
      "You should always review and verify every tailored resume, cover letter and recommendation before submitting it to an employer.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact us at support@resumeroast.ai for account, billing, privacy or technical support.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-300">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-orange-400 hover:text-orange-300"
        >
          ← Back to Resume Roast AI
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-400">
            Help Center
          </p>

          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
            Everything you need to know before analyzing, tailoring or
            upgrading your resume.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-5 open:border-orange-500/30 open:bg-orange-500/[0.04]"
            >
              <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                {faq.question}
              </summary>

              <p className="mt-4 leading-7 text-zinc-400">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-6">
          <h2 className="text-lg font-bold text-white">Still need help?</h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Contact us at support@resumeroast.ai and include your account email
            and a clear description of the issue.
          </p>
        </div>
      </div>
    </main>
  );
}