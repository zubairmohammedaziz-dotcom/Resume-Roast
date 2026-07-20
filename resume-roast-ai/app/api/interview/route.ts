import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type UnknownRecord = Record<string, unknown>;

type Difficulty = "Foundation" | "Intermediate" | "Advanced";
type QuestionCategory =
  | "Introduction"
  | "Behavioral"
  | "Leadership"
  | "Role-specific"
  | "HR and closing";

type InterviewQuestion = {
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  whyItIsAsked: string;
  answerStrategy: string;
  sampleAnswer: string;
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  recruiterScorecard: string[];
  followUpQuestions: string[];
  mistakesToAvoid: string[];
};

type InterviewPack = {
  targetRole: string;
  employerName: string;
  interviewReadinessScore: number;
  readinessSummary: string;
  strongestThemes: string[];
  preparationGaps: string[];
  openingPitch: string;
  questions: InterviewQuestion[];
  questionsToAsk: string[];
  salaryAnswer: string;
  finalTips: string[];
};

const interviewPackSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetRole: { type: "string" },
    employerName: { type: "string" },
    interviewReadinessScore: { type: "number" },
    readinessSummary: { type: "string" },
    strongestThemes: {
      type: "array",
      items: { type: "string" },
    },
    preparationGaps: {
      type: "array",
      items: { type: "string" },
    },
    openingPitch: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: {
            type: "string",
            enum: [
              "Introduction",
              "Behavioral",
              "Leadership",
              "Role-specific",
              "HR and closing",
            ],
          },
          difficulty: {
            type: "string",
            enum: ["Foundation", "Intermediate", "Advanced"],
          },
          question: { type: "string" },
          whyItIsAsked: { type: "string" },
          answerStrategy: { type: "string" },
          sampleAnswer: { type: "string" },
          starFramework: {
            type: "object",
            additionalProperties: false,
            properties: {
              situation: { type: "string" },
              task: { type: "string" },
              action: { type: "string" },
              result: { type: "string" },
            },
            required: ["situation", "task", "action", "result"],
          },
          recruiterScorecard: {
            type: "array",
            items: { type: "string" },
          },
          followUpQuestions: {
            type: "array",
            items: { type: "string" },
          },
          mistakesToAvoid: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "category",
          "difficulty",
          "question",
          "whyItIsAsked",
          "answerStrategy",
          "sampleAnswer",
          "starFramework",
          "recruiterScorecard",
          "followUpQuestions",
          "mistakesToAvoid",
        ],
      },
    },
    questionsToAsk: {
      type: "array",
      items: { type: "string" },
    },
    salaryAnswer: { type: "string" },
    finalTips: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "targetRole",
    "employerName",
    "interviewReadinessScore",
    "readinessSummary",
    "strongestThemes",
    "preparationGaps",
    "openingPitch",
    "questions",
    "questionsToAsk",
    "salaryAnswer",
    "finalTips",
  ],
} as const;

const INTERVIEW_COACH_INSTRUCTIONS = `
You are an elite interview coach, senior recruiter and hiring manager.

Create a premium, role-specific interview preparation pack from the verified
candidate evidence and target job description.

The pack must help the candidate prepare truthful, structured and defensible
answers. It must not encourage memorized, exaggerated or invented responses.

SOURCE OF TRUTH
Candidate evidence is the only source of candidate facts.

Never invent or infer unsupported:
- employers, job titles, dates, promotions or locations
- tools, certifications, qualifications or domain expertise
- metrics, revenue, percentages, volumes, team sizes or achievements
- responsibilities, leadership scope or years of experience
- company facts that are not clearly stated in the job description

A job-description requirement is not proof the candidate possesses that skill.

QUESTION MIX
Return exactly 15 questions:
- 2 Introduction
- 4 Behavioral
- 3 Leadership
- 4 Role-specific
- 2 HR and closing

Questions must be tailored to the actual role. Do not force operations,
leadership, sales, technology or management questions when the role does not
require them.

QUESTION QUALITY
Questions should:
- reflect likely recruiter and hiring-manager evaluation
- test the most important responsibilities and risks in the job description
- cover strengths and genuine gaps
- progress from foundation to advanced difficulty
- avoid duplicates and generic filler
- include realistic follow-up pressure testing

SAMPLE ANSWERS
Each sampleAnswer must:
- be 100 to 170 words
- sound natural when spoken
- answer the question directly
- use verified candidate evidence only
- use STAR structure where appropriate
- avoid unsupported numbers, achievements or claims
- avoid clichés and excessive corporate jargon
- remain editable and adaptable by the candidate

When evidence is insufficient for a complete example:
- do not fabricate details
- explicitly guide the candidate to insert a real example
- provide a safe answer structure using known evidence

STAR FRAMEWORK
For every question return concise coaching notes for:
- situation
- task
- action
- result

For questions that are not naturally behavioral, use the STAR fields as an
answer-planning structure. Never invent a result.

RECRUITER SCORECARD
Return 3 to 5 concise signals the interviewer will evaluate.

FOLLOW-UPS
Return 2 realistic follow-up questions for every question.

MISTAKES
Return 2 to 4 specific mistakes to avoid for every question.

OPENING PITCH
Write a 60 to 90 second "Tell me about yourself" answer:
- present role or professional identity
- relevant experience
- strongest supported capabilities
- reason for fit with the target role
- no unsupported claims
- no personal history unrelated to the role

READINESS
Score readiness honestly from 0 to 98 based only on demonstrated evidence.
Preparation gaps should be interview-preparation gaps, not invented candidate flaws.

SALARY ANSWER
Provide a professional, flexible response that avoids inventing salary figures.
It should encourage the candidate to state a researched range when ready.

QUESTIONS TO ASK
Return 6 intelligent questions tailored to the role. Avoid questions easily
answered by the job description.

FINAL TIPS
Return 8 concise, practical tips covering delivery, STAR structure, evidence,
clarity, follow-up questions and closing.

Return valid structured output only.
`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "OPENAI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const jobDescription =
      typeof body.jobDescription === "string"
        ? body.jobDescription.trim()
        : "";

    if (jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a complete job description of at least 100 characters.",
        },
        { status: 400 }
      );
    }

    const candidateEvidence = {
      summary: cleanString(body.resumeSummary),
      experienceHighlights: normalizeStringArray(body.resumeBullets, 30),
      skills: normalizeStringArray(body.skills, 30),
    };

    const evidenceText = JSON.stringify(candidateEvidence);

    if (evidenceText.length > 80_000) {
      return NextResponse.json(
        {
          success: false,
          message: "The resume context is too large to process.",
        },
        { status: 413 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      instructions: INTERVIEW_COACH_INSTRUCTIONS,
      input: `
VERIFIED CANDIDATE EVIDENCE
---------------------------
${evidenceText}

TARGET JOB DESCRIPTION
----------------------
${jobDescription}

Create the premium interview preparation pack.
Return only the structured result.
`,
      text: {
        format: {
          type: "json_schema",
          name: "premium_interview_pack",
          strict: true,
          schema: interviewPackSchema,
        },
      },
      max_output_tokens: 12000,
    });

    const outputText = response.output_text?.trim();

    if (!outputText) {
      console.error("Interview API returned no output:", {
        responseId: response.id,
        status: response.status,
      });

      throw new Error("The AI returned an empty interview pack.");
    }

    const parsed = parseJson<InterviewPack>(
      outputText,
      "The interview preparation could not be processed."
    );

    const questions = sanitizeQuestions(parsed.questions).slice(0, 15);

    if (questions.length < 10) {
      throw new Error(
        "The interview preparation was incomplete. Please generate it again."
      );
    }

    return NextResponse.json({
      success: true,
      targetRole: cleanString(parsed.targetRole) || "Target role",
      employerName: cleanString(parsed.employerName),
      interviewReadinessScore: clampScore(
        parsed.interviewReadinessScore
      ),
      readinessSummary: cleanString(parsed.readinessSummary),
      strongestThemes: normalizeStringArray(
        parsed.strongestThemes,
        6
      ),
      preparationGaps: normalizeStringArray(
        parsed.preparationGaps,
        6
      ),
      openingPitch: cleanMultilineText(parsed.openingPitch),
      questions,
      questionsToAsk: normalizeStringArray(
        parsed.questionsToAsk,
        6
      ),
      salaryAnswer: cleanMultilineText(parsed.salaryAnswer),
      finalTips: normalizeStringArray(parsed.finalTips, 8),
    });
  } catch (error) {
    console.error("Interview API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate interview preparation.",
      },
      { status: 500 }
    );
  }
}

function sanitizeQuestions(
  value: unknown
): InterviewQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item) => {
      const star = isRecord(item.starFramework)
        ? item.starFramework
        : {};

      return {
        category: normalizeCategory(item.category),
        difficulty: normalizeDifficulty(item.difficulty),
        question: cleanString(item.question),
        whyItIsAsked: cleanString(item.whyItIsAsked),
        answerStrategy: cleanString(item.answerStrategy),
        sampleAnswer: cleanMultilineText(item.sampleAnswer),
        starFramework: {
          situation: cleanString(star.situation),
          task: cleanString(star.task),
          action: cleanString(star.action),
          result: cleanString(star.result),
        },
        recruiterScorecard: normalizeStringArray(
          item.recruiterScorecard,
          5
        ),
        followUpQuestions: normalizeStringArray(
          item.followUpQuestions,
          2
        ),
        mistakesToAvoid: normalizeStringArray(
          item.mistakesToAvoid,
          4
        ),
      };
    })
    .filter(
      (item) =>
        Boolean(item.question) &&
        Boolean(item.sampleAnswer)
    );
}

function normalizeCategory(
  value: unknown
): QuestionCategory {
  if (
    value === "Introduction" ||
    value === "Behavioral" ||
    value === "Leadership" ||
    value === "Role-specific" ||
    value === "HR and closing"
  ) {
    return value;
  }

  return "Role-specific";
}

function normalizeDifficulty(
  value: unknown
): Difficulty {
  if (
    value === "Foundation" ||
    value === "Intermediate" ||
    value === "Advanced"
  ) {
    return value;
  }

  return "Intermediate";
}

function normalizeStringArray(
  value: unknown,
  maximum: number
): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const output: string[] = [];

  for (const item of value) {
    const cleaned = cleanString(item);
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
    .trim();
}

function cleanMultilineText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
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