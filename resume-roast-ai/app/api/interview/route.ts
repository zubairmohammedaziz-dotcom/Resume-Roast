import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDescription, resumeSummary, resumeBullets, skills } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { success: false, message: "Job description is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert interview coach.

Create interview preparation content for this candidate.

Resume Summary:
${resumeSummary || ""}

Resume Bullets:
${(resumeBullets || []).join("\n")}

Skills:
${(skills || []).join(", ")}

Job Description:
${jobDescription}

Return ONLY valid JSON in this exact format:
{
  "hrQuestions": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "leadershipQuestions": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "technicalQuestions": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "finalTips": ["string"]
}

Rules:
- Give 5 HR questions
- Give 5 leadership questions
- Give 5 technical/process questions
- Answers should be practical and interview-ready
- Use STAR format where possible
- Keep answers specific to operations, program management, team leadership, KPIs, SLA, stakeholder management, process improvement, and digital operations
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    console.error("Interview API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate interview questions.",
      },
      { status: 500 }
    );
  }
}