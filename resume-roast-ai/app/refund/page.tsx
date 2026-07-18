import Link from "next/link";

export const metadata = {
  title: "Refund Policy | Resume Roast AI",
  description: "Refund Policy for Resume Roast AI.",
};

export default function RefundPage() {
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
          Refund Policy
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Last updated: July 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">
              1. Subscription payments
            </h2>
            <p className="mt-3">
              Resume Roast AI Pro is a digital subscription service. Payments
              provide immediate access to paid features and are generally
              non-refundable once the subscription period has started.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Duplicate or incorrect charges
            </h2>
            <p className="mt-3">
              If you believe you were charged more than once or charged an
              incorrect amount, contact us within seven days of the transaction.
              We will review the payment and issue a refund where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. Technical issues
            </h2>
            <p className="mt-3">
              If a verified technical issue prevents you from accessing paid
              features for a significant period, contact support with the
              relevant account and payment details. We may provide a refund,
              service credit or subscription extension after reviewing the
              issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Change of mind
            </h2>
            <p className="mt-3">
              Refunds are not normally provided for change of mind, failure to
              cancel before renewal, dissatisfaction with AI-generated output or
              unsuccessful job applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Cancellation
            </h2>
            <p className="mt-3">
              You may cancel your subscription at any time. Cancellation stops
              future renewal charges, while access may continue until the end
              of the current paid billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Refund processing
            </h2>
            <p className="mt-3">
              Approved refunds are returned to the original payment method.
              Processing times depend on Stripe, your bank and the payment
              method used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Contact
            </h2>
            <p className="mt-3">
              To request a billing review, contact support@resumeroast.ai and
              include your account email, payment date and a brief explanation
              of the issue.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}