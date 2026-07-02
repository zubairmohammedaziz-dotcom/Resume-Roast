export interface JobMatch {
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  match: number;
}

export interface Report {
  success: boolean;
  message: string;
  fileName: string;

  atsScore: number;
  recruiterScore: number;
  hiringProbability: string;

  roast: string;
  funnyRoast?: string;

  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];

  improvedSummary: string;
  rewrittenBullets: string[];
  optimizedSkills: string[];
  interviewQuestions: string[];

  jobMatches: JobMatch[];
}