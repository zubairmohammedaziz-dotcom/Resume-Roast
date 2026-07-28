import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  BetaAnalyticsDataClient,
  protos,
} from "@google-analytics/data";

import { authOptions } from "../../auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

type ServiceAccountCredentials = {
  client_email?: string;
  private_key?: string;
};

type ReportResponse =
  protos.google.analytics.data.v1beta.IRunReportResponse;

type AnalyticsReports = {
  overview: ReportResponse;
  events: ReportResponse;
  pages: ReportResponse;
  sources: ReportResponse;
};

function createAnalyticsClient() {
  const encodedCredentials =
    process.env.GA4_SERVICE_ACCOUNT_BASE64;

  if (!encodedCredentials) {
    throw new Error(
      "GA4_SERVICE_ACCOUNT_BASE64 is not configured."
    );
  }

  let credentials: ServiceAccountCredentials;

  try {
    const decodedCredentials = Buffer.from(
      encodedCredentials.trim(),
      "base64"
    ).toString("utf8");

    credentials = JSON.parse(
      decodedCredentials
    ) as ServiceAccountCredentials;
  } catch {
    throw new Error(
      "GA4 service-account credentials could not be decoded."
    );
  }

  if (
    !credentials.client_email ||
    !credentials.private_key
  ) {
    throw new Error(
      "GA4 service-account credentials are incomplete."
    );
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  });
}

function readMetric(
  value: string | null | undefined
): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function getEventCount(
  events: Record<string, number>,
  names: string[]
): number {
  for (const name of names) {
    const count = events[name];

    if (typeof count === "number") {
      return count;
    }
  }

  return 0;
}

async function runAnalyticsReports({
  analyticsClient,
  property,
  startDate,
  endDate,
}: {
  analyticsClient: BetaAnalyticsDataClient;
  property: string;
  startDate: string;
  endDate: string;
}): Promise<AnalyticsReports> {
  const dateRanges = [
    {
      startDate,
      endDate,
    },
  ];

  const [
    overviewResult,
    eventsResult,
    pagesResult,
    sourcesResult,
  ] = await Promise.all([
    analyticsClient.runReport({
      property,
      dateRanges,
      metrics: [
        {
          name: "totalUsers",
        },
        {
          name: "newUsers",
        },
        {
          name: "sessions",
        },
        {
          name: "screenPageViews",
        },
      ],
      keepEmptyRows: false,
    }),

    analyticsClient.runReport({
      property,
      dateRanges,
      dimensions: [
        {
          name: "eventName",
        },
      ],
      metrics: [
        {
          name: "eventCount",
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: "eventCount",
          },
          desc: true,
        },
      ],
      keepEmptyRows: false,
      limit: 100,
    }),

    analyticsClient.runReport({
      property,
      dateRanges,
      dimensions: [
        {
          name: "pagePath",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
        {
          name: "totalUsers",
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: "screenPageViews",
          },
          desc: true,
        },
      ],
      keepEmptyRows: false,
      limit: 10,
    }),

    analyticsClient.runReport({
      property,
      dateRanges,
      dimensions: [
        {
          name: "sessionDefaultChannelGroup",
        },
      ],
      metrics: [
        {
          name: "sessions",
        },
        {
          name: "totalUsers",
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: "sessions",
          },
          desc: true,
        },
      ],
      keepEmptyRows: false,
      limit: 10,
    }),
  ]);

  return {
    overview: overviewResult[0],
    events: eventsResult[0],
    pages: pagesResult[0],
    sources: sourcesResult[0],
  };
}

function getOverviewMetrics(
  response: ReportResponse
) {
  const metricValues =
    response.rows?.[0]?.metricValues || [];

  return {
    visitors: readMetric(
      metricValues[0]?.value
    ),
    newUsers: readMetric(
      metricValues[1]?.value
    ),
    sessions: readMetric(
      metricValues[2]?.value
    ),
    pageViews: readMetric(
      metricValues[3]?.value
    ),
  };
}

function getEvents(
  response: ReportResponse
): Record<string, number> {
  return Object.fromEntries(
    (response.rows || []).map((row) => {
      const eventName =
        row.dimensionValues?.[0]?.value ||
        "unknown";

      const eventCount = readMetric(
        row.metricValues?.[0]?.value
      );

      return [eventName, eventCount];
    })
  );
}

function getTopPages(
  response: ReportResponse
) {
  return (response.rows || []).map(
    (row) => ({
      path:
        row.dimensionValues?.[0]?.value ||
        "Unknown",

      views: readMetric(
        row.metricValues?.[0]?.value
      ),

      users: readMetric(
        row.metricValues?.[1]?.value
      ),
    })
  );
}

function getTrafficSources(
  response: ReportResponse
) {
  return (response.rows || []).map(
    (row) => ({
      source:
        row.dimensionValues?.[0]?.value ||
        "Unassigned",

      sessions: readMetric(
        row.metricValues?.[0]?.value
      ),

      users: readMetric(
        row.metricValues?.[1]?.value
      ),
    })
  );
}

function reportHasData(
  reports: AnalyticsReports
): boolean {
  const overview = getOverviewMetrics(
    reports.overview
  );

  return (
    overview.visitors > 0 ||
    overview.sessions > 0 ||
    overview.pageViews > 0 ||
    Boolean(reports.events.rows?.length) ||
    Boolean(reports.pages.rows?.length) ||
    Boolean(reports.sources.rows?.length)
  );
}

export async function GET() {
  try {
    const session = await getServerSession(
      authOptions
    );

    const allowedFounderEmail = (
      process.env.FOUNDER_EMAIL ||
      process.env.NEXT_PUBLIC_FOUNDER_EMAIL ||
      ""
    )
      .trim()
      .toLowerCase();

    const signedInEmail = (
      session?.user?.email || ""
    )
      .trim()
      .toLowerCase();

    if (
      !signedInEmail ||
      !allowedFounderEmail ||
      signedInEmail !==
        allowedFounderEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        }
      );
    }

    if (!PROPERTY_ID) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GA4_PROPERTY_ID is not configured.",
        },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        }
      );
    }

    const analyticsClient =
      createAnalyticsClient();

    const property =
      `properties/${PROPERTY_ID}`;

    const [realtimeResult, todayReports] =
      await Promise.all([
        analyticsClient.runRealtimeReport({
          property,
          metrics: [
            {
              name: "activeUsers",
            },
          ],
        }),

        runAnalyticsReports({
          analyticsClient,
          property,
          startDate: "today",
          endDate: "today",
        }),
      ]);

    const realtimeValue =
      realtimeResult[0].rows?.[0]
        ?.metricValues?.[0]?.value;

    const activeUsersNow =
      readMetric(realtimeValue);

    /*
     * GA4 realtime data appears quickly, but standard
     * processed reports may be delayed.
     *
     * When today's processed report is completely empty
     * while realtime users exist, use the most recent
     * two-day processed window as a temporary fallback.
     */
    let reports = todayReports;
    let reportingWindow:
      | "today"
      | "recent" = "today";

    if (
      !reportHasData(todayReports) &&
      activeUsersNow > 0
    ) {
      reports =
        await runAnalyticsReports({
          analyticsClient,
          property,
          startDate: "yesterday",
          endDate: "today",
        });

      reportingWindow = "recent";
    }

    const overview = getOverviewMetrics(
      reports.overview
    );

    const events = getEvents(
      reports.events
    );

    const topPages = getTopPages(
      reports.pages
    );

    const trafficSources =
      getTrafficSources(
        reports.sources
      );

    const resumeUploads =
      getEventCount(events, [
        "resume_uploaded",
        "resume_upload",
      ]);

    const analysisStarted =
      getEventCount(events, [
        "analysis_started",
        "resume_analysis_started",
      ]);

    const analysisCompleted =
      getEventCount(events, [
        "analysis_completed",
        "resume_analysis_completed",
      ]);

    const analysisFailures =
      getEventCount(events, [
        "analysis_failed",
        "resume_analysis_failed",
      ]);

    const tailorStarted =
      getEventCount(events, [
        "tailor_started",
        "resume_tailor_started",
      ]);

    const pricingViews =
      getEventCount(events, [
        "pricing_viewed",
        "pricing_page_viewed",
      ]);

    const checkoutStarts =
      getEventCount(events, [
        "checkout_started",
        "begin_checkout",
      ]);

    const paidSubscriptions =
      getEventCount(events, [
        "subscription_success",
        "purchase",
        "payment_success",
      ]);

    const successfulAnalysisRate =
      analysisStarted > 0
        ? Math.min(
            100,
            Math.round(
              (analysisCompleted /
                analysisStarted) *
                100
            )
          )
        : 0;

    const visitorToUploadRate =
      overview.visitors > 0
        ? Math.min(
            100,
            Math.round(
              (resumeUploads /
                overview.visitors) *
                100
            )
          )
        : 0;

    const visitorToProRate =
      overview.visitors > 0
        ? Number(
            Math.min(
              100,
              (paidSubscriptions /
                overview.visitors) *
                100
            ).toFixed(2)
          )
        : 0;

    return NextResponse.json(
      {
        success: true,
        generatedAt:
          new Date().toISOString(),

        reportingWindow,

        overview: {
          visitorsToday:
            overview.visitors,

          activeUsersNow,

          newUsersToday:
            overview.newUsers,

          sessionsToday:
            overview.sessions,

          pageViewsToday:
            overview.pageViews,
        },

        product: {
          resumeUploads,
          analysisStarted,
          analysisCompleted,
          analysisFailures,
          tailorStarted,
          pricingViews,
          successfulAnalysisRate,
        },

        funnel: {
          visitors:
            overview.visitors,

          resumeUploads,

          analysesCompleted:
            analysisCompleted,

          tailoredResumes:
            tailorStarted,

          checkoutStarts,

          paidSubscriptions,

          visitorToUploadRate,

          visitorToProRate,
        },

        topPages,
        trafficSources,
        events,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Founder analytics API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve analytics.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  }
}