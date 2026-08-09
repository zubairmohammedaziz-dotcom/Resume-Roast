import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact OffernHire",
  description: "Get in touch with the OffernHire team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
          Contact OffernHire
        </p>

        <h1 className="mt-5 text-4xl font-black sm:text-6xl">
          We’re here to help.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Have a question, feedback, or need help with your OffernHire
          experience? Reach out to our team.
        </p>

        <a
          href="mailto:team@offernhire.com"
          className="mt-10 inline-flex rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-black hover:bg-orange-400"
        >
          Email OffernHire →
        </a>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-400 hover:text-orange-400"
          >
            ← Back to OffernHire
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
