import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

type JobRecommendation = {
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  whyMatched: string[];
  missingSkills: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { report } = body;

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing resume report.",
        },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an expert career-matching assistant.

Analyze only the current resume report below. Ignore all previous candidates,
examples, cached roles, and unrelated occupations.

CURRENT RESUME REPORT:
${JSON.stringify(report)}

Create exactly 5 realistic role recommendations based on:
- Candidate's actual experience
- Skills
- Seniority
- Industry background
- Strengths
- Missing skills

Important rules:
- Do not automatically recommend Operations Manager or Program Manager.
- Recommend management roles only when the resume clearly supports that seniority.
- For fresher or junior resumes, recommend junior or entry-level roles.
- Do not claim that a company currently has an active vacancy.
- The "company" field must describe an employer category, not invent a vacancy.
- Examples: "BPO / Customer Experience Company", "SaaS Company",
  "Technology Support Company", "E-commerce Company".
- Each recommendation must be meaningfully different.
- Match scores must be realistic, between 45 and 95.
- Salary must be a broad estimate, not a guaranteed salary.
- Return only a valid JSON array.
- No markdown and no explanation.

Required JSON structure:

[
  {
    "company": "Employer category",
    "role": "Recommended role",
    "location": "India / Remote",
    "salary": "Estimated salary range",
    "match": 80,
    "whyMatched": [
      "Specific reason from this resume",
      "Specific reason from this resume",
      "Specific reason from this resume"
    ],
    "missingSkills": [
      "Relevant missing skill",
      "Relevant missing skill"
    ]
  }
]
`,
    });

    const text = response.output_text?.trim() || "";

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("Invalid jobs response:", text);
      throw new Error("No valid JSON array found");
    }

    const parsed = JSON.parse(
      text.slice(jsonStart, jsonEnd + 1)
    ) as JobRecommendation[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Jobs response was empty");
    }

    const cleanedJobs = parsed.slice(0, 5).map((job) => {
      const role =
        typeof job.role === "string" && job.role.trim()
          ? job.role.trim()
          : "Relevant Job Opportunity";

      const location =
        typeof job.location === "string" && job.location.trim()
          ? job.location.trim()
          : "India";

      const searchQuery = encodeURIComponent(`${role} ${location}`);

      return {
        company:
          typeof job.company === "string" && job.company.trim()
            ? job.company.trim()
            : "Relevant Employer",
        role,
        location,
        salary:
          typeof job.salary === "string" && job.salary.trim()
            ? job.salary.trim()
            : "Salary varies by employer",
        match:
          typeof job.match === "number"
            ? Math.min(95, Math.max(45, Math.round(job.match)))
            : 60,
        whyMatched: Array.isArray(job.whyMatched)
          ? job.whyMatched.slice(0, 3)
          : [],
        missingSkills: Array.isArray(job.missingSkills)
          ? job.missingSkills.slice(0, 3)
          : [],
        url: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`,
      };
    });

    return NextResponse.json(cleanedJobs);
  } catch (error) {
    console.error("Jobs API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate job recommendations.",
      },
      { status: 500 }
    );
  }
}