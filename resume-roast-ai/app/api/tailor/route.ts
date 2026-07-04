import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { report, jobDescription } = body;

    if (!report || !jobDescription) {
      return NextResponse.json(
        { success: false, message: "Missing report or job description." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are ResumeRoast AI.

Create a tailored ATS resume for this job.

Use the candidate profile below:
${JSON.stringify(report)}

Job Description:
${jobDescription}

Return ONLY JSON:
{
  "success": true,
  "tailoredSummary": "",
  "tailoredBullets": [],
  "tailoredSkills": [],
  "coverLetter": ""
}`,
    });

    const cleaned = (response.output_text || "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      tailoredSummary: data.tailoredSummary || "",
      tailoredBullets: Array.isArray(data.tailoredBullets)
        ? data.tailoredBullets
        : [],
      tailoredSkills: Array.isArray(data.tailoredSkills)
        ? data.tailoredSkills
        : [],
      coverLetter: data.coverLetter || "",
    });
  } catch (error) {
    console.error("Tailor resume error:", error);
    return NextResponse.json(
      { success: false, message: "Tailor resume failed." },
      { status: 500 }
    );
  }
}