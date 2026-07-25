import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | OffernHire",
  description:
    "Read the OffernHire refund, cancellation and billing-review policy.",
};

export default function RefundPage() {
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
          Refund Policy
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Last updated: July 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">
              1. Digital subscription service
            </h2>

            <p className="mt-3">
              OffernHire Pro is a digital subscription service.
              Subscription payments provide access to paid features
              during the applicable billing period and are generally
              non-refundable after paid access has started.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Duplicate or incorrect charges
            </h2>

            <p className="mt-3">
              If you believe you were charged more than once or charged
              an incorrect amount, contact us within seven days of the
              transaction. We will review the payment record and provide
              an appropriate resolution where the claim is verified.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. Technical access issues
            </h2>

            <p className="mt-3">
              If a verified technical issue prevents you from accessing
              paid features for a significant period, contact us with
              your account email, payment information and a description
              of the issue. Depending on the circumstances, we may
              provide a refund, service credit or subscription
              extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Change of mind and hiring outcomes
            </h2>

            <p className="mt-3">
              Refunds are not normally provided for change of mind,
              failure to cancel before renewal, dissatisfaction with
              AI-generated output, unsuccessful job applications,
              employer decisions or failure to secure an interview or
              job offer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Cancellation
            </h2>

            <p className="mt-3">
              You may cancel an active subscription to prevent future
              renewal charges. Where applicable, access may continue
              until the end of the current paid billing period.
              Cancellation does not automatically create a refund for
              the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Refund review
            </h2>

            <p className="mt-3">
              Refund requests are reviewed individually. We may ask for
              additional information required to verify the account,
              transaction and reported issue before making a decision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Refund processing
            </h2>

            <p className="mt-3">
              Approved refunds are returned to the original payment
              method through Razorpay. Processing time may vary
              depending on Razorpay, the issuing bank, the payment
              method and applicable banking procedures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Contact
            </h2>

            <p className="mt-3">
              To request a billing review, email{" "}
              <a
                href="mailto:team@offernhire.com"
                className="font-semibold text-orange-400 transition hover:text-orange-300"
              >
                team@offernhire.com
              </a>{" "}
              and include your account email, payment date, transaction
              reference where available and a clear explanation of the
              issue.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}