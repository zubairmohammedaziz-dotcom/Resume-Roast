import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

import { authOptions } from "../../auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

function createAnalyticsClient() {
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!clientEmail || !privateKey) {
    throw new Error("GA4 service-account credentials are missing.");
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });
}

function readMetric(
  value: string | null | undefined
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
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

    const signedInEmail = (session?.user?.email || "")
      .trim()
      .toLowerCase();

    if (
      !session?.user?.email ||
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

    const analyticsClient = createAnalyticsClient();
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
        metrics: [{ name: "activeUsers" }],
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
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
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
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        orderBys: [
          {
            metric: {
              metricName: "eventCount",
            },
            desc: true,
          },
        ],
        limit: 50,
      }),

      analyticsClient.runReport({
        property,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "activeUsers" },
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
          { name: "sessions" },
          { name: "activeUsers" },
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

    const realtime =
      realtimeResponse[0].rows?.[0]
        ?.metricValues?.[0]?.value;

    const overviewMetrics =
      overviewResponse[0].rows?.[0]?.metricValues || [];

    const events = Object.fromEntries(
      (eventsResponse[0].rows || []).map((row) => [
        row.dimensionValues?.[0]?.value || "unknown",
        readMetric(row.metricValues?.[0]?.value),
      ])
    );

    const topPages = (pagesResponse[0].rows || []).map(
      (row) => ({
        path:
          row.dimensionValues?.[0]?.value || "Unknown",
        views: readMetric(
          row.metricValues?.[0]?.value
        ),
        users: readMetric(
          row.metricValues?.[1]?.value
        ),
      })
    );

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

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),

      overview: {
        visitorsToday,
        activeUsersNow: readMetric(realtime),
        newUsersToday: readMetric(
          overviewMetrics[1]?.value
        ),
        sessionsToday: readMetric(
          overviewMetrics[2]?.value
        ),
        pageViewsToday: readMetric(
          overviewMetrics[3]?.value
        ),
      },

      product: {
        resumeUploads,
        analysisStarted,
        analysisCompleted,
        tailorStarted,
        pricingViews,
      },

      funnel: {
        visitors: visitorsToday,
        resumeUploads,
        analysesCompleted: analysisCompleted,
        tailoredResumes: tailorStarted,
        checkoutStarts:
          events.checkout_started || 0,
        paidSubscriptions:
          events.subscription_success || 0,
      },

      topPages,
      trafficSources,
      events,
    });
  } catch (error) {
    console.error("Founder analytics API error:", error);

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