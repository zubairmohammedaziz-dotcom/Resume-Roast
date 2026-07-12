import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No resume uploaded.",
        },
        { status: 400 }
      );
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
              text: `
You are Resume Roast AI, an ATS expert, recruiter, resume writer,
and career-matching assistant.

Analyze only the attached resume.

Important rules:
- Do not reuse information from any previous candidate.
- Extract the candidate's actual name from the attached resume.
- Do not invent a name.
- Do not default to Zubair Mohammed or any other example name.
- Recommend roles based only on this candidate's experience, skills,
  education, seniority, and career background.
- Do not automatically recommend Operations Manager, Program Manager,
  Google, Amazon, or DoorDash.
- Recommend junior roles for junior candidates.
- Recommend management roles only when the resume supports that seniority.
- Job matches are career recommendations, not confirmed live vacancies.
- Return only valid raw JSON.
- Do not return markdown, explanations, or code fences.

Return exactly this JSON structure:

{
  "success": true,
  "message": "Resume analyzed successfully!",
  "fileName": "${file.name}",
 "name": "Candidate Full Name",
 "headline": "Candidate Headline",
  "atsScore": 75,
  "recruiterScore": 70,
  "hiringProbability": "Medium",
  "roast": "A direct, useful, slightly funny recruiter roast.",
  "strengths": [
    "Resume-specific strength",
    "Resume-specific strength",
    "Resume-specific strength"
  ],
  "weaknesses": [
    "Resume-specific weakness",
    "Resume-specific weakness",
    "Resume-specific weakness"
  ],
  "missingKeywords": [
    "Relevant missing keyword",
    "Relevant missing keyword",
    "Relevant missing keyword"
  ],
  "improvedSummary": "A stronger professional summary based only on the resume.",
  "rewrittenBullets": [
    "Improved resume bullet",
    "Improved resume bullet",
    "Improved resume bullet"
  ],
  "optimizedSkills": [
    "Relevant skill",
    "Relevant skill",
    "Relevant skill"
  ],
  "interviewQuestions": [
  "question 1",
  "question 2",
  "question 3"
],

"experience": [
  {
    "jobTitle": "",
    "company": "",
    "duration": "",
    "bullets": []
  }
],

"education": [
  {
    "degree": "",
    "college": "",
    "year": ""
  }
],

"certifications": [],

"projects": [],

"jobMatches": [
  ],
  "jobMatches": [
    {
      "company": "Relevant employer category",
      "role": "Relevant recommended role",
      "location": "India / Remote",
      "salary": "Realistic estimated salary range",
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
}
`,
            },
            {
              type: "input_file",
              filename: file.name,
              file_data: `data:${
                file.type || "application/pdf"
              };base64,${base64}`,
            },
          ],
        },
      ],
    });

    const cleanedText = (response.output_text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("Invalid analysis response:", cleanedText);
      throw new Error("No valid JSON object found");
    }

    const data = JSON.parse(
      cleanedText.slice(jsonStart, jsonEnd + 1)
    );

    const jobMatches = Array.isArray(data.jobMatches)
      ? data.jobMatches.slice(0, 5).map((job: any) => {
          const role =
            typeof job.role === "string" && job.role.trim()
              ? job.role.trim()
              : "Relevant Job Opportunity";

          const location =
            typeof job.location === "string" && job.location.trim()
              ? job.location.trim()
              : "India / Remote";

          const searchQuery = encodeURIComponent(
            `${role} jobs ${location}`
          );

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
            url: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`,
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
          };
        })
      : [];

    return NextResponse.json({
      success: true,
      message: data.message || "Resume analyzed successfully!",
      fileName: file.name,
      

      candidateName:
        typeof data.name === "string"
  ? data.name.trim()
  : "",
      headline:
        typeof data.headline === "string"
          ? data.headline.trim()
          : "Professional Candidate",

      atsScore: Number(data.atsScore) || 0,
      recruiterScore: Number(data.recruiterScore) || 0,
      hiringProbability: data.hiringProbability || "Medium",
      roast: data.roast || "No roast generated.",

      strengths: Array.isArray(data.strengths)
        ? data.strengths
        : [],

      weaknesses: Array.isArray(data.weaknesses)
        ? data.weaknesses
        : [],

      missingKeywords: Array.isArray(data.missingKeywords)
        ? data.missingKeywords
        : [],

      improvedSummary:
        data.improvedSummary ||
        "No improved summary generated.",

      rewrittenBullets: Array.isArray(data.rewrittenBullets)
        ? data.rewrittenBullets
        : [],

      optimizedSkills: Array.isArray(data.optimizedSkills)
        ? data.optimizedSkills
        : [],

   interviewQuestions: Array.isArray(data.interviewQuestions)
  ? data.interviewQuestions
  : [],

experience: Array.isArray(data.experience)
  ? data.experience
  : [],

education: Array.isArray(data.education)
  ? data.education
  : [],

certifications: Array.isArray(data.certifications)
  ? data.certifications
  : [],

projects: Array.isArray(data.projects)
  ? data.projects
  : [],

jobMatches,

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