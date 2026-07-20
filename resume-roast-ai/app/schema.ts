export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OffernHire",
  url: "https://www.offernhire.com",
  logo: "https://www.offernhire.com/logo.png",
  description:
    "OffernHire is an AI Career Copilot helping job seekers analyze resumes, improve ATS scores, tailor resumes, generate cover letters, prepare for interviews and discover relevant jobs.",
  sameAs: []
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OffernHire",
  url: "https://www.offernhire.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.offernhire.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OffernHire",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR"
  },
  description:
    "AI Career Copilot for job seekers. Analyze resumes, improve ATS score, tailor resumes, generate cover letters, prepare for interviews and discover relevant jobs."
};