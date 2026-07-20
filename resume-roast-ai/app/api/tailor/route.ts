import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 90;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type UnknownRecord = Record<string, unknown>;

type ResumeReport = {
  candidateName?: string;
  headline?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  careerLevel?: string;
  totalExperience?: string;
  professionalIdentity?: string;
  candidateProfile?: unknown;
  experience?: unknown;
  education?: unknown;
  certifications?: unknown;
  projects?: unknown;
  optimizedSkills?: unknown;
  improvedSummary?: string;
  [key: string]: unknown;
};

type JobStrategy = {
  targetRole: string;
  employerName: string;
  seniority: string;
  industry: string;
  rolePurpose: string;
  criticalRequirements: string[];
  preferredRequirements: string[];
  responsibilities: string[];
  atsKeywords: string[];
  strongestCandidateMatches: string[];
  evidenceBackedGaps: string[];
  positioningStrategy: string;
  keywordPriorities: string[];
};

type TailoredExperience = {
  jobTitle: string;
  company: string;
  duration: string;
  location: string;
  bullets: string[];
};

type TailoredEducation = {
  degree: string;
  college: string;
  year: string;
};

type TailoredProject = {
  title: string;
  description: string;
};

type TailoredResume = {
  candidateName: string;
  headline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  tailoredSummary: string;
  coreCompetencies: string[];
  experience: TailoredExperience[];
  tailoredSkills: string[];
  education: TailoredEducation[];
  certifications: string[];
  projects: TailoredProject[];
  coverLetter: string;
  tailoredScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
};

const jobStrategySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetRole: { type: "string" },
    employerName: { type: "string" },
    seniority: { type: "string" },
    industry: { type: "string" },
    rolePurpose: { type: "string" },
    criticalRequirements: { type: "array", items: { type: "string" } },
    preferredRequirements: { type: "array", items: { type: "string" } },
    responsibilities: { type: "array", items: { type: "string" } },
    atsKeywords: { type: "array", items: { type: "string" } },
    strongestCandidateMatches: { type: "array", items: { type: "string" } },
    evidenceBackedGaps: { type: "array", items: { type: "string" } },
    positioningStrategy: { type: "string" },
    keywordPriorities: { type: "array", items: { type: "string" } },
  },
  required: [
    "targetRole",
    "employerName",
    "seniority",
    "industry",
    "rolePurpose",
    "criticalRequirements",
    "preferredRequirements",
    "responsibilities",
    "atsKeywords",
    "strongestCandidateMatches",
    "evidenceBackedGaps",
    "positioningStrategy",
    "keywordPriorities",
  ],
} as const;

const tailoredResumeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateName: { type: "string" },
    headline: { type: "string" },
    contact: {
      type: "object",
      additionalProperties: false,
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
      },
      required: ["email", "phone", "location", "linkedin"],
    },
    tailoredSummary: { type: "string" },
    coreCompetencies: { type: "array", items: { type: "string" } },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          jobTitle: { type: "string" },
          company: { type: "string" },
          duration: { type: "string" },
          location: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["jobTitle", "company", "duration", "location", "bullets"],
      },
    },
    tailoredSkills: { type: "array", items: { type: "string" } },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: "string" },
          college: { type: "string" },
          year: { type: "string" },
        },
        required: ["degree", "college", "year"],
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
      },
    },
    coverLetter: { type: "string" },
    tailoredScore: { type: "number" },
    matchedKeywords: { type: "array", items: { type: "string" } },
    missingKeywords: { type: "array", items: { type: "string" } },
  },
  required: [
    "candidateName",
    "headline",
    "contact",
    "tailoredSummary",
    "coreCompetencies",
    "experience",
    "tailoredSkills",
    "education",
    "certifications",
    "projects",
    "coverLetter",
    "tailoredScore",
    "matchedKeywords",
    "missingKeywords",
  ],
} as const;

const JOB_STRATEGY_INSTRUCTIONS = `
You are a senior recruiter, executive-search consultant, ATS analyst and
job-description intelligence specialist.

Create a concise, evidence-based positioning strategy for a professional resume.

NON-NEGOTIABLE RULES
- Candidate evidence is the only source of candidate facts.
- A job-description requirement is not proof the candidate has that skill.
- Separate mandatory requirements from preferred requirements.
- Extract exact recruiter-searchable terminology, including role-specific tools,
  methods, business functions, domain language and leadership expectations.
- Rank keywords by hiring importance and recruiter intent, not frequency alone.
- Identify the candidate's strongest supported matches and genuine evidence-backed gaps.
- Never invent the employer when it is not clearly stated.
- Do not write the resume.
- Do not recommend inserting unsupported keywords into candidate sections.

KEYWORD PRIORITY
Return keywordPriorities in descending hiring importance.
Each item should be concise and use this format:
"keyword | critical, high, medium or low | why it matters"

POSITIONING STRATEGY
Explain:
- the most credible professional identity for this application
- the supported evidence that should lead the resume
- the experience, achievements, projects, education or transferable skills to emphasize
- what should receive less space
- how the candidate should be differentiated from similar applicants
- how to improve relevance without changing any fact
`;

const RESUME_WRITER_INSTRUCTIONS = `
You are an elite human resume writer, executive recruiter and ATS specialist
with the judgment of a senior resume consultant retained for competitive roles.

Create a premium, ATS-safe and completely truthful resume tailored to the supplied
job strategy. The finished document must feel professionally rewritten by a human,
not mechanically paraphrased or generated from a template.

SOURCE OF TRUTH
Candidate evidence is the sole source of candidate facts.

Never invent or infer unsupported:
- employers, titles, dates, locations, promotions or reporting lines
- degrees, certifications, projects, internships or coursework
- tools, software, regulations, methodologies or domain expertise
- metrics, percentages, revenue, volume, team size, rankings or achievements
- responsibilities the candidate did not perform
- years of experience, seniority or leadership scope

Preserve official employer names, job titles and dates exactly when available.
A requirement in the job description is not proof the candidate possesses it.
Missing information must remain missing rather than being filled with assumptions.

CANDIDATE TYPE
First determine whether the candidate is:
1. experienced,
2. early-career with limited verified experience, or
3. a fresher with no verified employment.

For freshers, never fabricate employment. Build credibility through supported
education, projects, internships, coursework, practical exposure and transferable
skills. Returning an empty experience array is valid when no employment exists.

WRITING STANDARD
Write like an experienced resume consultant, not an AI assistant.
- Use direct, precise and natural business language.
- Avoid generic filler, exaggerated adjectives and corporate buzzword chains.
- Avoid repetitive sentence structures.
- Do not begin multiple bullets with the same verb.
- Do not force a metric into a bullet when no verified metric exists.
- Every line must either improve relevance, clarify scope or strengthen credibility.

HEADLINE
- 5 to 11 words.
- Specific, credible and targeted.
- Lead with the strongest supported professional identity.
- Do not use a long keyword chain.
- Do not claim the target title unless candidate evidence supports it.
- Avoid labels such as "aspiring", "enthusiastic" or "results-driven".

PROFESSIONAL SUMMARY
Write 70 to 105 words.

It must:
- establish a clear professional identity in the opening sentence
- connect supported evidence to the target role
- emphasize relevant scope, judgment, customers, risk, revenue, operations,
  technology, delivery or business purpose
- include the most important supported ATS terms naturally
- communicate seniority accurately
- avoid repeating the skills section
- avoid first-person pronouns
- avoid clichés including "results-driven", "dynamic", "highly motivated",
  "proven track record", "hardworking", "go-getter" and "seeking an opportunity"
- avoid unsupported impact claims

EXPERIENCE
Preserve every verified role.

For the most relevant recent role, write 4 to 6 strong bullets when evidence permits.
For older or less relevant roles, write 2 to 4 bullets.

Each bullet must:
- begin with a precise action verb
- contain one distinct contribution or responsibility
- explain scope, method, stakeholders and business purpose where supported
- normally use 18 to 32 words
- sound natural and defensible in an interview
- use supported ATS language where relevant
- avoid generic openings such as "Handled", "Worked on", "Helped",
  "Responsible for", "Tasked with" and "Involved in"
- avoid repeating action verbs within the same role
- avoid repeating phrases such as "ensuring compliance"
- never manufacture impact, ownership or metrics

Prefer:
Action + scope + method or process + business purpose or verified outcome.

When verified achievements or metrics exist, place them where they are most meaningful.
When metrics do not exist, strengthen the bullet through scope, complexity, process,
stakeholders, judgment and business purpose instead of inventing numbers.

TRANSFERABLE EXPERIENCE
When the target role differs from prior roles:
- translate genuine work into relevant transferable capabilities
- preserve official job titles
- do not pretend unrelated work was direct target-role experience
- make the connection through real responsibilities, methods and business context

CORE COMPETENCIES
- Return 6 to 10 high-value capability phrases.
- Prioritize the strongest supported target-role capabilities.
- Use business capabilities rather than personality traits.
- Avoid duplicating the tailoredSkills list word for word.

TAILORED SKILLS
- Return 10 to 18 specific ATS-searchable skills.
- Include only skills supported by candidate evidence.
- Prioritize critical and high-priority terms from the job strategy.
- Exclude personality traits, vague qualities and unsupported JD terminology.
- Remove duplicates and near-duplicates.

EDUCATION, CERTIFICATIONS AND PROJECTS
- Preserve supported facts only.
- Return empty arrays when unsupported.
- Do not convert normal employment duties into standalone projects.
- For freshers, strengthen supported project descriptions by clarifying objective,
  method, tools and relevance without inventing outcomes.

COVER LETTER
Write a premium cover letter of 230 to 300 words.

It must:
- sound individually written for this application
- address "Hiring Manager" naturally without fake names
- name the role and employer only when clearly available
- open with a credible value proposition rather than generic enthusiasm
- connect two or three of the candidate's strongest verified qualifications to
  the employer's most important needs
- show understanding of the role's business purpose
- include one concise paragraph explaining the candidate's relevant working style,
  judgment or transferable value when supported
- close confidently with interest in discussing fit
- avoid copying the professional summary or listing resume bullets
- avoid placeholders and bracketed text
- avoid exaggerated praise of the employer
- avoid phrases such as "I am writing to apply", "perfect fit",
  "dream opportunity" and "please find my resume attached"
- never introduce unsupported facts

TAILORED SCORE
Score supported alignment honestly:
90-96 exceptional alignment
80-89 strong alignment with limited gaps
70-79 good alignment with meaningful gaps
55-69 partial alignment
below 55 weak alignment

matchedKeywords must contain only terms that are both important to the job and
supported by candidate evidence.

missingKeywords must contain important job terms that are genuinely unsupported
or absent from candidate evidence. Never insert these terms into candidate sections.

FINAL QUALITY CONTROL
Before returning:
- verify every candidate claim against the evidence
- preserve factual identity, employers, titles and dates
- remove unsupported job-description keywords from candidate sections
- remove repetition, clichés, keyword stuffing and generic filler
- confirm every bullet adds distinct value
- confirm headline and summary match the candidate's actual seniority
- confirm the cover letter is specific, concise and evidence-based
- confirm the resume is materially stronger and more targeted
- return valid structured output only
`;

const RECRUITER_QA_INSTRUCTIONS = `
You are the final quality-control reviewer for a premium resume-writing service.
Act as a senior recruiter, ATS reviewer, copy editor and anti-hallucination auditor.

Review the supplied draft against:
1. verified candidate evidence,
2. recruiter strategy, and
3. target job description.

Your task is to return the final corrected resume using exactly the requested schema.

NON-NEGOTIABLE FACTUAL RULES
- Candidate evidence is the only source of candidate facts.
- Delete or correct every unsupported claim.
- Never add employers, titles, dates, locations, metrics, tools, qualifications,
  achievements, responsibilities or years of experience that are not supported.
- A job requirement is not candidate evidence.
- Preserve official employer names, job titles and dates when available.

QUALITY REVIEW
Correct:
- generic or AI-sounding language
- weak, vague or repetitive bullets
- duplicated action verbs
- awkward grammar or unnatural phrasing
- keyword stuffing
- unsupported ATS terminology
- inaccurate seniority
- summaries that merely list skills
- cover letters that sound templated or repeat the resume
- inflated tailored scores
- matched keywords not supported by evidence
- missing keywords that are not actually important

Do not rewrite strong content merely to make it different.
Do not reduce factual detail.
Do not introduce new facts while improving the writing.

FINAL STANDARD
The final resume should be concise, credible, ATS-safe, recruiter-friendly,
interview-defensible and clearly tailored to the target role.
Return valid structured output only.
`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "OPENAI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const report = isRecord(body.report)
      ? (body.report as ResumeReport)
      : undefined;

    const jobDescription =
      typeof body.jobDescription === "string"
        ? body.jobDescription.trim()
        : "";

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Resume analysis report is missing." },
        { status: 400 }
      );
    }

    if (jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please paste a complete job description of at least 100 characters.",
        },
        { status: 400 }
      );
    }

    const candidateEvidence = createCandidateEvidence(report);
    const candidateEvidenceText = JSON.stringify(candidateEvidence);

    if (candidateEvidenceText.length > 100_000) {
      return NextResponse.json(
        {
          success: false,
          message: "The resume analysis is too large to process.",
        },
        { status: 413 }
      );
    }

    const strategyResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: JOB_STRATEGY_INSTRUCTIONS,
      input: `
VERIFIED CANDIDATE EVIDENCE
---------------------------
${candidateEvidenceText}

TARGET JOB DESCRIPTION
----------------------
${jobDescription}

Create the recruiter strategy. Return only the structured result.
`,
      text: {
        format: {
          type: "json_schema",
          name: "job_strategy",
          strict: true,
          schema: jobStrategySchema,
        },
      },
      max_output_tokens: 3000,
    });

    const strategyText = strategyResponse.output_text?.trim();

    if (!strategyText) {
      throw new Error("The AI could not analyze the job description.");
    }

    const jobStrategy = parseJson<JobStrategy>(
      strategyText,
      "The job-description analysis could not be processed."
    );

    const writerResponse = await openai.responses.create({
      model: "gpt-4.1",
      instructions: RESUME_WRITER_INSTRUCTIONS,
      input: `
VERIFIED CANDIDATE EVIDENCE
---------------------------
${candidateEvidenceText}

RECRUITER STRATEGY
------------------
${JSON.stringify(jobStrategy)}

TARGET JOB DESCRIPTION
----------------------
${jobDescription}

Create the strongest truthful, premium and ATS-safe resume possible.
Return only the structured result.
`,
      text: {
        format: {
          type: "json_schema",
          name: "premium_tailored_resume",
          strict: true,
          schema: tailoredResumeSchema,
        },
      },
      max_output_tokens: 8000,
    });

    const outputText = writerResponse.output_text?.trim();

    if (!outputText) {
      console.error("Tailor API returned no output:", {
        responseId: writerResponse.id,
        status: writerResponse.status,
      });
      throw new Error("The AI returned an empty tailored resume.");
    }

    const initialDraft = parseJson<TailoredResume>(
      outputText,
      "The tailored resume could not be processed."
    );

    let parsed = initialDraft;

    try {
      const reviewResponse = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: RECRUITER_QA_INSTRUCTIONS,
        input: `
VERIFIED CANDIDATE EVIDENCE
---------------------------
${candidateEvidenceText}

RECRUITER STRATEGY
------------------
${JSON.stringify(jobStrategy)}

TARGET JOB DESCRIPTION
----------------------
${jobDescription}

DRAFT RESUME TO REVIEW
----------------------
${JSON.stringify(initialDraft)}

Audit and improve the draft. Return the final corrected structured resume only.
`,
        text: {
          format: {
            type: "json_schema",
            name: "reviewed_premium_tailored_resume",
            strict: true,
            schema: tailoredResumeSchema,
          },
        },
        max_output_tokens: 8000,
      });

      const reviewedText = reviewResponse.output_text?.trim();

      if (reviewedText) {
        parsed = parseJson<TailoredResume>(
          reviewedText,
          "The recruiter review could not be processed."
        );
      } else {
        console.warn("Recruiter QA returned no output. Using initial draft.", {
          responseId: reviewResponse.id,
          status: reviewResponse.status,
        });
      }
    } catch (reviewError) {
      // Fail open: a review problem must not discard a valid tailored resume.
      console.error(
        "Recruiter QA failed. Returning the initial tailored resume.",
        reviewError
      );
    }

    const fallbackExperience = extractFallbackExperience(report);
    const generatedExperience = sanitizeExperience(parsed.experience);

    const experience =
      generatedExperience.length > 0
        ? generatedExperience
        : fallbackExperience;

    const education = mergeEducation(
      sanitizeEducation(parsed.education),
      extractFallbackEducation(report)
    );

    const projects = mergeProjects(
      sanitizeProjects(parsed.projects),
      extractFallbackProjects(report)
    );

    const certifications = mergeUniqueStrings(
      parsed.certifications,
      extractFallbackCertifications(report),
      12
    );

    const tailoredSummary =
      cleanString(parsed.tailoredSummary) ||
      cleanString(report.improvedSummary) ||
      createSummaryFallback(report, jobStrategy);

    if (!tailoredSummary) {
      throw new Error("The AI did not create a professional summary.");
    }

    const coreCompetencies = uniqueStrings(parsed.coreCompetencies, 10);

    const tailoredSkills = mergeUniqueStrings(
      parsed.tailoredSkills,
      extractFallbackSkills(report),
      20
    );

    const tailoredBullets = experience.flatMap((role) => role.bullets);

    const candidateName =
      cleanString(parsed.candidateName) ||
      cleanString(report.candidateName) ||
      "Candidate";

    const headline =
      cleanString(parsed.headline) ||
      cleanString(report.headline) ||
      cleanString(jobStrategy.targetRole) ||
      "Professional Candidate";

    return NextResponse.json({
      success: true,
      candidateName,
      headline,
      contact: {
        email:
          cleanString(parsed.contact?.email) ||
          cleanString(report.contact?.email),
        phone:
          cleanString(parsed.contact?.phone) ||
          cleanString(report.contact?.phone),
        location:
          cleanString(parsed.contact?.location) ||
          cleanString(report.contact?.location),
        linkedin:
          cleanString(parsed.contact?.linkedin) ||
          cleanString(report.contact?.linkedin),
      },
      tailoredSummary,
      coreCompetencies,
      experience,
      tailoredBullets,
      tailoredSkills,
      education,
      certifications,
      projects,
      coverLetter: cleanString(parsed.coverLetter),
      tailoredScore: clampScore(parsed.tailoredScore),
      matchedKeywords: uniqueStrings(parsed.matchedKeywords, 20),
      missingKeywords: uniqueStrings(parsed.missingKeywords, 15),
      jobStrategy: {
        targetRole: cleanString(jobStrategy.targetRole),
        employerName: cleanString(jobStrategy.employerName),
        strongestCandidateMatches: uniqueStrings(
          jobStrategy.strongestCandidateMatches,
          10
        ),
        evidenceBackedGaps: uniqueStrings(
          jobStrategy.evidenceBackedGaps,
          10
        ),
      },
    });
  } catch (error) {
    console.error("Tailor API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to tailor the resume.",
      },
      { status: 500 }
    );
  }
}

function createCandidateEvidence(report: ResumeReport) {
  const candidateProfile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : {};

  return {
    candidateName: cleanString(report.candidateName),
    headline: cleanString(report.headline),
    contact: {
      email: cleanString(report.contact?.email),
      phone: cleanString(report.contact?.phone),
      location: cleanString(report.contact?.location),
      linkedin: cleanString(report.contact?.linkedin),
    },
    careerLevel: cleanString(report.careerLevel),
    totalExperience: cleanString(report.totalExperience),
    professionalIdentity: cleanString(report.professionalIdentity),
    improvedSummary: cleanString(report.improvedSummary),
    optimizedSkills: Array.isArray(report.optimizedSkills)
      ? report.optimizedSkills
      : [],
    candidateProfile,
    experience: Array.isArray(report.experience) ? report.experience : [],
    education: Array.isArray(report.education) ? report.education : [],
    certifications: Array.isArray(report.certifications)
      ? report.certifications
      : [],
    projects: Array.isArray(report.projects) ? report.projects : [],
  };
}

function extractFallbackExperience(
  report: ResumeReport
): TailoredExperience[] {
  const candidates: unknown[] = [];

  if (Array.isArray(report.experience)) {
    candidates.push(...report.experience);
  }

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of [
      "experience",
      "workExperience",
      "professionalExperience",
      "employmentHistory",
    ]) {
      const value = profile[key];
      if (Array.isArray(value)) candidates.push(...value);
    }
  }

  return sanitizeUnknownExperience(candidates);
}

function sanitizeUnknownExperience(
  experience: unknown[]
): TailoredExperience[] {
  return experience
    .filter(isRecord)
    .map((item) => {
      const bullets = firstStringArray(item, [
        "bullets",
        "responsibilities",
        "achievements",
        "highlights",
        "description",
      ]);

      return {
        jobTitle: firstString(item, [
          "jobTitle",
          "title",
          "role",
          "designation",
          "position",
        ]),
        company: firstString(item, [
          "company",
          "employer",
          "organization",
          "organisation",
        ]),
        duration: firstString(item, [
          "duration",
          "dates",
          "dateRange",
          "period",
          "tenure",
        ]),
        location: firstString(item, [
          "location",
          "city",
          "workLocation",
        ]),
        bullets: uniqueStrings(bullets, 6),
      };
    })
    .filter(
      (item) =>
        Boolean(item.jobTitle || item.company) &&
        item.bullets.length > 0
    );
}

function sanitizeExperience(
  experience: TailoredExperience[] | undefined
): TailoredExperience[] {
  if (!Array.isArray(experience)) return [];

  return experience
    .filter(
      (item): item is TailoredExperience =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      jobTitle: cleanString(item.jobTitle),
      company: cleanString(item.company),
      duration: cleanString(item.duration),
      location: cleanString(item.location),
      bullets: uniqueStrings(item.bullets, 6),
    }))
    .filter(
      (item) =>
        Boolean(item.jobTitle || item.company) &&
        item.bullets.length > 0
    );
}

function extractFallbackEducation(
  report: ResumeReport
): TailoredEducation[] {
  const candidates: unknown[] = [];

  if (Array.isArray(report.education)) {
    candidates.push(...report.education);
  }

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of ["education", "academicBackground"]) {
      const value = profile[key];
      if (Array.isArray(value)) candidates.push(...value);
    }
  }

  return candidates
    .filter(isRecord)
    .map((item) => ({
      degree: firstString(item, [
        "degree",
        "qualification",
        "course",
        "program",
      ]),
      college: firstString(item, [
        "college",
        "institution",
        "university",
        "school",
      ]),
      year: firstString(item, [
        "year",
        "graduationYear",
        "duration",
        "dates",
      ]),
    }))
    .filter((item) => Boolean(item.degree || item.college));
}

function sanitizeEducation(
  education: TailoredEducation[] | undefined
): TailoredEducation[] {
  if (!Array.isArray(education)) return [];

  return education
    .filter(
      (item): item is TailoredEducation =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      degree: cleanString(item.degree),
      college: cleanString(item.college),
      year: cleanString(item.year),
    }))
    .filter((item) => Boolean(item.degree || item.college));
}

function extractFallbackProjects(
  report: ResumeReport
): TailoredProject[] {
  const candidates: unknown[] = [];

  if (Array.isArray(report.projects)) {
    candidates.push(...report.projects);
  }

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of [
      "projects",
      "academicProjects",
      "personalProjects",
    ]) {
      const value = profile[key];
      if (Array.isArray(value)) candidates.push(...value);
    }
  }

  return candidates
    .filter(isRecord)
    .map((item) => ({
      title: firstString(item, ["title", "name", "projectName"]),
      description: firstString(item, [
        "description",
        "summary",
        "details",
      ]),
    }))
    .filter((item) => Boolean(item.title && item.description))
    .slice(0, 6);
}

function sanitizeProjects(
  projects: TailoredProject[] | undefined
): TailoredProject[] {
  if (!Array.isArray(projects)) return [];

  return projects
    .filter(
      (item): item is TailoredProject =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      title: cleanString(item.title),
      description: cleanString(item.description),
    }))
    .filter((item) => Boolean(item.title && item.description))
    .slice(0, 6);
}

function extractFallbackCertifications(
  report: ResumeReport
): string[] {
  const values: unknown[] = [];

  if (Array.isArray(report.certifications)) {
    values.push(...report.certifications);
  }

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of ["certifications", "certificates", "licenses"]) {
      const value = profile[key];
      if (Array.isArray(value)) values.push(...value);
    }
  }

  return normalizeUnknownStringList(values);
}

function extractFallbackSkills(report: ResumeReport): string[] {
  const values: unknown[] = [];

  if (Array.isArray(report.optimizedSkills)) {
    values.push(...report.optimizedSkills);
  }

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of [
      "coreSkills",
      "skills",
      "tools",
      "domains",
      "processes",
      "industries",
    ]) {
      const value = profile[key];
      if (Array.isArray(value)) values.push(...value);
    }
  }

  return normalizeUnknownStringList(values);
}

function createSummaryFallback(
  report: ResumeReport,
  strategy: JobStrategy
): string {
  const identity =
    cleanString(report.professionalIdentity) ||
    cleanString(report.headline);

  const experience = cleanString(report.totalExperience);
  const targetRole = cleanString(strategy.targetRole);
  const matches = uniqueStrings(strategy.strongestCandidateMatches, 3);

  return [identity, experience, targetRole, matches.join(", ")]
    .filter(Boolean)
    .join(". ");
}

function mergeEducation(
  primary: TailoredEducation[],
  fallback: TailoredEducation[]
): TailoredEducation[] {
  const seen = new Set<string>();
  const output: TailoredEducation[] = [];

  for (const item of [...primary, ...fallback]) {
    const key = `${item.degree}|${item.college}|${item.year}`
      .toLowerCase()
      .trim();

    if (!key || seen.has(key)) continue;

    seen.add(key);
    output.push(item);
  }

  return output.slice(0, 8);
}

function mergeProjects(
  primary: TailoredProject[],
  fallback: TailoredProject[]
): TailoredProject[] {
  const seen = new Set<string>();
  const output: TailoredProject[] = [];

  for (const item of [...primary, ...fallback]) {
    const key = `${item.title}|${item.description}`
      .toLowerCase()
      .trim();

    if (!key || seen.has(key)) continue;

    seen.add(key);
    output.push(item);
  }

  return output.slice(0, 6);
}

function mergeUniqueStrings(
  primary: unknown,
  fallback: unknown,
  maximum: number
): string[] {
  return uniqueStrings(
    [
      ...(Array.isArray(primary) ? primary : []),
      ...(Array.isArray(fallback) ? fallback : []),
    ],
    maximum
  );
}

function normalizeUnknownStringList(values: unknown[]): string[] {
  const output: string[] = [];

  for (const value of values) {
    if (typeof value === "string") {
      output.push(value);
      continue;
    }

    if (isRecord(value)) {
      const text = firstString(value, [
        "name",
        "title",
        "skill",
        "tool",
        "certification",
        "certificate",
      ]);

      if (text) output.push(text);
    }
  }

  return uniqueStrings(output, 30);
}

function firstString(record: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && cleanString(value)) {
      return cleanString(value);
    }
  }

  return "";
}

function firstStringArray(
  record: UnknownRecord,
  keys: string[]
): string[] {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      const strings = normalizeUnknownStringList(value);
      if (strings.length > 0) return strings;
    }

    if (typeof value === "string") {
      const strings = value
        .split(/\n|•|\u2022/)
        .map(cleanString)
        .filter(Boolean);

      if (strings.length > 0) return strings;
    }
  }

  return [];
}

function uniqueStrings(values: unknown, maximum: number): string[] {
  if (!Array.isArray(values)) return [];

  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") continue;

    const cleaned = cleanString(value);
    const key = cleaned.toLowerCase();

    if (!cleaned || seen.has(key)) continue;

    seen.add(key);
    output.push(cleaned);

    if (output.length >= maximum) break;
  }

  return output;
}

function cleanString(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^[-•]\s*/, "")
    .trim();
}

function clampScore(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 70;
  }

  return Math.min(98, Math.max(0, Math.round(value)));
}

function parseJson<T>(text: string, message: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(message, { text, error });
    throw new Error(message);
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}