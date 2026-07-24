const USAGE_KEY = "offernhire_daily_usage";
const PLAN_KEY = "offernhire_plan";
const PLAN_UPDATED_EVENT = "offernhire-plan-updated";

type DailyUsage = {
  date: string;
  analyses: number;
};

type SubscriptionStatusResponse = {
  isPro?: boolean;
  plan?: string;
  status?: string;
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Fast synchronous check used by existing UI code.
 *
 * The value is populated securely from Supabase through
 * syncProStatus(). Local storage is only a browser cache,
 * not the source of truth.
 */
export function isProUser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(PLAN_KEY) === "pro";
}

/**
 * Fetches the logged-in user's real subscription status
 * from the server and updates the browser cache.
 */
export async function syncProStatus(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const response = await fetch("/api/subscription/status", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      localStorage.removeItem(PLAN_KEY);
      window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
      return false;
    }

    if (!response.ok) {
      console.error(
        "Unable to fetch subscription status:",
        response.status
      );

      return isProUser();
    }

    const data =
      (await response.json()) as SubscriptionStatusResponse;

    const hasProAccess = data.isPro === true;

    if (hasProAccess) {
      localStorage.setItem(PLAN_KEY, "pro");
    } else {
      localStorage.removeItem(PLAN_KEY);
    }

    window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));

    return hasProAccess;
  } catch (error) {
    console.error("Subscription status sync failed:", error);

    // Preserve the last verified value if the network is temporarily unavailable.
    return isProUser();
  }
}

/**
 * Call this immediately after successful Razorpay verification.
 */
export function activateProLocally(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PLAN_KEY, "pro");
  window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
}

export function clearProCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(PLAN_KEY);
  window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
}

export function getPlanUpdatedEventName(): string {
  return PLAN_UPDATED_EVENT;
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

    const usage = JSON.parse(saved) as Partial<DailyUsage>;

    if (usage.date !== today) {
      localStorage.removeItem(USAGE_KEY);

      return {
        date: today,
        analyses: 0,
      };
    }

    return {
      date: today,
      analyses: Math.max(0, Number(usage.analyses) || 0),
    };
  } catch {
    localStorage.removeItem(USAGE_KEY);

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
    } satisfies DailyUsage)
  );
}

export function limitJobMatches<T>(jobs: T[]): T[] {
  if (isProUser()) {
    return jobs;
  }

  return jobs.slice(0, 3);
}