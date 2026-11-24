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
          Last updated: November 24, 2026
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">
              1. Digital Subscription Service
            </h2>
            <p className="mt-3">
              OffernHire Pro is a digital subscription service. Payments
              provide access to paid features during the applicable billing
              period. Once paid access has started, subscription payments
              are generally non-refundable, except where a refund or other
              remedy is required under applicable law or approved under
              this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              2. Duplicate or Incorrect Charges
            </h2>
            <p className="mt-3">
              If you believe you were charged more than once or charged an
              incorrect amount, contact us with your transaction details.
              We will review verified claims and arrange an appropriate
              correction or refund where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              3. Technical Access Issues
            </h2>
            <p className="mt-3">
              If a technical issue prevents you from accessing paid
              features, contact us with your account email and a
              description of the issue. We will investigate and may offer
              a resolution such as restored access, a subscription
              extension or a refund, depending on the circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              4. Change of Mind and Hiring Outcomes
            </h2>
            <p className="mt-3">
              Refunds are generally not provided for change of mind,
              failure to cancel before renewal, dissatisfaction with
              AI-generated content, unsuccessful job applications,
              employer decisions or failure to secure an interview or
              job offer. This does not limit any rights or remedies
              available under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              5. Cancellation
            </h2>
            <p className="mt-3">
              You may request cancellation of an active subscription
              through the available subscription options or by contacting
              team@offernhire.com. Cancellation is intended to prevent
              future renewal charges. Where applicable, paid access may
              continue until the end of the current billing period.
              Cancellation does not automatically result in a refund
              for the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              6. Refund Review
            </h2>
            <p className="mt-3">
              Refund requests are reviewed individually. We may request
              information needed to verify your account, transaction and
              reported issue. Nothing in this policy excludes refunds
              or remedies required under applicable consumer-protection
              laws, including where a service is deficient or materially
              different from what was offered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              7. Refund Processing
            </h2>
            <p className="mt-3">
              Approved refunds will generally be returned to the original
              payment method through Razorpay or the relevant payment
              provider. The time taken may vary depending on the payment
              provider, bank and payment method. Refunds will be processed
              within the period required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              8. Contact and Grievances
            </h2>
            <p className="mt-3">
              For billing questions, cancellation requests or refund
              reviews, contact:
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
        </div>
      </div>
    </main>
  );
}
