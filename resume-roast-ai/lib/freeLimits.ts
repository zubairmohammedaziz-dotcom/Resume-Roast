const USAGE_KEY = "offernhire_daily_usage";
const PLAN_KEY = "offernhire_plan";

type DailyUsage = {
  date: string;
  analyses: number;
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isProUser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(PLAN_KEY) === "pro";
}

export function getDailyUsage(): DailyUsage {
  const today = getToday();

  if (typeof window === "undefined") {
    return {
      date: today,
      analyses: 0,
    };
  }

  try {
    const saved = localStorage.getItem(USAGE_KEY);

    if (!saved) {
      return {
        date: today,
        analyses: 0,
      };
    }

    const usage = JSON.parse(saved) as DailyUsage;

    if (usage.date !== today) {
      return {
        date: today,
        analyses: 0,
      };
    }

    return {
      date: today,
      analyses: Number(usage.analyses) || 0,
    };
  } catch {
    return {
      date: today,
      analyses: 0,
    };
  }
}

export function canAnalyzeResume(): boolean {
  if (isProUser()) {
    return true;
  }

  return getDailyUsage().analyses < 1;
}

export function recordSuccessfulAnalysis(): void {
  if (typeof window === "undefined" || isProUser()) {
    return;
  }

  const usage = getDailyUsage();

  localStorage.setItem(
    USAGE_KEY,
    JSON.stringify({
      date: getToday(),
      analyses: usage.analyses + 1,
    })
  );
}

export function limitJobMatches<T>(jobs: T[]): T[] {
  if (isProUser()) {
    return jobs;
  }

  return jobs.slice(0, 3);
}