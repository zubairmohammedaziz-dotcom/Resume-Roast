import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.offernhire.com";

  const seoPages = [
    "ai-resume-checker",
    "ats-resume-checker",
    "resume-score-checker",
    "ai-resume-analyzer",
    "resume-review",
    "resume-roast",
    "resume-tailor",
    "ai-cover-letter-generator",
    "interview-questions-by-role",
    "resume-keyword-scanner",
    "ai-resume-builder",
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...seoPages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}