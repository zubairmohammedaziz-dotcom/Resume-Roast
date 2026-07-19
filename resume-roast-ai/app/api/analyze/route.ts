import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

type CandidateExperience = {
  jobTitle: string;
  company: string;
  duration: string;
  location: string;
  originalBullets: string[];
  responsibilities: string[];
  achievements: string[];
  verifiedMetrics: string[];
  tools: string[];
  processes: string[];
  domains: string[];
  industries: string[];
  stakeholders: string[];
  keywords: string[];
};

type CandidateEducation = {
  degree: string;
  college: string;
  year: string;
};

type CandidateProject = {
  title: string;
  description: string;
  tools: string[];
};

type JobMatch = {
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  whyMatched: string[];
  missingSkills: string[];
};

type AnalysisResult = {
  candidateName: string;
  headline: string;

  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };

  careerLevel: string;
  totalExperience: string;
  professionalIdentity: string;

  atsScore: number;
  recruiterScore: number;
  hiringProbability: string;

  roast: string;

  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];

  improvedSummary: string;
  rewrittenBullets: string[];
  optimizedSkills: string[];
  interviewQuestions: string[];

  candidateProfile: {
    professionalSummaryEvidence: string[];
    coreSkills: string[];
    tools: string[];
    domains: string[];
    industries: string[];
    processes: string[];
    verifiedAchievements: string[];
    verifiedMetrics: string[];
    experience: CandidateExperience[];
    education: CandidateEducation[];
    certifications: string[];
    projects: CandidateProject[];
  };

  experience: CandidateExperience[];
  education: CandidateEducation[];
  certifications: string[];
  projects: CandidateProject[];

  jobMatches: JobMatch[];
};

const analysisSchema = {
  type: "object",
  additionalProperties: false,

  properties: {
    candidateName: {
      type: "string",
    },

    headline: {
      type: "string",
    },

    contact: {
      type: "object",
      additionalProperties: false,
      properties: {
        email: {
          type: "string",
        },
        phone: {
          type: "string",
        },
        location: {
          type: "string",
        },
        linkedin: {
          type: "string",
        },
      },
      required: ["email", "phone", "location", "linkedin"],
    },

    careerLevel: {
      type: "string",
    },

    totalExperience: {
      type: "string",
    },

    professionalIdentity: {
      type: "string",
    },

    atsScore: {
      type: "number",
    },

    recruiterScore: {
      type: "number",
    },

    hiringProbability: {
      type: "string",
    },

    roast: {
      type: "string",
    },

    strengths: {
      type: "array",
      items: {
        type: "string",
      },
    },

    weaknesses: {
      type: "array",
      items: {
        type: "string",
      },
    },

    missingKeywords: {
      type: "array",
      items: {
        type: "string",
      },
    },

    improvedSummary: {
      type: "string",
    },

    rewrittenBullets: {
      type: "array",
      items: {
        type: "string",
      },
    },

    optimizedSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },

    interviewQuestions: {
      type: "array",
      items: {
        type: "string",
      },
    },

    candidateProfile: {
      type: "object",
      additionalProperties: false,

      properties: {
        professionalSummaryEvidence: {
          type: "array",
          items: {
            type: "string",
          },
        },

        coreSkills: {
          type: "array",
          items: {
            type: "string",
          },
        },

        tools: {
          type: "array",
          items: {
            type: "string",
          },
        },

        domains: {
          type: "array",
          items: {
            type: "string",
          },
        },

        industries: {
          type: "array",
          items: {
            type: "string",
          },
        },

        processes: {
          type: "array",
          items: {
            type: "string",
          },
        },

        verifiedAchievements: {
          type: "array",
          items: {
            type: "string",
          },
        },

        verifiedMetrics: {
          type: "array",
          items: {
            type: "string",
          },
        },

        experience: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,

            properties: {
              jobTitle: {
                type: "string",
              },

              company: {
                type: "string",
              },

              duration: {
                type: "string",
              },

              location: {
                type: "string",
              },

              originalBullets: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              responsibilities: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              achievements: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              verifiedMetrics: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              tools: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              processes: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              domains: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              industries: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              stakeholders: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              keywords: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },

            required: [
              "jobTitle",
              "company",
              "duration",
              "location",
              "originalBullets",
              "responsibilities",
              "achievements",
              "verifiedMetrics",
              "tools",
              "processes",
              "domains",
              "industries",
              "stakeholders",
              "keywords",
            ],
          },
        },

        education: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              degree: {
                type: "string",
              },
              college: {
                type: "string",
              },
              year: {
                type: "string",
              },
            },
            required: ["degree", "college", "year"],
          },
        },

        certifications: {
          type: "array",
          items: {
            type: "string",
          },
        },

        projects: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
              tools: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["title", "description", "tools"],
          },
        },
      },

      required: [
        "professionalSummaryEvidence",
        "coreSkills",
        "tools",
        "domains",
        "industries",
        "processes",
        "verifiedAchievements",
        "verifiedMetrics",
        "experience",
        "education",
        "certifications",
        "projects",
      ],
    },

    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          jobTitle: {
            type: "string",
          },

          company: {
            type: "string",
          },

          duration: {
            type: "string",
          },

          location: {
            type: "string",
          },

          originalBullets: {
            type: "array",
            items: {
              type: "string",
            },
          },

          responsibilities: {
            type: "array",
            items: {
              type: "string",
            },
          },

          achievements: {
            type: "array",
            items: {
              type: "string",
            },
          },

          verifiedMetrics: {
            type: "array",
            items: {
              type: "string",
            },
          },

          tools: {
            type: "array",
            items: {
              type: "string",
            },
          },

          processes: {
            type: "array",
            items: {
              type: "string",
            },
          },

          domains: {
            type: "array",
            items: {
              type: "string",
            },
          },

          industries: {
            type: "array",
            items: {
              type: "string",
            },
          },

          stakeholders: {
            type: "array",
            items: {
              type: "string",
            },
          },

          keywords: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },

        required: [
          "jobTitle",
          "company",
          "duration",
          "location",
          "originalBullets",
          "responsibilities",
          "achievements",
          "verifiedMetrics",
          "tools",
          "processes",
          "domains",
          "industries",
          "stakeholders",
          "keywords",
        ],
      },
    },

    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: {
            type: "string",
          },
          college: {
            type: "string",
          },
          year: {
            type: "string",
          },
        },
        required: ["degree", "college", "year"],
      },
    },

    certifications: {
      type: "array",
      items: {
        type: "string",
      },
    },

    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          tools: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["title", "description", "tools"],
      },
    },

    jobMatches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          company: {
            type: "string",
          },

          role: {
            type: "string",
          },

          location: {
            type: "string",
          },

          salary: {
            type: "string",
          },

          match: {
            type: "number",
          },

          whyMatched: {
            type: "array",
            items: {
              type: "string",
            },
          },

          missingSkills: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },

        required: [
          "company",
          "role",
          "location",
          "salary",
          "match",
          "whyMatched",
          "missingSkills",
        ],
      },
    },
  },

  required: [
    "candidateName",
    "headline",
    "contact",
    "careerLevel",
    "totalExperience",
    "professionalIdentity",
    "atsScore",
    "recruiterScore",
    "hiringProbability",
    "roast",
    "strengths",
    "weaknesses",
    "missingKeywords",
    "improvedSummary",
    "rewrittenBullets",
    "optimizedSkills",
    "interviewQuestions",
    "candidateProfile",
    "experience",
    "education",
    "certifications",
    "projects",
    "jobMatches",
  ],
} as const;

const SYSTEM_INSTRUCTIONS = `
You are Resume Roast AI, a senior recruiter, ATS analyst and resume
intelligence specialist.

Your primary task is to extract a deep, accurate candidate profile from the
uploaded resume.

The extracted profile will later be used by a separate professional resume
writer. Therefore, preserve as much factual evidence as possible.

SOURCE-OF-TRUTH RULES

Use only information present in the uploaded resume.

Never reuse information from another candidate.

Never invent or infer unsupported:
- names
- employers
- job titles
- dates
- responsibilities
- achievements
- metrics
- tools
- certifications
- projects
- degrees
- institutions
- locations
- contact information
- years of experience

When information is missing, return an empty string or empty array.

Preserve employer names, job titles, dates, email addresses and phone numbers
as closely as possible to the source.

DEEP EXPERIENCE EXTRACTION

For every genuine role, extract:

1. Original bullets
   Preserve the factual meaning and wording from the resume as closely as
   possible.

2. Responsibilities
   Break the role into distinct functions and duties supported by the resume.

3. Achievements
   Include only outcomes or accomplishments explicitly supported by the
   resume.

4. Verified metrics
   Include only exact numbers, percentages, volumes, team sizes, scores or
   monetary values present in the resume.

5. Tools
   Include only named software, platforms, systems or technical tools present
   in the resume.

6. Processes
   Extract relevant workflows, controls, operational processes and
   methodologies.

7. Domains
   Extract functional areas such as AML, KYC, fraud investigations,
   transaction monitoring, customer service or sales.

8. Industries
   Extract supported industry exposure such as banking, remittance,
   telecommunications or e-commerce.

9. Stakeholders
   Include customer groups, internal teams, regulators, clients or partners
   only when supported.

10. Keywords
    Include ATS-relevant terms supported by that role.

Do not turn inferred context into a fact.

Example:
If the resume states that a candidate reviewed international remittance
transactions for fraud, supported domains may include transaction monitoring,
fraud investigation and international remittance.

However, do not add software, regulatory frameworks or measurable outcomes
that are not written in the resume.

SCORING

ATS score:
Evaluate structure, keyword clarity, formatting, section completeness,
readability and relevance.

Recruiter score:
Evaluate clarity, credibility, impact, positioning and ease of understanding.

Hiring probability must be one of:
- Low
- Medium
- High

Scores must be realistic rather than inflated.

SUMMARY AND BULLETS

The improved summary and rewritten bullets are previews for the analysis
report, not the final tailored resume.

Keep them factual and useful.

JOB RECOMMENDATIONS

Recommend roles based only on the candidate's actual seniority, experience,
education and skills.

Do not default to famous companies or management roles.

The company field should describe a realistic employer type or sector when an
actual company cannot be responsibly recommended.

Salary must be a broad realistic estimate, not a guaranteed salary.

FINAL CHECK

Before returning the response, silently verify:

- The correct candidate was extracted.
- No previous candidate information was reused.
- No unsupported numbers were added.
- No unsupported tools or certifications were added.
- Every genuine job was captured.
- Original work evidence was preserved.
- Empty unsupported sections remain empty.
- The JSON exactly follows the required schema.
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No resume uploaded.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded resume is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "The resume must be smaller than 10 MB.",
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1",

      instructions: SYSTEM_INSTRUCTIONS,

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Analyze the attached resume and create a deep candidate evidence profile.

The profile must preserve every supported fact needed to later write a
high-quality tailored resume.

File name:
${file.name}

Return only the structured result required by the schema.
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

      text: {
        format: {
          type: "json_schema",
          name: "resume_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },

      max_output_tokens: 10000,
    });

    const outputText = response.output_text?.trim();

    if (!outputText) {
      console.error("Analyze API returned no output:", {
        responseId: response.id,
        status: response.status,
      });

      throw new Error("The AI returned an empty analysis.");
    }

    let data: AnalysisResult;

    try {
      data = JSON.parse(outputText) as AnalysisResult;
    } catch (error) {
      console.error("Unable to parse resume analysis:", {
        responseId: response.id,
        outputText,
        error,
      });

      throw new Error("The resume analysis could not be processed.");
    }

    const candidateProfile = sanitizeCandidateProfile(
      data.candidateProfile
    );

    const experience =
      candidateProfile.experience.length > 0
        ? candidateProfile.experience
        : sanitizeExperience(data.experience);

    const education =
      candidateProfile.education.length > 0
        ? candidateProfile.education
        : sanitizeEducation(data.education);

    const certifications =
      candidateProfile.certifications.length > 0
        ? candidateProfile.certifications
        : uniqueStrings(data.certifications, 20);

    const projects =
      candidateProfile.projects.length > 0
        ? candidateProfile.projects
        : sanitizeProjects(data.projects);

    const jobMatches = sanitizeJobMatches(data.jobMatches);

    return NextResponse.json({
      success: true,
      message: "Resume analyzed successfully!",
      fileName: file.name,

      candidateName: cleanString(data.candidateName),

      headline:
        cleanString(data.headline) ||
        cleanString(data.professionalIdentity) ||
        "Professional Candidate",

      contact: {
        email: cleanString(data.contact?.email),
        phone: cleanString(data.contact?.phone),
        location: cleanString(data.contact?.location),
        linkedin: cleanString(data.contact?.linkedin),
      },

      careerLevel: cleanString(data.careerLevel),
      totalExperience: cleanString(data.totalExperience),
      professionalIdentity: cleanString(data.professionalIdentity),

      atsScore: clampScore(data.atsScore),
      recruiterScore: clampScore(data.recruiterScore),

      hiringProbability: normalizeHiringProbability(
        data.hiringProbability
      ),

      roast:
        cleanString(data.roast) ||
        "The resume has useful experience but needs stronger positioning.",

      strengths: uniqueStrings(data.strengths, 8),
      weaknesses: uniqueStrings(data.weaknesses, 8),
      missingKeywords: uniqueStrings(data.missingKeywords, 15),

      improvedSummary: cleanString(data.improvedSummary),

      rewrittenBullets: uniqueStrings(
        data.rewrittenBullets,
        15
      ),

      optimizedSkills: uniqueStrings(
        data.optimizedSkills,
        25
      ),

      interviewQuestions: uniqueStrings(
        data.interviewQuestions,
        10
      ),

      candidateProfile: {
        ...candidateProfile,
        experience,
        education,
        certifications,
        projects,
      },

      experience,
      education,
      certifications,
      projects,

      jobMatches,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "AI analysis failed. Check terminal logs.",
      },
      { status: 500 }
    );
  }
}

function sanitizeCandidateProfile(
  profile: AnalysisResult["candidateProfile"] | undefined
) {
  return {
    professionalSummaryEvidence: uniqueStrings(
      profile?.professionalSummaryEvidence,
      20
    ),

    coreSkills: uniqueStrings(profile?.coreSkills, 30),

    tools: uniqueStrings(profile?.tools, 25),

    domains: uniqueStrings(profile?.domains, 25),

    industries: uniqueStrings(profile?.industries, 15),

    processes: uniqueStrings(profile?.processes, 30),

    verifiedAchievements: uniqueStrings(
      profile?.verifiedAchievements,
      20
    ),

    verifiedMetrics: uniqueStrings(
      profile?.verifiedMetrics,
      20
    ),

    experience: sanitizeExperience(profile?.experience),

    education: sanitizeEducation(profile?.education),

    certifications: uniqueStrings(
      profile?.certifications,
      20
    ),

    projects: sanitizeProjects(profile?.projects),
  };
}

function sanitizeExperience(
  experience: CandidateExperience[] | undefined
): CandidateExperience[] {
  if (!Array.isArray(experience)) {
    return [];
  }

  return experience
    .filter(
      (item): item is CandidateExperience =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      jobTitle: cleanString(item.jobTitle),
      company: cleanString(item.company),
      duration: cleanString(item.duration),
      location: cleanString(item.location),

      originalBullets: uniqueStrings(
        item.originalBullets,
        15
      ),

      responsibilities: uniqueStrings(
        item.responsibilities,
        15
      ),

      achievements: uniqueStrings(item.achievements, 10),

      verifiedMetrics: uniqueStrings(
        item.verifiedMetrics,
        10
      ),

      tools: uniqueStrings(item.tools, 15),

      processes: uniqueStrings(item.processes, 20),

      domains: uniqueStrings(item.domains, 15),

      industries: uniqueStrings(item.industries, 10),

      stakeholders: uniqueStrings(item.stakeholders, 15),

      keywords: uniqueStrings(item.keywords, 25),
    }))
    .filter(
      (item) =>
        Boolean(item.jobTitle || item.company) &&
        Boolean(
          item.originalBullets.length ||
            item.responsibilities.length ||
            item.achievements.length
        )
    );
}

function sanitizeEducation(
  education: CandidateEducation[] | undefined
): CandidateEducation[] {
  if (!Array.isArray(education)) {
    return [];
  }

  return education
    .filter(
      (item): item is CandidateEducation =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      degree: cleanString(item.degree),
      college: cleanString(item.college),
      year: cleanString(item.year),
    }))
    .filter((item) => Boolean(item.degree || item.college));
}

function sanitizeProjects(
  projects: CandidateProject[] | undefined
): CandidateProject[] {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects
    .filter(
      (item): item is CandidateProject =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      title: cleanString(item.title),
      description: cleanString(item.description),
      tools: uniqueStrings(item.tools, 15),
    }))
    .filter((item) => Boolean(item.title && item.description))
    .slice(0, 10);
}

function sanitizeJobMatches(
  jobs: JobMatch[] | undefined
) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs
    .filter(
      (job): job is JobMatch =>
        Boolean(job) && typeof job === "object"
    )
    .slice(0, 5)
    .map((job) => {
      const role =
        cleanString(job.role) || "Relevant Job Opportunity";

      const location =
        cleanString(job.location) || "India / Remote";

      const searchQuery = encodeURIComponent(
        `${role} jobs ${location}`
      );

      return {
        company:
          cleanString(job.company) || "Relevant Employer",

        role,

        location,

        salary:
          cleanString(job.salary) ||
          "Salary varies by employer",

        url: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`,

        match: Math.min(
          95,
          Math.max(40, Math.round(Number(job.match) || 60))
        ),

        whyMatched: uniqueStrings(job.whyMatched, 3),

        missingSkills: uniqueStrings(job.missingSkills, 5),
      };
    });
}

function uniqueStrings(
  values: unknown,
  maximum: number
): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const output: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }

    const cleaned = cleanString(value);
    const key = cleaned.toLowerCase();

    if (!cleaned || seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(cleaned);

    if (output.length >= maximum) {
      break;
    }
  }

  return output;
}

function cleanString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function clampScore(value: unknown): number {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function normalizeHiringProbability(value: unknown) {
  const probability = cleanString(value).toLowerCase();

  if (probability === "high") {
    return "High";
  }

  if (probability === "low") {
    return "Low";
  }

  return "Medium";
}