import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { report, jobDescription } = body;

    if (!report || !jobDescription) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Return only valid JSON. No markdown.

Rewrite this resume for the target job.

Resume:
${JSON.stringify(report)}

Target Job:
${jobDescription}

JSON shape:
{
  "headline": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "coverLetter": "",
  "atsScore": 95
}`,
    });

    const text = response.output_text || "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Tailor API error:", err);

    return NextResponse.json(
      { success: false, message: "Failed to tailor resume" },
      { status: 500 }
    );
  }
}