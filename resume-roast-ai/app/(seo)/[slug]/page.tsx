import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type SEOPage = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  benefits: string[];
  keyword: string;
};

const pages: Record<string, SEOPage> = {
  "ats-resume-checker": {
    title: "Free ATS Resume Checker India",
    description:
      "Check your resume ATS score, keywords, formatting and recruiter readiness instantly with OffernHire.",
    heading: "Free ATS Resume Checker for Indian Job Seekers",
    intro:
      "Discover whether your resume can pass applicant tracking systems before you apply.",
    benefits: [
      "Instant ATS compatibility score",
      "Missing keyword identification",
      "Recruiter-focused feedback",
      "Actionable resume improvements",
    ],
    keyword: "ATS resume checker",
  },

  "resume-score-checker": {
    title: "Free Resume Score Checker",
    description:
      "Get an instant resume score with AI-powered ATS and recruiter feedback.",
    heading: "Check Your Resume Score Instantly",
    intro:
      "See how effectively your resume communicates your skills, experience and achievements.",
    benefits: [
      "ATS score",
      "Recruiter score",
      "Strength and weakness analysis",
      "Personalized recommendations",
    ],
    keyword: "resume score checker",
  },

  "ai-resume-analyzer": {
    title: "Free AI Resume Analyzer",
    description:
      "Analyze your resume using AI and receive ATS feedback, recruiter insights and improvement suggestions.",
    heading: "AI Resume Analyzer Built to Improve Your Shortlisting Chances",
    intro:
      "Upload your resume and receive detailed feedback within minutes.",
    benefits: [
      "Resume structure analysis",
      "Experience and skills evaluation",
      "Improved bullet-point suggestions",
      "Relevant job recommendations",
    ],
    keyword: "AI resume analyzer",
  },

  "resume-review": {
    title: "Free AI Resume Review",
    description:
      "Get an honest AI resume review with recruiter feedback and practical improvements.",
    heading: "Get an Honest Review of Your Resume",
    intro:
      "Understand what recruiters may notice, question or reject when reviewing your resume.",
    benefits: [
      "Recruiter-style review",
      "Clear improvement priorities",
      "Weak content identification",
      "Stronger professional positioning",
    ],
    keyword: "AI resume review",
  },

  "resume-roast": {
    title: "Free AI Resume Roast",
    description:
      "Get direct and honest feedback about the mistakes weakening your resume.",
    heading: "Let AI Roast Your Resume Before Recruiters Do",
    intro:
      "Find vague claims, weak bullet points, missing achievements and other issues hurting your applications.",
    benefits: [
      "Direct resume criticism",
      "Weak statement detection",
      "Achievement improvement ideas",
      "Practical rewriting guidance",
    ],
    keyword: "resume roast",
  },

  "resume-tailor": {
    title: "AI Resume Tailor for Job Applications",
    description:
      "Tailor your resume to specific job descriptions using AI and improve relevance.",
    heading: "Tailor Your Resume for Every Job",
    intro:
      "Create a more relevant application by aligning your resume with the role you want.",
    benefits: [
      "Job-description matching",
      "Tailored professional summary",
      "Relevant skills optimization",
      "Stronger experience bullet points",
    ],
    keyword: "AI resume tailor",
  },

  "ai-cover-letter-generator": {
    title: "Free AI Cover Letter Generator India",
    description:
      "Generate personalized and role-specific cover letters using AI.",
    heading: "Create a Personalized Cover Letter in Minutes",
    intro:
      "Turn your resume and target job description into a focused cover letter.",
    benefits: [
      "Role-specific content",
      "Professional structure",
      "Personalized experience highlights",
      "Faster job applications",
    ],
    keyword: "AI cover letter generator",
  },

  "interview-questions-by-role": {
    title: "AI Interview Questions by Job Role",
    description:
      "Prepare with personalized interview questions based on your target role and experience.",
    heading: "Practice Interview Questions for Your Target Role",
    intro:
      "Prepare for likely recruiter, behavioural and role-specific questions.",
    benefits: [
      "Role-based questions",
      "Experience-specific preparation",
      "Behavioural interview practice",
      "Suggested answer guidance",
    ],
    keyword: "interview questions by role",
  },

  "resume-keyword-scanner": {
    title: "Free Resume Keyword Scanner",
    description:
      "Find missing resume keywords and improve alignment with your target job description.",
    heading: "Find the Keywords Missing From Your Resume",
    intro:
      "Compare your resume against job requirements and identify important gaps.",
    benefits: [
      "Missing skill detection",
      "Job-description comparison",
      "ATS keyword recommendations",
      "Improved role relevance",
    ],
    keyword: "resume keyword scanner",
  },

  "ai-resume-builder": {
    title: "AI Resume Builder for Indian Job Seekers",
    description:
      "Improve and optimize your resume using AI-powered writing and recruiter insights.",
    heading: "Build a Stronger Resume With AI",
    intro:
      "Improve your summary, experience, skills and overall positioning without starting from scratch.",
    benefits: [
      "Improved professional summary",
      "Achievement-focused bullet points",
      "Optimized skills section",
      "ATS-friendly recommendations",
    ],
    keyword: "AI resume builder",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://www.offernhire.com/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://www.offernhire.com/${slug}`,
      siteName: "OffernHire",
      type: "website",
    },
  };
}

export default async function SEOPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
          OffernHire AI Career Copilot
        </p>

        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          {page.heading}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          {page.intro}
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500"
        >
          Analyze My Resume Free
        </Link>

        <p className="mt-4 text-sm text-gray-400">
          One free resume analysis daily. No credit card required.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold">
          What You Will Receive
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {page.benefits.map((benefit) => (
            <article
              key={benefit}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-xl font-semibold">{benefit}</h3>
              <p className="mt-3 leading-7 text-gray-400">
                OffernHire provides practical, personalized insights you can
                apply before submitting your next job application.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold">
          How Our {page.keyword} Works
        </h2>

        <div className="mt-8 space-y-5">
          {[
            "Upload your current resume.",
            "OffernHire analyzes your skills, experience and resume content.",
            "Review your scores, weaknesses and personalized recommendations.",
            "Improve or tailor your resume before applying.",
          ].map((step, index) => (
            <div
              key={step}
              className="flex gap-4 rounded-2xl border border-white/10 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold">
                {index + 1}
              </span>
              <p className="pt-1 text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-500/30 bg-purple-500/10 px-6 py-14">
          <h2 className="text-3xl font-bold">
            Improve Your Resume Before Your Next Application
          </h2>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500"
          >
            Check My Resume Free
          </Link>
        </div>
      </section>
    </main>
  );
}