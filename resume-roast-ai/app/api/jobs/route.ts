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

Return ONLY valid JSON in this format:

[
 {
   "company":"",
   "role":"",
   "location":"",
   "salary":"",
   "match":95,
   "whyMatched":[
      "...",
      "...",
      "..."
   ],
   "missingSkills":[
      "...",
      "..."
   ],
   "url":"https://www.google.com/search?q=<role>+jobs"
 }
]
`
    });

    const text = response.output_text;

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}