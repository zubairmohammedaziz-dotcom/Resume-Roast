import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

type UnknownRecord = Record<string, unknown>;

type SearchProfile = {
  candidateLevel: "fresher" | "junior" | "mid" | "senior" | "leadership";
  primaryRole: string;
  alternativeRoles: string[];
  searchQueries: string[];
  preferredLocations: string[];
  supportedSkills: string[];
  supportedIndustries: string[];
  excludedSeniorities: string[];
};

type NormalizedJob = {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  description: string;
  source: string;
  url: string;
  postedAt: string;
  employmentType: string;
};

type RankedJob = NormalizedJob & {
  match: number;
  whyMatched: string[];
  missingSkills: string[];
};

const searchProfileSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateLevel: {
      type: "string",
      enum: ["fresher", "junior", "mid", "senior", "leadership"],
    },
    primaryRole: { type: "string" },
    alternativeRoles: {
      type: "array",
      items: { type: "string" },
    },
    searchQueries: {
      type: "array",
      items: { type: "string" },
    },
    preferredLocations: {
      type: "array",
      items: { type: "string" },
    },
    supportedSkills: {
      type: "array",
      items: { type: "string" },
    },
    supportedIndustries: {
      type: "array",
      items: { type: "string" },
    },
    excludedSeniorities: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "candidateLevel",
    "primaryRole",
    "alternativeRoles",
    "searchQueries",
    "preferredLocations",
    "supportedSkills",
    "supportedIndustries",
    "excludedSeniorities",
  ],
} as const;

const PROFILE_INSTRUCTIONS = `
You are a senior India recruiter and job-search strategist.

Create a precise live-job search profile from the supplied resume report.

RULES
- Use only facts supported by the current resume report.
- Determine seniority conservatively.
- Never recommend management roles unless leadership scope is clearly supported.
- For freshers, use trainee, associate, junior, entry-level or executive searches.
- For experienced candidates, keep searches close to their real domain and transferable skills.
- Return 3 to 5 concise search queries suitable for Indian job APIs.
- Each query should normally contain a job title, not a sentence.
- Avoid vague searches such as "jobs", "business role" or "professional".
- supportedSkills must contain only defensible resume skills.
- excludedSeniorities should identify titles clearly above the candidate's level.
- Do not invent location preferences. Use the candidate's location when available,
  plus "India" and "Remote" only when reasonable.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!isRecord(body) || !isRecord(body.report)) {
      return NextResponse.json(
        { success: false, message: "Missing resume report." },
        { status: 400 }
      );
    }

    const report = body.report;
    const reportText = JSON.stringify(report);

    if (reportText.length > 100_000) {
      return NextResponse.json(
        { success: false, message: "Resume report is too large." },
        { status: 413 }
      );
    }

    const profile = await createSearchProfile(reportText);

    const queries = uniqueStrings(
      [profile.primaryRole, ...profile.searchQueries, ...profile.alternativeRoles],
      5
    );

    const locations = uniqueStrings(
      [...profile.preferredLocations, extractLocation(report), "India"],
      3
    );

    const providerCalls: Promise<NormalizedJob[]>[] = [];

    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      providerCalls.push(fetchAdzunaJobs(queries, locations));
    }

    if (process.env.JOOBLE_API_KEY) {
      providerCalls.push(fetchJoobleJobs(queries, locations));
    }

    if (providerCalls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Live job providers are not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY, or JOOBLE_API_KEY.",
        },
        { status: 500 }
      );
    }

    const results = await Promise.allSettled(providerCalls);

    const liveJobs = dedupeJobs(
      results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : []
      )
    );

    if (liveJobs.length === 0) {
      console.error(
        "All live job providers returned no usable jobs.",
        results.map((result) =>
          result.status === "rejected"
            ? String(result.reason)
            : `fulfilled:${result.value.length}`
        )
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "No live jobs were found for this profile. Please try again shortly.",
        },
        { status: 502 }
      );
    }

    const ranked = liveJobs
      .map((job) => rankJob(job, profile))
      .filter((job) => job.match >= 45)
      .sort((a, b) => {
        if (b.match !== a.match) return b.match - a.match;
        return dateValue(b.postedAt) - dateValue(a.postedAt);
      });

    const diverse = diversifyResults(ranked, 8);

    return NextResponse.json(
      diverse.map((job) => ({
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        match: job.match,
        whyMatched: job.whyMatched,
        missingSkills: job.missingSkills,
        description: job.description,
        url: job.url,
        source: job.source,
        postedAt: job.postedAt,
        employmentType: job.employmentType,
        isLive: true,
      }))
    );
  } catch (error) {
    console.error("Jobs API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate live job matches.",
      },
      { status: 500 }
    );
  }
}

async function createSearchProfile(
  reportText: string
): Promise<SearchProfile> {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: PROFILE_INSTRUCTIONS,
    input: `
CURRENT RESUME REPORT
---------------------
${reportText}

Create a conservative live-job search profile for India.
Return only the structured result.
`,
    text: {
      format: {
        type: "json_schema",
        name: "live_job_search_profile",
        strict: true,
        schema: searchProfileSchema,
      },
    },
    max_output_tokens: 2200,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error("Could not create a job-search profile.");
  }

  try {
    return JSON.parse(text) as SearchProfile;
  } catch (error) {
    console.error("Invalid search profile:", { text, error });
    throw new Error("The job-search profile could not be processed.");
  }
}

async function fetchAdzunaJobs(
  queries: string[],
  locations: string[]
): Promise<NormalizedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) return [];

  const requests = queries.slice(0, 4).map(async (query, index) => {
    const location = locations[index % Math.max(locations.length, 1)] || "India";

    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: "12",
      what: query,
      where: normalizeProviderLocation(location),
      sort_by: "date",
      "content-type": "application/json",
    });

    const url =
      `https://api.adzuna.com/v1/api/jobs/in/search/1?${params.toString()}`;

    const response = await fetchWithTimeout(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`Adzuna returned ${response.status}`);
    }

    const data = (await response.json()) as UnknownRecord;
    const results = Array.isArray(data.results) ? data.results : [];

    return results
      .filter(isRecord)
      .map(normalizeAdzunaJob)
      .filter((job): job is NormalizedJob => Boolean(job));
  });

  const settled = await Promise.allSettled(requests);

  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

function normalizeAdzunaJob(
  item: UnknownRecord
): NormalizedJob | null {
  const title = cleanString(item.title);
  const redirectUrl = cleanString(item.redirect_url);

  if (!title || !redirectUrl) return null;

  const company = isRecord(item.company)
    ? cleanString(item.company.display_name)
    : "";

  const location = isRecord(item.location)
    ? cleanString(item.location.display_name)
    : "";

  const salaryMin = toFiniteNumber(item.salary_min);
  const salaryMax = toFiniteNumber(item.salary_max);

  return {
    id: `adzuna:${cleanString(item.id) || redirectUrl}`,
    company: company || "Employer not listed",
    role: title,
    location: location || "India",
    salary: formatSalary(salaryMin, salaryMax, "INR"),
    description: stripHtml(cleanString(item.description)),
    source: "Adzuna",
    url: redirectUrl,
    postedAt: cleanString(item.created),
    employmentType:
      cleanString(item.contract_time) ||
      cleanString(item.contract_type) ||
      "Not specified",
  };
}

async function fetchJoobleJobs(
  queries: string[],
  locations: string[]
): Promise<NormalizedJob[]> {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) return [];

  const requests = queries.slice(0, 4).map(async (query, index) => {
    const location = locations[index % Math.max(locations.length, 1)] || "India";

    const response = await fetchWithTimeout(
      `https://jooble.org/api/${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          keywords: query,
          location: normalizeProviderLocation(location),
          radius: "80",
          page: "1",
          ResultOnPage: "12",
          SearchMode: "0",
          companysearch: "false",
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Jooble returned ${response.status}`);
    }

    const data = (await response.json()) as UnknownRecord;
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];

    return jobs
      .filter(isRecord)
      .map(normalizeJoobleJob)
      .filter((job): job is NormalizedJob => Boolean(job));
  });

  const settled = await Promise.allSettled(requests);

  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

function normalizeJoobleJob(
  item: UnknownRecord
): NormalizedJob | null {
  const title = cleanString(item.title);
  const link = cleanString(item.link);

  if (!title || !link) return null;

  return {
    id: `jooble:${cleanString(item.id) || link}`,
    company: cleanString(item.company) || "Employer not listed",
    role: title,
    location: cleanString(item.location) || "India",
    salary: cleanString(item.salary) || "Not disclosed",
    description: stripHtml(cleanString(item.snippet)),
    source: cleanString(item.source) || "Jooble",
    url: link,
    postedAt: cleanString(item.updated),
    employmentType: cleanString(item.type) || "Not specified",
  };
}

function rankJob(
  job: NormalizedJob,
  profile: SearchProfile
): RankedJob {
  const roleText = normalizeForMatch(job.role);
  const descriptionText = normalizeForMatch(job.description);
  const combinedText = `${roleText} ${descriptionText}`;

  const targetRoles = uniqueStrings(
    [profile.primaryRole, ...profile.alternativeRoles],
    8
  );

  const supportedSkills = uniqueStrings(profile.supportedSkills, 30);
  const industries = uniqueStrings(profile.supportedIndustries, 12);

  const roleMatches = targetRoles.filter((role) =>
    hasMeaningfulOverlap(roleText, normalizeForMatch(role))
  );

  const skillMatches = supportedSkills.filter((skill) =>
    containsPhrase(combinedText, skill)
  );

  const industryMatches = industries.filter((industry) =>
    containsPhrase(combinedText, industry)
  );

  const seniorityPenalty = calculateSeniorityPenalty(
    job.role,
    profile.candidateLevel,
    profile.excludedSeniorities
  );

  const locationFit = calculateLocationFit(
    job.location,
    profile.preferredLocations
  );

  const freshness = calculateFreshness(job.postedAt);

  let score = 38;
  score += Math.min(28, roleMatches.length * 14);
  score += Math.min(22, skillMatches.length * 3);
  score += Math.min(7, industryMatches.length * 3);
  score += locationFit;
  score += freshness;
  score -= seniorityPenalty;

  if (roleMatches.length === 0) score -= 10;
  if (skillMatches.length === 0) score -= 8;

  const match = Math.max(35, Math.min(96, Math.round(score)));

  const whyMatched = buildReasons(
    job,
    roleMatches,
    skillMatches,
    industryMatches,
    profile
  );

  const missingSkills = supportedSkills
    .filter((skill) => !containsPhrase(combinedText, skill))
    .slice(0, 3);

  return {
    ...job,
    match,
    whyMatched,
    missingSkills,
  };
}

function buildReasons(
  job: NormalizedJob,
  roleMatches: string[],
  skillMatches: string[],
  industryMatches: string[],
  profile: SearchProfile
): string[] {
  const reasons: string[] = [];

  if (roleMatches.length > 0) {
    reasons.push(
      `The role closely aligns with the candidate's supported ${roleMatches[0]} profile.`
    );
  }

  if (skillMatches.length > 0) {
    reasons.push(
      `The posting references relevant experience such as ${skillMatches
        .slice(0, 3)
        .join(", ")}.`
    );
  }

  if (industryMatches.length > 0) {
    reasons.push(
      `The employer context overlaps with the candidate's ${industryMatches[0]} background.`
    );
  }

  if (
    profile.candidateLevel === "fresher" ||
    profile.candidateLevel === "junior"
  ) {
    reasons.push(
      "The title appears compatible with an entry-level or early-career profile."
    );
  } else {
    reasons.push(
      `The title appears consistent with the candidate's ${profile.candidateLevel}-level experience.`
    );
  }

  if (job.postedAt) {
    reasons.push("This is a live listing returned by the job provider.");
  }

  return uniqueStrings(reasons, 3);
}

function diversifyResults(
  jobs: RankedJob[],
  maximum: number
): RankedJob[] {
  const selected: RankedJob[] = [];
  const companyCounts = new Map<string, number>();
  const roleCounts = new Map<string, number>();

  for (const job of jobs) {
    const companyKey = normalizeForMatch(job.company);
    const roleKey = normalizeRoleFamily(job.role);

    if ((companyCounts.get(companyKey) || 0) >= 1) continue;
    if ((roleCounts.get(roleKey) || 0) >= 2) continue;

    selected.push(job);
    companyCounts.set(companyKey, 1);
    roleCounts.set(roleKey, (roleCounts.get(roleKey) || 0) + 1);

    if (selected.length >= maximum) break;
  }

  if (selected.length < Math.min(5, maximum)) {
    for (const job of jobs) {
      if (selected.some((item) => item.id === job.id)) continue;
      selected.push(job);
      if (selected.length >= maximum) break;
    }
  }

  return selected;
}

function dedupeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Set<string>();
  const output: NormalizedJob[] = [];

  for (const job of jobs) {
    const key = [
      normalizeForMatch(job.role),
      normalizeForMatch(job.company),
      normalizeForMatch(job.location),
    ].join("|");

    if (!job.url || seen.has(key)) continue;

    seen.add(key);
    output.push(job);
  }

  return output;
}

function calculateSeniorityPenalty(
  role: string,
  level: SearchProfile["candidateLevel"],
  excludedSeniorities: string[]
): number {
  const normalized = normalizeForMatch(role);

  if (
    excludedSeniorities.some((title) =>
      containsPhrase(normalized, title)
    )
  ) {
    return 30;
  }

  const leadershipTerms = [
    "manager",
    "senior manager",
    "director",
    "head",
    "vice president",
    "vp",
    "lead",
    "principal",
  ];

  const juniorTerms = [
    "intern",
    "trainee",
    "fresher",
    "junior",
    "associate",
    "entry level",
  ];

  const hasLeadership = leadershipTerms.some((term) =>
    containsPhrase(normalized, term)
  );

  const hasJunior = juniorTerms.some((term) =>
    containsPhrase(normalized, term)
  );

  if (
    (level === "fresher" || level === "junior") &&
    hasLeadership
  ) {
    return 32;
  }

  if (level === "mid" && hasLeadership) {
    return 14;
  }

  if (
    (level === "senior" || level === "leadership") &&
    hasJunior
  ) {
    return 18;
  }

  return 0;
}

function calculateLocationFit(
  jobLocation: string,
  preferredLocations: string[]
): number {
  const normalizedLocation = normalizeForMatch(jobLocation);

  if (
    containsPhrase(normalizedLocation, "remote") ||
    containsPhrase(normalizedLocation, "india")
  ) {
    return 5;
  }

  const matches = preferredLocations.some((location) =>
    hasMeaningfulOverlap(
      normalizedLocation,
      normalizeForMatch(location)
    )
  );

  return matches ? 7 : 1;
}

function calculateFreshness(postedAt: string): number {
  const timestamp = dateValue(postedAt);

  if (!timestamp) return 0;

  const ageDays =
    (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

  if (ageDays <= 3) return 7;
  if (ageDays <= 7) return 5;
  if (ageDays <= 14) return 3;
  if (ageDays <= 30) return 1;

  return -3;
}

function extractLocation(report: UnknownRecord): string {
  const directContact = isRecord(report.contact)
    ? cleanString(report.contact.location)
    : "";

  if (directContact) return directContact;

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;

  if (profile) {
    for (const key of ["location", "city", "currentLocation"]) {
      const value = cleanString(profile[key]);
      if (value) return value;
    }
  }

  return "";
}

function normalizeProviderLocation(location: string): string {
  const cleaned = cleanString(location);

  if (!cleaned || /^remote$/i.test(cleaned)) {
    return "India";
  }

  return cleaned;
}

function formatSalary(
  minimum: number | null,
  maximum: number | null,
  currency: string
): string {
  if (minimum === null && maximum === null) {
    return "Not disclosed";
  }

  const format = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  if (minimum !== null && maximum !== null) {
    return `${currency} ${format(minimum)} - ${format(maximum)} per year`;
  }

  const value = minimum ?? maximum;

  return `${currency} ${format(value as number)} per year`;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { next?: { revalidate: number } } = {},
  timeoutMs = 10_000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeRoleFamily(role: string): string {
  return normalizeForMatch(role)
    .replace(
      /\b(senior|sr|junior|jr|associate|executive|specialist|analyst|officer|lead)\b/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(
  haystack: string,
  phrase: string
): boolean {
  const normalizedPhrase = normalizeForMatch(phrase);

  if (!normalizedPhrase) return false;

  return haystack.includes(normalizedPhrase);
}

function hasMeaningfulOverlap(
  left: string,
  right: string
): boolean {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);

  if (rightTokens.size === 0) return false;

  let matches = 0;

  for (const token of rightTokens) {
    if (leftTokens.has(token)) matches += 1;
  }

  return matches / rightTokens.size >= 0.5;
}

function tokenSet(value: string): Set<string> {
  const stopWords = new Set([
    "and",
    "or",
    "the",
    "a",
    "an",
    "of",
    "for",
    "to",
    "in",
    "with",
    "jobs",
    "job",
  ]);

  return new Set(
    normalizeForMatch(value)
      .split(" ")
      .filter(
        (token) =>
          token.length > 1 && !stopWords.has(token)
      )
  );
}

function normalizeForMatch(value: string): string {
  return cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(
  values: unknown,
  maximum: number
): string[] {
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

function dateValue(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
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

function isRecord(value: unknown): value is UnknownRecord {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}