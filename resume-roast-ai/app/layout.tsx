import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Providers from "./Providers";
import {
  organizationSchema,
  websiteSchema,
  softwareSchema,
} from "./schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.offernhire.com"),

  title: {
    default: "OffernHire | AI Career Copilot for Job Seekers",
    template: "%s | OffernHire",
  },

  description:
    "Analyze resumes, improve ATS scores, tailor resumes, generate cover letters, prepare for interviews and discover relevant jobs with OffernHire.",

  keywords: [
    "AI Resume Checker",
    "ATS Resume Checker",
    "Resume Analyzer",
    "Resume Tailor",
    "Cover Letter Generator",
    "Interview Questions",
    "Career Copilot",
    "Job Search India",
    "Resume Builder",
    "Resume Score",
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "OffernHire | AI Career Copilot",
    description:
      "Analyze resumes, tailor resumes, generate cover letters and prepare for interviews.",
    url: "https://www.offernhire.com",
    siteName: "OffernHire",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId="GTM-MLWFPMCS" />

      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}