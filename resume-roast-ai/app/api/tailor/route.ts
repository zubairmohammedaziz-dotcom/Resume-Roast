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
You are an expert ATS resume writer.

Tailor the candidate's resume information for the target job description.

Important rules:
- Do not invent companies, job titles, qualifications, dates, or achievements.
- Use only information available in the resume analysis.
- Improve wording and align it with the job description.
- Return only valid JSON.
- Do not use markdown.
- Do not use code fences.

Resume analysis:
${JSON.stringify(report)}

Target job description:
${jobDescription}

Return exactly this JSON structure:

{
  "tailoredSummary": "A strong professional summary tailored to the job",
  "tailoredBullets": [
    "Improved resume bullet point",
    "Improved resume bullet point",
    "Improved resume bullet point"
  ],
  "tailoredSkills": [
    "Relevant skill",
    "Relevant skill"
  ],
  "coverLetter": "A complete professional cover letter",
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
      !Array.isArray(parsed.tailoredBullets) ||
      !Array.isArray(parsed.tailoredSkills) ||
      typeof parsed.coverLetter !== "string"
    ) {
      console.error("Unexpected AI response structure:", parsed);
      throw new Error("Invalid tailor response structure");
    }

    return NextResponse.json({
      success: true,
      tailoredSummary: parsed.tailoredSummary,
      tailoredBullets: parsed.tailoredBullets,
      tailoredSkills: parsed.tailoredSkills,
      coverLetter: parsed.coverLetter,
      tailoredScore:
        typeof parsed.tailoredScore === "number"
          ? parsed.tailoredScore
          : 95,
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