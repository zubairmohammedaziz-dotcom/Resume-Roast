import { NextRequest, NextResponse } from "next/server";
import openai from "../../../lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

type UnknownRecord = Record<string, unknown>;
type CandidateLevel = "fresher" | "junior" | "mid" | "senior" | "leadership";
type WorkMode = "onsite" | "hybrid" | "remote";
type EmploymentType = "full_time" | "part_time" | "contract" | "internship";

type SearchProfile = {
  candidateLevel: CandidateLevel;
  primaryRole: string;
  alternativeRoles: string[];
  searchQueries: string[];
  preferredLocations: string[];
  supportedSkills: string[];
  supportedIndustries: string[];
  excludedSeniorities: string[];
  workModes: WorkMode[];
  employmentTypes: EmploymentType[];
};

type SearchPlan = {
  query: string;
  location: string;
  workMode: WorkMode | "any";
  employmentType: EmploymentType | "any";
};

type NormalizedJob = {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryIsPredicted: boolean;
  description: string;
  source: "Adzuna" | "Jooble";
  url: string;
  postedAt: string;
  employmentType: string;
  workMode: WorkMode;
  category: string;
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
    alternativeRoles: { type: "array", items: { type: "string" } },
    searchQueries: { type: "array", items: { type: "string" } },
    preferredLocations: { type: "array", items: { type: "string" } },
    supportedSkills: { type: "array", items: { type: "string" } },
    supportedIndustries: { type: "array", items: { type: "string" } },
    excludedSeniorities: { type: "array", items: { type: "string" } },
    workModes: {
      type: "array",
      items: { type: "string", enum: ["onsite", "hybrid", "remote"] },
    },
    employmentTypes: {
      type: "array",
      items: {
        type: "string",
        enum: ["full_time", "part_time", "contract", "internship"],
      },
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
    "workModes",
    "employmentTypes",
  ],
} as const;

const PROFILE_INSTRUCTIONS = `
You are a senior India recruiter and job-search strategist.

Create a precise profile for finding LIVE jobs through the Adzuna and Jooble APIs in India.

RULES
- Use only facts supported by the resume report.
- Determine seniority conservatively.
- Never recommend management roles without evidence of leadership scope.
- For freshers, prefer trainee, associate, junior, entry-level, intern or executive titles.
- primaryRole must be the strongest single target title.
- alternativeRoles must contain 2 to 5 realistic adjacent titles.
- searchQueries must contain 3 to 6 concise job titles, not sentences.
- Do not include the words job or jobs in searchQueries.
- Avoid vague searches such as professional, business role, office work or management.
- supportedSkills and supportedIndustries must be defensible from the resume.
- excludedSeniorities must list titles clearly above the candidate's level.
- Do not invent a city or salary preference.
- Include remote when the candidate's profile can reasonably support remote work.
- Default employmentTypes to full_time when no preference is stated.
`;

const MAX_REPORT_LENGTH = 100_000;
const MAX_RESULTS = 10;
const MIN_MATCH_SCORE = 48;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!isRecord(body) || !isRecord(body.report)) {
      return NextResponse.json(
        { success: false, message: "Missing resume report." },
        { status: 400 },
      );
    }

    const adzunaConfigured =
      Boolean(process.env.ADZUNA_APP_ID) && Boolean(process.env.ADZUNA_APP_KEY);
    const joobleConfigured = Boolean(process.env.JOOBLE_API_KEY);

    if (!adzunaConfigured && !joobleConfigured) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No job provider is configured. Add Adzuna credentials or JOOBLE_API_KEY.",
        },
        { status: 500 },
      );
    }

    const report = body.report;
    const reportText = JSON.stringify(report);

    if (reportText.length > MAX_REPORT_LENGTH) {
      return NextResponse.json(
        { success: false, message: "Resume report is too large." },
        { status: 413 },
      );
    }

    const profile = await createSearchProfile(reportText);
    const plans = buildSearchPlans(profile, report);

    const [adzunaJobs, joobleJobs] = await Promise.all([
      fetchAdzunaJobs(plans),
      fetchJoobleJobs(plans),
    ]);

    const liveJobs = dedupeJobs([...adzunaJobs, ...joobleJobs]);

    if (liveJobs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No live jobs were returned by the configured providers. Try again with a broader role or location.",
        },
        { status: 502 },
      );
    }

    const ranked = liveJobs
      .map((job) => rankJob(job, profile))
      .filter((job) => job.match >= MIN_MATCH_SCORE)
      .sort(compareRankedJobs);

    const selected = diversifyResults(ranked, MAX_RESULTS);

    if (selected.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Live jobs were found, but none met the minimum relevance standard for this resume.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      selected.map((job) => ({
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
        employmentType: formatJobArrangement(job),
        workMode: job.workMode,
        category: job.category,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryIsPredicted: job.salaryIsPredicted,
        isLive: true,
      })),
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
      { status: 500 },
    );
  }
}

async function createSearchProfile(reportText: string): Promise<SearchProfile> {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: PROFILE_INSTRUCTIONS,
    input: `CURRENT RESUME REPORT\n---------------------\n${reportText}\n\nCreate the most accurate India-focused search profile. Return only the structured result.`,
    text: {
      format: {
        type: "json_schema",
        name: "multi_provider_job_search_profile",
        strict: true,
        schema: searchProfileSchema,
      },
    },
    max_output_tokens: 2400,
  });

  const text = response.output_text?.trim();
  if (!text) throw new Error("Could not create a job-search profile.");

  try {
    const parsed = JSON.parse(text) as SearchProfile;
    return {
      ...parsed,
      primaryRole: cleanSearchTitle(parsed.primaryRole),
      alternativeRoles: uniqueStrings(
        parsed.alternativeRoles.map(cleanSearchTitle),
        5,
      ),
      searchQueries: uniqueStrings(
        parsed.searchQueries.map(cleanSearchTitle),
        6,
      ),
      preferredLocations: uniqueStrings(parsed.preferredLocations, 3),
      supportedSkills: uniqueStrings(parsed.supportedSkills, 35),
      supportedIndustries: uniqueStrings(parsed.supportedIndustries, 12),
      excludedSeniorities: uniqueStrings(parsed.excludedSeniorities, 12),
      workModes: parsed.workModes.length
        ? parsed.workModes
        : ["onsite", "remote"],
      employmentTypes: parsed.employmentTypes.length
        ? parsed.employmentTypes
        : ["full_time"],
    };
  } catch (error) {
    console.error("Invalid search profile:", { text, error });
    throw new Error("The job-search profile could not be processed.");
  }
}

function buildSearchPlans(
  profile: SearchProfile,
  report: UnknownRecord,
): SearchPlan[] {
  const roles = uniqueStrings(
    [
      profile.primaryRole,
      ...profile.searchQueries,
      ...profile.alternativeRoles,
    ],
    6,
  );

  const locations = uniqueStrings(
    [extractLocation(report), ...profile.preferredLocations],
    2,
  )
    .map(normalizeIndiaLocation)
    .filter(Boolean);

  const primaryLocation = locations[0] || "India";
  const secondaryLocation =
    locations.find(
      (value) =>
        normalizeForMatch(value) !== normalizeForMatch(primaryLocation),
    ) || "India";

  const plans: SearchPlan[] = roles.slice(0, 4).map((query) => ({
    query,
    location: primaryLocation,
    workMode: "any",
    employmentType: "any",
  }));

  if (
    normalizeForMatch(secondaryLocation) !== normalizeForMatch(primaryLocation)
  ) {
    plans.push({
      query: roles[0],
      location: secondaryLocation,
      workMode: "any",
      employmentType: "any",
    });
  }

  if (profile.workModes.includes("remote")) {
    plans.push({
      query: `${roles[0]} remote`,
      location: "India",
      workMode: "remote",
      employmentType: "any",
    });

    if (roles[1]) {
      plans.push({
        query: `${roles[1]} work from home`,
        location: "India",
        workMode: "remote",
        employmentType: "any",
      });
    }
  }

  if (profile.employmentTypes.includes("part_time")) {
    plans.push({
      query: roles[0],
      location: primaryLocation,
      workMode: "any",
      employmentType: "part_time",
    });
  }

  if (profile.employmentTypes.includes("contract")) {
    plans.push({
      query: roles[0],
      location: primaryLocation,
      workMode: "any",
      employmentType: "contract",
    });
  }

  if (profile.employmentTypes.includes("internship")) {
    plans.push({
      query: `${roles[0]} intern`,
      location: primaryLocation,
      workMode: "any",
      employmentType: "internship",
    });
  }

  return dedupeSearchPlans(plans).slice(0, 8);
}

async function fetchAdzunaJobs(plans: SearchPlan[]): Promise<NormalizedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const requests = plans.map(async (plan) => {
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: "30",
      what: plan.query,
      where: normalizeProviderLocation(plan.location),
      sort_by: "date",
      "content-type": "application/json",
    });

    if (plan.employmentType === "full_time") params.set("full_time", "1");
    if (plan.employmentType === "part_time") params.set("part_time", "1");
    if (plan.employmentType === "contract") params.set("contract", "1");

    const endpoint = `https://api.adzuna.com/v1/api/jobs/in/search/1?${params.toString()}`;

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "OffernHire/1.0",
          },
          cache: "no-store",
        },
        15_000,
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("Adzuna request failed:", {
          status: response.status,
          query: plan.query,
          location: plan.location,
          detail: detail.slice(0, 500),
        });
        return [];
      }

      const data = (await response.json()) as UnknownRecord;
      const results = Array.isArray(data.results) ? data.results : [];

      console.info("Adzuna results:", {
        query: plan.query,
        location: plan.location,
        count: results.length,
      });

      return results
        .filter(isRecord)
        .map(normalizeAdzunaJob)
        .filter((job): job is NormalizedJob => Boolean(job))
        .filter((job) => matchesSearchPlan(job, plan));
    } catch (error) {
      console.error("Adzuna request error:", {
        query: plan.query,
        location: plan.location,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  });

  const settled = await Promise.allSettled(requests);
  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

async function fetchJoobleJobs(plans: SearchPlan[]): Promise<NormalizedJob[]> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) return [];

  const requests = plans.slice(0, 6).map(async (plan) => {
    const endpoint = `https://jooble.org/api/${encodeURIComponent(apiKey)}`;
    const payload: Record<string, string> = {
      keywords: plan.query,
      location: normalizeProviderLocation(plan.location),
      radius: "80",
      page: "1",
      ResultOnPage: "30",
      SearchMode: "0",
      companysearch: "false",
    };

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "OffernHire/1.0",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        },
        15_000,
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("Jooble request failed:", {
          status: response.status,
          query: plan.query,
          location: plan.location,
          detail: detail.slice(0, 500),
        });
        return [];
      }

      const data = (await response.json()) as UnknownRecord;
      const jobs = Array.isArray(data.jobs) ? data.jobs : [];

      console.info("Jooble results:", {
        query: plan.query,
        location: plan.location,
        count: jobs.length,
      });

      return jobs
        .filter(isRecord)
        .map(normalizeJoobleJob)
        .filter((job): job is NormalizedJob => Boolean(job))
        .filter((job) => matchesSearchPlan(job, plan));
    } catch (error) {
      console.error("Jooble request error:", {
        query: plan.query,
        location: plan.location,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  });

  const settled = await Promise.allSettled(requests);
  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

function normalizeJoobleJob(item: UnknownRecord): NormalizedJob | null {
  const title = stripHtml(cleanString(item.title));
  const link = ensureHttps(cleanString(item.link));
  if (!title || !isSafeExternalJobUrl(link)) return null;

  const company = stripHtml(cleanString(item.company));
  const location = stripHtml(cleanString(item.location));
  const description = stripHtml(cleanString(item.snippet));
  const rawSalary = stripHtml(cleanString(item.salary));
  const employmentType = stripHtml(cleanString(item.type));
  const sourceLabel = stripHtml(cleanString(item.source));
  const combined = `${title} ${description} ${location} ${employmentType}`;
  const parsedSalary = parseJoobleSalary(rawSalary);

  return {
    id: `jooble:${cleanString(item.id) || link}`,
    company: company || "Employer not listed",
    role: title,
    location: location || "India",
    salary: rawSalary || "Not disclosed",
    salaryMin: parsedSalary.minimum,
    salaryMax: parsedSalary.maximum,
    salaryIsPredicted: false,
    description,
    source: "Jooble",
    url: link,
    postedAt: cleanString(item.updated),
    employmentType: employmentType || "Not specified",
    workMode: detectWorkMode(combined),
    category: sourceLabel || "General",
  };
}

function parseJoobleSalary(value: string): {
  minimum: number | null;
  maximum: number | null;
} {
  if (!value) return { minimum: null, maximum: null };
  const numbers =
    value
      .replace(/,/g, "")
      .match(/\d+(?:\.\d+)?/g)
      ?.map(Number)
      .filter(Number.isFinite) || [];
  return {
    minimum: numbers[0] ?? null,
    maximum: numbers[1] ?? numbers[0] ?? null,
  };
}

function normalizeAdzunaJob(item: UnknownRecord): NormalizedJob | null {
  const title = stripHtml(cleanString(item.title));
  const redirectUrl = ensureHttps(cleanString(item.redirect_url));
  if (!title || !isSafeAdzunaUrl(redirectUrl)) return null;

  const company = isRecord(item.company)
    ? stripHtml(cleanString(item.company.display_name))
    : "";

  const locationRecord = isRecord(item.location) ? item.location : null;
  const displayLocation = locationRecord
    ? stripHtml(cleanString(locationRecord.display_name))
    : "";

  const area =
    locationRecord && Array.isArray(locationRecord.area)
      ? locationRecord.area
          .filter((value): value is string => typeof value === "string")
          .map(cleanString)
          .filter(Boolean)
      : [];

  const description = stripHtml(cleanString(item.description));
  const combined = `${title} ${description} ${displayLocation}`;
  const salaryMin = toFiniteNumber(item.salary_min);
  const salaryMax = toFiniteNumber(item.salary_max);
  const salaryIsPredicted =
    item.salary_is_predicted === 1 ||
    item.salary_is_predicted === "1" ||
    item.salary_is_predicted === true;

  const contractTime = normalizeContractTime(cleanString(item.contract_time));
  const contractType = normalizeContractType(cleanString(item.contract_type));
  const employmentType = [contractTime, contractType]
    .filter(Boolean)
    .join(" • ");

  const category = isRecord(item.category)
    ? cleanString(item.category.label)
    : "";

  return {
    id: `adzuna:${cleanString(item.id) || redirectUrl}`,
    company: company || "Employer not listed",
    role: title,
    location: displayLocation || area.slice(-2).reverse().join(", ") || "India",
    salary: formatSalary(salaryMin, salaryMax, salaryIsPredicted),
    salaryMin,
    salaryMax,
    salaryIsPredicted,
    description,
    source: "Adzuna",
    url: redirectUrl,
    postedAt: cleanString(item.created),
    employmentType: employmentType || "Not specified",
    workMode: detectWorkMode(combined),
    category: category || "General",
  };
}

function matchesSearchPlan(job: NormalizedJob, plan: SearchPlan): boolean {
  if (plan.workMode === "remote" && job.workMode !== "remote") return false;
  if (
    plan.employmentType === "part_time" &&
    !containsPhrase(job.employmentType, "part time")
  )
    return false;
  if (
    plan.employmentType === "contract" &&
    !containsPhrase(job.employmentType, "contract")
  )
    return false;
  if (
    plan.employmentType === "internship" &&
    !containsAny(`${job.role} ${job.description}`, [
      "intern",
      "internship",
      "trainee",
    ])
  )
    return false;
  return true;
}

function rankJob(job: NormalizedJob, profile: SearchProfile): RankedJob {
  const roleText = normalizeForMatch(job.role);
  const descriptionText = normalizeForMatch(job.description);
  const combined = `${roleText} ${descriptionText}`;

  const targetRoles = uniqueStrings(
    [
      profile.primaryRole,
      ...profile.searchQueries,
      ...profile.alternativeRoles,
    ],
    10,
  );

  const roleScores = targetRoles
    .map((role) => ({
      role,
      score: tokenSimilarity(roleText, normalizeForMatch(role)),
    }))
    .sort((a, b) => b.score - a.score);

  const bestRole = roleScores[0] || { role: profile.primaryRole, score: 0 };
  const skillMatches = profile.supportedSkills.filter((skill) =>
    containsFlexiblePhrase(combined, skill),
  );
  const industryMatches = profile.supportedIndustries.filter((industry) =>
    containsFlexiblePhrase(combined, industry),
  );

  let score = 18;
  score += Math.round(bestRole.score * 38);
  score += Math.min(24, skillMatches.length * 4);
  score += Math.min(8, industryMatches.length * 4);
  score += calculateLocationFit(job.location, profile.preferredLocations);
  score += calculateWorkModeFit(job.workMode, profile.workModes);
  score += calculateEmploymentFit(job.employmentType, profile.employmentTypes);
  score += calculateFreshness(job.postedAt);
  score += job.salaryMin !== null || job.salaryMax !== null ? 3 : 0;
  score -= calculateSeniorityPenalty(
    job.role,
    profile.candidateLevel,
    profile.excludedSeniorities,
  );

  if (bestRole.score < 0.34) score -= 15;
  if (skillMatches.length === 0) score -= 8;
  if (isStale(job.postedAt, 60)) score -= 8;

  const match = Math.max(30, Math.min(97, Math.round(score)));
  const whyMatched = buildReasons(
    job,
    profile,
    bestRole.role,
    bestRole.score,
    skillMatches,
    industryMatches,
  );
  const missingSkills = profile.supportedSkills
    .filter((skill) => !containsFlexiblePhrase(combined, skill))
    .slice(0, 4);

  return { ...job, match, whyMatched, missingSkills };
}

function buildReasons(
  job: NormalizedJob,
  profile: SearchProfile,
  bestRole: string,
  roleSimilarity: number,
  skillMatches: string[],
  industryMatches: string[],
): string[] {
  const reasons: string[] = [];

  if (roleSimilarity >= 0.7) {
    reasons.push(
      `The title is a very close match to the target role: ${bestRole}.`,
    );
  } else if (roleSimilarity >= 0.45) {
    reasons.push(
      `The role is closely related to the candidate's ${bestRole} profile.`,
    );
  }

  if (skillMatches.length) {
    reasons.push(
      `The listing references relevant skills such as ${skillMatches.slice(0, 3).join(", ")}.`,
    );
  }

  if (industryMatches.length) {
    reasons.push(
      `The opportunity aligns with the candidate's ${industryMatches[0]} background.`,
    );
  }

  if (profile.workModes.includes(job.workMode)) {
    reasons.push(
      job.workMode === "remote"
        ? "The role is advertised as remote or work from home."
        : `The ${job.workMode} arrangement matches the search profile.`,
    );
  }

  if (job.salaryMin !== null || job.salaryMax !== null) {
    reasons.push(
      job.salaryIsPredicted
        ? `${job.source} provides an estimated salary range for this listing.`
        : "The listing includes salary information.",
    );
  }

  reasons.push(
    `The seniority appears compatible with a ${profile.candidateLevel}-level profile.`,
  );

  return uniqueStrings(reasons, 3);
}

function compareRankedJobs(a: RankedJob, b: RankedJob): number {
  if (b.match !== a.match) return b.match - a.match;
  const aSalary = a.salaryMin !== null || a.salaryMax !== null ? 1 : 0;
  const bSalary = b.salaryMin !== null || b.salaryMax !== null ? 1 : 0;
  if (bSalary !== aSalary) return bSalary - aSalary;
  return dateValue(b.postedAt) - dateValue(a.postedAt);
}

function diversifyResults(jobs: RankedJob[], maximum: number): RankedJob[] {
  const selected: RankedJob[] = [];
  const companyCounts = new Map<string, number>();
  const roleCounts = new Map<string, number>();
  const modeCounts = new Map<WorkMode, number>();

  for (const job of jobs) {
    const companyKey = normalizeForMatch(job.company);
    const roleKey = normalizeRoleFamily(job.role);
    if ((companyCounts.get(companyKey) || 0) >= 2) continue;
    if ((roleCounts.get(roleKey) || 0) >= 3) continue;
    if ((modeCounts.get(job.workMode) || 0) >= 6) continue;

    selected.push(job);
    companyCounts.set(companyKey, (companyCounts.get(companyKey) || 0) + 1);
    roleCounts.set(roleKey, (roleCounts.get(roleKey) || 0) + 1);
    modeCounts.set(job.workMode, (modeCounts.get(job.workMode) || 0) + 1);
    if (selected.length >= maximum) break;
  }

  if (selected.length < Math.min(6, maximum)) {
    for (const job of jobs) {
      if (selected.some((item) => item.id === job.id)) continue;
      selected.push(job);
      if (selected.length >= maximum) break;
    }
  }

  return selected;
}

function dedupeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const ids = new Set<string>();
  const fingerprints = new Set<string>();
  const output: NormalizedJob[] = [];

  for (const job of jobs) {
    const fingerprint = [job.role, job.company, job.location]
      .map(normalizeForMatch)
      .join("|");
    if (!job.url || ids.has(job.id) || fingerprints.has(fingerprint)) continue;
    ids.add(job.id);
    fingerprints.add(fingerprint);
    output.push(job);
  }

  return output;
}

function dedupeSearchPlans(plans: SearchPlan[]): SearchPlan[] {
  const seen = new Set<string>();
  return plans.filter((plan) => {
    const key = [plan.query, plan.location, plan.workMode, plan.employmentType]
      .map(String)
      .map(normalizeForMatch)
      .join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function calculateSeniorityPenalty(
  role: string,
  level: CandidateLevel,
  excluded: string[],
): number {
  const normalized = normalizeForMatch(role);
  if (excluded.some((title) => containsFlexiblePhrase(normalized, title)))
    return 35;

  const leadership = [
    "senior manager",
    "general manager",
    "director",
    "head",
    "vice president",
    "vp",
    "principal",
    "chief",
  ];
  const manager = ["manager", "team lead", "lead"];
  const junior = ["intern", "trainee", "fresher", "junior", "entry level"];

  if (
    (level === "fresher" || level === "junior") &&
    containsAny(normalized, leadership)
  )
    return 38;
  if (
    (level === "fresher" || level === "junior") &&
    containsAny(normalized, manager)
  )
    return 28;
  if (level === "mid" && containsAny(normalized, leadership)) return 20;
  if (
    (level === "senior" || level === "leadership") &&
    containsAny(normalized, junior)
  )
    return 18;
  return 0;
}

function calculateLocationFit(location: string, preferred: string[]): number {
  const normalized = normalizeForMatch(location);
  if (containsAny(normalized, ["remote", "work from home", "wfh"])) return 8;
  if (
    preferred.some((value) =>
      hasMeaningfulOverlap(normalized, normalizeForMatch(value)),
    )
  )
    return 10;
  if (containsPhrase(normalized, "india")) return 5;
  return 1;
}

function calculateWorkModeFit(mode: WorkMode, preferred: WorkMode[]): number {
  if (preferred.includes(mode)) return 5;
  if (mode === "hybrid" && preferred.includes("onsite")) return 3;
  return 0;
}

function calculateEmploymentFit(
  value: string,
  preferred: EmploymentType[],
): number {
  const normalized = normalizeForMatch(value);
  if (
    preferred.includes("full_time") &&
    containsPhrase(normalized, "full time")
  )
    return 5;
  if (
    preferred.includes("part_time") &&
    containsPhrase(normalized, "part time")
  )
    return 5;
  if (preferred.includes("contract") && containsPhrase(normalized, "contract"))
    return 5;
  if (
    preferred.includes("internship") &&
    containsAny(normalized, ["intern", "internship", "trainee"])
  )
    return 5;
  return 0;
}

function calculateFreshness(postedAt: string): number {
  const timestamp = dateValue(postedAt);
  if (!timestamp) return 0;
  const age = (Date.now() - timestamp) / 86_400_000;
  if (age <= 1) return 9;
  if (age <= 3) return 7;
  if (age <= 7) return 5;
  if (age <= 14) return 3;
  if (age <= 30) return 1;
  if (age <= 60) return -2;
  return -6;
}

function extractLocation(report: UnknownRecord): string {
  const contact = isRecord(report.contact)
    ? cleanString(report.contact.location)
    : "";
  if (contact) return contact;

  const profile = isRecord(report.candidateProfile)
    ? report.candidateProfile
    : null;
  if (profile) {
    for (const key of [
      "location",
      "city",
      "currentLocation",
      "current_location",
    ]) {
      const value = cleanString(profile[key]);
      if (value) return value;
    }
  }

  for (const key of ["location", "city", "currentLocation"]) {
    const value = cleanString(report[key]);
    if (value) return value;
  }
  return "";
}

function normalizeIndiaLocation(value: string): string {
  const cleaned = cleanString(value)
    .replace(/\b(remote|work from home|wfh)\b/gi, "")
    .replace(/\s*,?\s*india\s*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/^,\s*|\s*,$/g, "")
    .trim();
  return cleaned || "India";
}

function normalizeProviderLocation(value: string): string {
  return normalizeIndiaLocation(value) || "India";
}

function detectWorkMode(value: string): WorkMode {
  const normalized = normalizeForMatch(value);
  if (
    containsAny(normalized, [
      "remote",
      "work from home",
      "work at home",
      "home based",
      "wfh",
      "anywhere in india",
    ])
  )
    return "remote";
  if (containsAny(normalized, ["hybrid", "flexible workplace"]))
    return "hybrid";
  return "onsite";
}

function normalizeContractTime(value: string): string {
  const normalized = normalizeForMatch(value);
  if (normalized === "full time") return "Full time";
  if (normalized === "part time") return "Part time";
  return titleCase(value.replace(/_/g, " "));
}

function normalizeContractType(value: string): string {
  const normalized = normalizeForMatch(value);
  if (normalized === "permanent") return "Permanent";
  if (normalized === "contract") return "Contract";
  return titleCase(value.replace(/_/g, " "));
}

function formatJobArrangement(job: NormalizedJob): string {
  return (
    uniqueStrings(
      [
        job.employmentType !== "Not specified" ? job.employmentType : "",
        titleCase(job.workMode),
      ],
      3,
    ).join(" • ") || "Not specified"
  );
}

function formatSalary(
  minimum: number | null,
  maximum: number | null,
  predicted: boolean,
): string {
  if (minimum === null && maximum === null) return "Not disclosed";
  const format = (value: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
  const value =
    minimum !== null && maximum !== null
      ? `INR ${format(minimum)} - ${format(maximum)} per year`
      : `INR ${format((minimum ?? maximum) as number)} per year`;
  return predicted ? `${value} (estimated)` : value;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 15_000,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isSafeAdzunaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (url.hostname === "adzuna.in" ||
        url.hostname.endsWith(".adzuna.in") ||
        url.hostname === "adzuna.com" ||
        url.hostname.endsWith(".adzuna.com"))
    );
  } catch {
    return false;
  }
}

function isSafeExternalJobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password &&
      url.hostname !== "localhost" &&
      url.hostname !== "127.0.0.1" &&
      url.hostname !== "::1"
    );
  } catch {
    return false;
  }
}

function ensureHttps(value: string): string {
  return value ? value.replace(/^http:\/\//i, "https://") : "";
}

function cleanSearchTitle(value: string): string {
  return cleanString(value)
    .replace(/\bjobs?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRoleFamily(value: string): string {
  return normalizeForMatch(value)
    .replace(
      /\b(senior|sr|junior|jr|associate|executive|specialist|analyst|officer|lead|manager|trainee|intern)\b/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(haystack: string, phrase: string): boolean {
  const left = normalizeForMatch(haystack);
  const right = normalizeForMatch(phrase);
  return Boolean(right && left.includes(right));
}

function containsFlexiblePhrase(haystack: string, phrase: string): boolean {
  const left = normalizeForMatch(haystack);
  const right = normalizeForMatch(phrase);
  if (!right) return false;
  return left.includes(right) || tokenSimilarity(left, right) >= 0.75;
}

function containsAny(haystack: string, phrases: string[]): boolean {
  return phrases.some((phrase) => containsPhrase(haystack, phrase));
}

function hasMeaningfulOverlap(left: string, right: string): boolean {
  return tokenSimilarity(left, right) >= 0.5;
}

function tokenSimilarity(left: string, right: string): number {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);
  if (!leftTokens.size || !rightTokens.size) return 0;
  let matches = 0;
  for (const token of rightTokens) if (leftTokens.has(token)) matches += 1;
  const precision = matches / leftTokens.size;
  const recall = matches / rightTokens.size;
  return precision + recall === 0
    ? 0
    : (2 * precision * recall) / (precision + recall);
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
    "job",
    "jobs",
    "role",
    "position",
    "opening",
    "required",
    "preferred",
  ]);
  return new Set(
    normalizeForMatch(value)
      .split(" ")
      .filter((token) => token.length > 1 && !stopWords.has(token)),
  );
}

function normalizeForMatch(value: string): string {
  return cleanString(value)
    .toLowerCase()
    .replace(/\bwork[-\s]?from[-\s]?home\b/g, "work from home")
    .replace(/\bfull[-\s]?time\b/g, "full time")
    .replace(/\bpart[-\s]?time\b/g, "part time")
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
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values: unknown, maximum: number): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const cleaned = cleanString(value);
    const key = normalizeForMatch(cleaned);
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    output.push(cleaned);
    if (output.length >= maximum) break;
  }
  return output;
}

function isStale(value: string, days: number): boolean {
  const timestamp = dateValue(value);
  return timestamp ? (Date.now() - timestamp) / 86_400_000 > days : false;
}

function dateValue(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function titleCase(value: string): string {
  return cleanString(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
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
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}