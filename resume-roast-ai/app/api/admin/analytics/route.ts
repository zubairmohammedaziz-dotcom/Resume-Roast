import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

import { authOptions } from "../../auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

type ServiceAccountCredentials = {
  client_email?: string;
  private_key?: string;
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

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
      signedInEmail !== allowedFounderEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!PROPERTY_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "GA4_PROPERTY_ID is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const analyticsClient =
      createAnalyticsClient();

    const property = `properties/${PROPERTY_ID}`;

    const [
      realtimeResponse,
      overviewResponse,
      eventsResponse,
      pagesResponse,
      sourcesResponse,
    ] = await Promise.all([
      analyticsClient.runRealtimeReport({
        property,
        metrics: [
          {
            name: "activeUsers",
          },
        ],
      }),

      analyticsClient.runReport({
        property,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
        metrics: [
          {
            name: "activeUsers",
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
      }),

      analyticsClient.runReport({
        property,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
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
        limit: 100,
      }),

      analyticsClient.runReport({
        property,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
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
            name: "activeUsers",
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
        limit: 10,
      }),

      analyticsClient.runReport({
        property,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
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
            name: "activeUsers",
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
        limit: 10,
      }),
    ]);

    const realtimeValue =
      realtimeResponse[0].rows?.[0]
        ?.metricValues?.[0]?.value;

    const overviewMetrics =
      overviewResponse[0].rows?.[0]
        ?.metricValues || [];

    const events = Object.fromEntries(
      (eventsResponse[0].rows || []).map(
        (row) => {
          const eventName =
            row.dimensionValues?.[0]?.value ||
            "unknown";

          const eventCount = readMetric(
            row.metricValues?.[0]?.value
          );

          return [eventName, eventCount];
        }
      )
    );

    const topPages = (
      pagesResponse[0].rows || []
    ).map((row) => ({
      path:
        row.dimensionValues?.[0]?.value ||
        "Unknown",
      views: readMetric(
        row.metricValues?.[0]?.value
      ),
      users: readMetric(
        row.metricValues?.[1]?.value
      ),
    }));

    const trafficSources = (
      sourcesResponse[0].rows || []
    ).map((row) => ({
      source:
        row.dimensionValues?.[0]?.value ||
        "Unassigned",
      sessions: readMetric(
        row.metricValues?.[0]?.value
      ),
      users: readMetric(
        row.metricValues?.[1]?.value
      ),
    }));

    const visitorsToday = readMetric(
      overviewMetrics[0]?.value
    );

    const newUsersToday = readMetric(
      overviewMetrics[1]?.value
    );

    const sessionsToday = readMetric(
      overviewMetrics[2]?.value
    );

    const pageViewsToday = readMetric(
      overviewMetrics[3]?.value
    );

    const resumeUploads =
      events.resume_uploaded || 0;

    const analysisStarted =
      events.analysis_started ||
      events.resume_analysis_started ||
      0;

    const analysisCompleted =
      events.analysis_completed ||
      events.resume_analysis_completed ||
      0;

    const tailorStarted =
      events.tailor_started || 0;

    const pricingViews =
      events.pricing_viewed || 0;

    const checkoutStarts =
      events.checkout_started || 0;

    const paidSubscriptions =
      events.subscription_success || 0;

    const analysisFailures =
      events.analysis_failed ||
      events.resume_analysis_failed ||
      0;

    const successfulAnalysisRate =
      analysisStarted > 0
        ? Math.round(
            (analysisCompleted /
              analysisStarted) *
              100
          )
        : 0;

    const visitorToUploadRate =
      visitorsToday > 0
        ? Math.round(
            (resumeUploads /
              visitorsToday) *
              100
          )
        : 0;

    const visitorToProRate =
      visitorsToday > 0
        ? Number(
            (
              (paidSubscriptions /
                visitorsToday) *
              100
            ).toFixed(2)
          )
        : 0;

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),

      overview: {
        visitorsToday,
        activeUsersNow: readMetric(
          realtimeValue
        ),
        newUsersToday,
        sessionsToday,
        pageViewsToday,
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
        visitors: visitorsToday,
        resumeUploads,
        analysesCompleted:
          analysisCompleted,
        tailoredResumes: tailorStarted,
        checkoutStarts,
        paidSubscriptions,
        visitorToUploadRate,
        visitorToProRate,
      },

      topPages,
      trafficSources,
      events,
    });
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
      }
    );
  }
}