import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type UnknownRecord = Record<string, unknown>;

type CoverLetterTone =
  | "professional"
  | "confident"
  | "executive"
  | "warm";

type CoverLetterOutput = {
  coverLetter: string;
  subjectLine: string;
  openingHook: string;
  keyStrengths: string[];
  qualityScore: number;
};

const coverLetterSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverLetter: { type: "string" },
    subjectLine: { type: "string" },
    openingHook: { type: "string" },
    keyStrengths: {
      type: "array",
      items: { type: "string" },
    },
    qualityScore: { type: "number" },
  },
  required: [
    "coverLetter",
    "subjectLine",
    "openingHook",
    "keyStrengths",
    "qualityScore",
  ],
} as const;

const COVER_LETTER_INSTRUCTIONS = `
You are an elite human cover-letter writer, executive recruiter and hiring
communications specialist.

Write a premium, truthful and role-specific cover letter that sounds individually
written by an experienced professional. It must not sound like an AI template.

SOURCE OF TRUTH
Candidate evidence and the supplied tailored-resume context are the only sources
of candidate facts.

Never invent or infer unsupported:
- employers, job titles, dates, promotions or locations
- degrees, certifications, projects or tools
- metrics, revenue, percentages, volume, team size or achievements
- responsibilities, domain expertise or years of experience
- the employer's products, culture, strategy or recent activities

A requirement in the job description is not evidence that the candidate has it.
Do not hide genuine gaps with vague claims.

LETTER STANDARD
- Write 230 to 300 words.
- Use four or five short paragraphs.
- Start with "Dear Hiring Manager,".
- End with "Sincerely," followed by the verified candidate name when available.
- Name the target role and employer only when clearly identifiable.
- Open with a specific value proposition, not generic enthusiasm.
- Connect two or three strong, verified candidate qualifications to the role's
  most important business needs.
- Show the business purpose of the candidate's experience.
- Use important supported role terminology naturally.
- Include one paragraph demonstrating judgment, working style, leadership,
  customer focus, analytical thinking or transferable value when supported.
- Close confidently and professionally.
- Make every paragraph add new information.
- Keep sentences natural, varied and easy to read.

NEVER USE
- "I am writing to apply"
- "Please find my resume attached"
- "I believe I am the perfect fit"
- "dream opportunity"
- "passionate about" unless directly supported and necessary
- "results-driven", "dynamic", "hardworking" or "highly motivated"
- exaggerated praise, empty enthusiasm or copied job-description sentences
- placeholders, brackets, fake hiring-manager names or fabricated company facts
- bullet points inside the letter

TONE
Follow the requested tone without changing factual strength:
- professional: polished, direct and balanced
- confident: decisive and persuasive without arrogance
- executive: strategic, concise and senior
- warm: personable and natural while remaining professional

SUBJECT LINE
Return a concise email subject such as:
"Application for [Role] - [Candidate Name]"
Do not use placeholders when the role or name is unavailable.

OPENING HOOK
Return the letter's strongest first sentence separately.

KEY STRENGTHS
Return three to five short, evidence-backed strengths emphasized in the letter.

QUALITY SCORE
Score the final letter from 0 to 98 based on:
- specificity
- factual credibility
- role alignment
- human writing quality
- concision
- absence of clichés and repetition

FINAL AUDIT
Before returning:
- verify every candidate claim against the evidence
- remove unsupported role terminology
- remove generic and AI-sounding language
- remove repetition
- confirm the letter is application-ready
- return valid structured output only
`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "OPENAI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const report = isRecord(body.report) ? body.report : null;
    const tailoredResume = isRecord(body.tailoredResume)
      ? body.tailoredResume
      : null;

    const jobDescription =
      typeof body.jobDescription === "string"
        ? body.jobDescription.trim()
        : "";

    const tone = normalizeTone(body.tone);

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume analysis report is missing.",
        },
        { status: 400 }
      );
    }

    if (jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please paste a complete job description of at least 100 characters.",
        },
        { status: 400 }
      );
    }

    const candidateEvidence = createCandidateEvidence(
      report,
      tailoredResume
    );

    const evidenceText = JSON.stringify(candidateEvidence);

    if (evidenceText.length > 100_000) {
      return NextResponse.json(
        {
          success: false,
          message: "The resume context is too large to process.",
        },
        { status: 413 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      instructions: COVER_LETTER_INSTRUCTIONS,
      input: `
VERIFIED CANDIDATE EVIDENCE
---------------------------
${evidenceText}

TARGET JOB DESCRIPTION
----------------------
${jobDescription}

REQUESTED TONE
--------------
${tone}

Write the strongest truthful premium cover letter possible.
Return only the structured result.
`,
      text: {
        format: {
          type: "json_schema",
          name: "premium_cover_letter",
          strict: true,
          schema: coverLetterSchema,
        },
      },
      max_output_tokens: 2200,
    });

    const outputText = response.output_text?.trim();

    if (!outputText) {
      console.error("Cover-letter API returned no output:", {
        responseId: response.id,
        status: response.status,
      });

      throw new Error("The AI returned an empty cover letter.");
    }

    const parsed = parseJson<CoverLetterOutput>(
      outputText,
      "The cover letter could not be processed."
    );

    const coverLetter = cleanMultilineText(parsed.coverLetter);

    if (!coverLetter || coverLetter.split(/\s+/).length < 120) {
      throw new Error(
        "The generated cover letter was incomplete. Please try again."
      );
    }

    return NextResponse.json({
      success: true,
      coverLetter,
      subjectLine: cleanString(parsed.subjectLine),
      openingHook: cleanString(parsed.openingHook),
      keyStrengths: uniqueStrings(parsed.keyStrengths, 5),
      qualityScore: clampScore(parsed.qualityScore),
    });
  } catch (error) {
    console.error("Cover-letter API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate the cover letter.",
      },
      { status: 500 }
    );
  }
}

function createCandidateEvidence(
  report: UnknownRecord,
  tailoredResume: UnknownRecord | null
) {
  const reportContact = isRecord(report.contact)
    ? report.contact
    : {};

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : {};

  return {
    candidateName: firstAvailableString([
      tailoredResume?.candidateName,
      report.candidateName,
    ]),
    headline: firstAvailableString([
      tailoredResume?.headline,
      report.headline,
      report.professionalIdentity,
    ]),
    contact: {
      email: cleanString(reportContact.email),
      phone: cleanString(reportContact.phone),
      location: cleanString(reportContact.location),
      linkedin: cleanString(reportContact.linkedin),
    },
    careerLevel: cleanString(report.careerLevel),
    totalExperience: cleanString(report.totalExperience),
    professionalIdentity: cleanString(report.professionalIdentity),
    originalSummary: cleanString(report.improvedSummary),
    tailoredSummary: cleanString(tailoredResume?.tailoredSummary),
    tailoredBullets: safeArray(tailoredResume?.tailoredBullets),
    tailoredSkills: safeArray(tailoredResume?.tailoredSkills),
    tailoredExperience: safeArray(tailoredResume?.experience),
    verifiedExperience: safeArray(report.experience),
    verifiedEducation: safeArray(report.education),
    verifiedCertifications: safeArray(report.certifications),
    verifiedProjects: safeArray(report.projects),
    verifiedSkills: safeArray(report.optimizedSkills),
    candidateProfile: profile,
  };
}

function safeArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeTone(value: unknown): CoverLetterTone {
  if (
    value === "professional" ||
    value === "confident" ||
    value === "executive" ||
    value === "warm"
  ) {
    return value;
  }

  return "professional";
}

function firstAvailableString(values: unknown[]): string {
  for (const value of values) {
    const cleaned = cleanString(value);
    if (cleaned) return cleaned;
  }

  return "";
}

function uniqueStrings(
  values: unknown,
  maximum: number
): string[] {
  if (!Array.isArray(values)) return [];

  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const cleaned = cleanString(value);
    const key = cleaned.toLowerCase();

    if (!cleaned || seen.has(key)) continue;

    seen.add(key);
    output.push(cleaned);

    if (output.length >= maximum) break;
  }

  return output;
}

function cleanString(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMultilineText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clampScore(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 82;
  }

  return Math.min(98, Math.max(0, Math.round(value)));
}

function parseJson<T>(text: string, message: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(message, { text, error });
    throw new Error(message);
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}