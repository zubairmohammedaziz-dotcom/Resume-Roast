import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { report } = body;

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Missing resume report." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an expert career coach.

Based on this resume analysis:

${JSON.stringify(report)}

Recommend the best 5 jobs.

Return ONLY valid JSON array. No markdown. No explanation.

[
  {
    "company": "",
    "role": "",
    "location": "",
    "salary": "",
    "match": 95,
    "whyMatched": ["", "", ""],
    "missingSkills": ["", ""],
    "url": "https://careers.google.com/jobs/results/"
  }
]
`,
    });

    const text = response.output_text || "";

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON array found in AI response");
    }

    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Jobs API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate jobs." },
      { status: 500 }
    );
  }
}