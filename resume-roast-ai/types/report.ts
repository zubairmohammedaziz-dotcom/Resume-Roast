export type ResumeExperience = {
  jobTitle: string;
  company: string;
  duration: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  college: string;
  year: string;
};

export type ResumeProject = {
  title: string;
  description: string;
};export interface JobMatch {
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  match: number;
  whyMatched: string[];
  missingSkills: string[];
}

export interface Report {
  success: boolean;
  message: string;
  fileName: string;
  candidateName: string;
headline: string;
contact: {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
};

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
  experience: ResumeExperience[];
education: ResumeEducation[];
certifications: string[];
projects: ResumeProject[];

  jobMatches: JobMatch[];
}