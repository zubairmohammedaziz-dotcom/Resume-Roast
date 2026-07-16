export type ResumeExperience = {
  jobTitle: string;
  company: string;
  duration: string;
  location?: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  college: string;
  year: string;
  location?: string;
};

export type ResumeProject = {
  title: string;
  description: string;
  technologies?: string[];
};

export type JobPlatform =
  | "linkedin"
  | "indeed"
  | "foundit"
  | "naukri"
  | "apna";

export type JobSearchLinks = Partial<Record<JobPlatform, string>>;

export type JobSeniority =
  | "Internship"
  | "Entry Level"
  | "Associate"
  | "Mid Level"
  | "Senior"
  | "Lead"
  | "Manager"
  | "Senior Manager"
  | "Director";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface JobMatch {
  id?: string;

  company: string;
  role: string;
  location: string;
  salary: string;

  match: number;
  whyMatched: string[];
  missingSkills: string[];

  seniority?: JobSeniority;
  workModes?: WorkMode[];
  searchKeywords?: string[];

  searchLinks?: JobSearchLinks;

  /**
   * Temporary backward compatibility.
   * Remove once every component uses searchLinks.
   */
  url?: string;
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