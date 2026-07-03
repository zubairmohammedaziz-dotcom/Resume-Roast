import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No resume uploaded.",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `You are ResumeRoast AI, a strict recruiter, ATS expert, resume rewrite specialist, and job matching assistant.

Analyze the attached resume.

Return ONLY raw JSON. No markdown. No explanation. No code block.

Use this exact JSON structure:
{
  "success": true,
  "message": "Resume analyzed successfully!",
  "fileName": "${file.name}",
  "atsScore": 75,
  "recruiterScore": 70,
  "hiringProbability": "Medium",
  "roast": "A direct, useful, slightly funny recruiter roast.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "improvedSummary": "A stronger rewritten professional summary.",
  "rewrittenBullets": ["bullet 1", "bullet 2", "bullet 3"],
  "optimizedSkills": ["skill 1", "skill 2", "skill 3"],
  "interviewQuestions": ["question 1", "question 2", "question 3"],
  "jobMatches": [
    {
      "company": "Google",
      "role": "Operations Manager",
      "location": "Hyderabad / Bengaluru",
      "salary": "₹25–40 LPA estimated",
      "url": "https://www.google.com/search?q=Operations+Manager+jobs+Hyderabad",
      "match": 92,
      "whyMatched": [
        "Operations leadership experience",
        "Google Ads and digital marketing background",
        "Team management and process improvement experience"
      ],
      "missingSkills": [
        "SQL",
        "Agile project management"
      ]
    },
    {
      "company": "Amazon",
      "role": "Program Manager",
      "location": "India / Remote",
      "salary": "₹22–38 LPA estimated",
      "url": "https://www.google.com/search?q=Program+Manager+jobs+India",
      "match": 88,
      "whyMatched": [
        "Strong operations and program management exposure",
        "Experience handling performance metrics",
        "Cross-functional stakeholder experience"
      ],
      "missingSkills": [
        "Advanced Excel",
        "Program roadmap ownership"
      ]
    },
    {
      "company": "DoorDash",
      "role": "Operations Lead",
      "location": "Remote / India",
      "salary": "₹20–35 LPA estimated",
      "url": "https://www.google.com/search?q=DoorDash+Operations+Lead+jobs",
      "match": 85,
      "whyMatched": [
        "People leadership and frontline operations experience",
        "Quality improvement and coaching background",
        "Relevant customer operations experience"
      ],
      "missingSkills": [
        "Workforce management tools",
        "Vendor operations analytics"
      ]
    }
  ]
}`,
            },
            {
              type: "input_file",
              filename: file.name,
              file_data: `data:${file.type || "application/pdf"};base64,${base64}`,
            },
          ],
        },
      ],
    });

    const cleanedText = (response.output_text || "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      message: data.message || "Resume analyzed successfully!",
      fileName: data.fileName || file.name,
      atsScore: Number(data.atsScore) || 0,
      recruiterScore: Number(data.recruiterScore) || 0,
      hiringProbability: data.hiringProbability || "Medium",
      roast: data.roast || "No roast generated.",
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      missingKeywords: Array.isArray(data.missingKeywords)
        ? data.missingKeywords
        : [],
      improvedSummary:
        data.improvedSummary || "No improved summary generated.",
      rewrittenBullets: Array.isArray(data.rewrittenBullets)
        ? data.rewrittenBullets
        : [],
      optimizedSkills: Array.isArray(data.optimizedSkills)
        ? data.optimizedSkills
        : [],
      interviewQuestions: Array.isArray(data.interviewQuestions)
        ? data.interviewQuestions
        : [],
      jobMatches: Array.isArray(data.jobMatches)
        ? data.jobMatches.map((job: any) => ({
            company: job.company || "Company",
            role: job.role || "Recommended Role",
            location: job.location || "India / Remote",
            salary: job.salary || "Salary not listed",
            url: job.url || "https://www.google.com/search?q=jobs",
            match: Number(job.match) || 80,
            whyMatched: Array.isArray(job.whyMatched) ? job.whyMatched : [],
            missingSkills: Array.isArray(job.missingSkills)
              ? job.missingSkills
              : [],
          }))
        : [],
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "AI analysis failed. Check terminal logs.",
      },
      { status: 500 }
    );
  }
}