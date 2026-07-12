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
- Use only facts supported by the resume analysis.
- Never invent companies, job titles, dates, qualifications, certifications,
  education, salaries, achievements, percentages, team sizes, or revenue.
- Do not add metrics unless the resume analysis already contains those metrics.
- Do not change the candidate's career history.
- Align the wording with the target job description without misrepresentation.
- Use strong action verbs.
- Avoid generic claims, clichés, buzzwords, and repetitive sentences.
- Keep the language professional and natural.
- Include relevant ATS keywords only when they reasonably match the candidate.
- The summary must be approximately 100 to 140 words.
- Return 6 to 10 detailed resume bullets.
- Each bullet should be specific, recruiter-friendly, and approximately
  18 to 30 words.
- Return 12 to 18 relevant skills.
- The cover letter must use the candidate's actual name.
- The cover letter must not invent the hiring manager's name.
- Return only valid JSON.
- Do not use markdown or code fences.

Return exactly this JSON structure:

{
  "candidateName": "${report.candidateName || ""}",
  "headline": "A refined professional headline aligned with the target job",
  "tailoredSummary": "A detailed 100 to 140 word professional summary",
  "tailoredBullets": [
    "Detailed recruiter-quality bullet based on the resume",
    "Detailed recruiter-quality bullet based on the resume",
    "Detailed recruiter-quality bullet based on the resume",
    "Detailed recruiter-quality bullet based on the resume",
    "Detailed recruiter-quality bullet based on the resume",
    "Detailed recruiter-quality bullet based on the resume"
  ],
  "tailoredSkills": [
    "Relevant skill"
  ],
  "coverLetter": "A polished and personalized professional cover letter",
  "tailoredScore": 92
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
      !Array.isArray(parsed.tailoredBullets) ||
      !Array.isArray(parsed.tailoredSkills) ||
      typeof parsed.coverLetter !== "string"
    ) {
      console.error("Unexpected AI response structure:", parsed);
      throw new Error("Invalid tailor response structure");
    }

    const tailoredBullets = parsed.tailoredBullets
      .filter((item: unknown) => typeof item === "string")
      .map((item: string) => item.trim())
      .filter(Boolean)
      .slice(0, 10);

    const tailoredSkills = parsed.tailoredSkills
      .filter((item: unknown) => typeof item === "string")
      .map((item: string) => item.trim())
      .filter(Boolean)
      .slice(0, 18);

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

      tailoredSummary: parsed.tailoredSummary.trim(),
      tailoredBullets,
      tailoredSkills,
      coverLetter: parsed.coverLetter.trim(),

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