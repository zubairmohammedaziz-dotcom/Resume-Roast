import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "OPENAI_API_KEY is missing",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { report, jobDescription } = body;

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume analysis report is missing",
        },
        { status: 400 }
      );
    }

    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 20
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid job description",
        },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a senior resume writer, ATS specialist, and recruiter.

Create a detailed, polished, ATS-friendly resume tailored to the target job.

CANDIDATE NAME:
${report.candidateName || "Candidate"}

CURRENT PROFESSIONAL HEADLINE:
${report.headline || "Professional Candidate"}

RESUME ANALYSIS:
${JSON.stringify(report)}

TARGET JOB DESCRIPTION:
${jobDescription}

STRICT RULES:
- Use only facts supported by the uploaded resume analysis.
- Never invent percentages, KPIs, CSAT scores, SLA results, team sizes, revenue, promotions, awards, certifications, education, dates, tools, companies, job titles, or years of experience.
- Do not add numbers unless the exact number already exists in the resume analysis.
- Do not convert general responsibilities into fake achievements.
- Keep every bullet factual, believable, and recruiter-safe.
- Improve clarity, impact, ATS alignment, and wording only.
- Use ATS keywords from the target job only when they genuinely fit the candidate’s background.
- If evidence is missing, write a strong responsibility-based bullet without metrics.
- Avoid clichés, buzzwords, exaggerated claims, and repetitive phrasing.
- Return only valid JSON.
- Do not use markdown or code fences.

Return exactly this JSON structure:

{
{
  "candidateName": "...",
  "headline": "...",

  "tailoredSummary": "...",

  "experience": [
    {
      "jobTitle": "...",
      "company": "...",
      "duration": "...",
      "bullets": [
        "...",
        "...",
        "..."
      ]
    }
  ],

  "tailoredSkills": [
    "...",
    "...",
    "..."
  ],

  "education": [
    {
      "degree": "...",
      "college": "...",
      "year": "..."
    }
  ],

  "certifications": [
    "..."
  ],

  "projects": [
    {
      "title": "...",
      "description": "..."
    }
  ],

  "coverLetter": "...",

  "tailoredScore": 95
}
`,
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error("OpenAI returned an empty response");
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("Invalid AI response:", text);
      throw new Error("No valid JSON found in AI response");
    }

    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

 if (
  typeof parsed.tailoredSummary !== "string" ||
  !Array.isArray(parsed.experience) ||
  !Array.isArray(parsed.tailoredSkills) ||
  typeof parsed.coverLetter !== "string"
) {
  console.error("Unexpected AI response structure:", parsed);
  throw new Error("Invalid tailor response structure");
}

const experience = parsed.experience
  .filter(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null
  )
  .map((item: any) => ({
    jobTitle:
      typeof item.jobTitle === "string"
        ? item.jobTitle.trim()
        : "",
    company:
      typeof item.company === "string"
        ? item.company.trim()
        : "",
    duration:
      typeof item.duration === "string"
        ? item.duration.trim()
        : "",
    bullets: Array.isArray(item.bullets)
      ? item.bullets
          .filter((bullet: unknown) => typeof bullet === "string")
          .map((bullet: string) => bullet.trim())
          .filter(Boolean)
          .slice(0, 10)
      : [],
  }));

const tailoredBullets = experience
  .flatMap((item: { bullets: string[] }) => item.bullets)
  .slice(0, 10);

const tailoredSkills = parsed.tailoredSkills
  .filter((item: unknown) => typeof item === "string")
  .map((item: string) => item.trim())
  .filter(Boolean)
  .slice(0, 20);

   return NextResponse.json({
  success: true,

  candidateName:
    typeof parsed.candidateName === "string" &&
    parsed.candidateName.trim()
      ? parsed.candidateName.trim()
      : report.candidateName || "Candidate",

  headline:
    typeof parsed.headline === "string" && parsed.headline.trim()
      ? parsed.headline.trim()
      : report.headline || "Professional Candidate",

  tailoredSummary:
    typeof parsed.tailoredSummary === "string"
      ? parsed.tailoredSummary.trim()
      : "",

 tailoredBullets,

tailoredSkills,

  experience,
  education: Array.isArray(parsed.education)
    ? parsed.education
    : [],

  certifications: Array.isArray(parsed.certifications)
    ? parsed.certifications
    : [],

  projects: Array.isArray(parsed.projects)
    ? parsed.projects
    : [],

  coverLetter:
    typeof parsed.coverLetter === "string"
      ? parsed.coverLetter.trim()
      : "",

  tailoredScore:
    typeof parsed.tailoredScore === "number"
      ? Math.min(98, Math.max(70, Math.round(parsed.tailoredScore)))
      : 90,
});
  } catch (error) {
    console.error("Tailor API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to tailor resume",
      },
      { status: 500 }
    );
  }
}