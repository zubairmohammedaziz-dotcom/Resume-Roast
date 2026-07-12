import jsPDF from "jspdf";

type PdfExperience = {
  jobTitle?: string;
  company?: string;
  duration?: string;
  bullets?: string[];
};

type PdfEducation = {
  degree?: string;
  college?: string;
  year?: string;
};

type PdfProject = {
  title?: string;
  description?: string;
};

type PdfResumeData = {
  candidateName?: string;
  headline?: string;
  tailoredSummary?: string;
  tailoredBullets?: string[];
  tailoredSkills?: string[];
  experience?: PdfExperience[];
  education?: PdfEducation[];
  certifications?: string[];
  projects?: PdfProject[];
};

function cleanText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

export function downloadResumePdf(data: PdfResumeData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const candidateName =
    cleanText(data.candidateName) || "Candidate Name";

  const headline =
    cleanText(data.headline) || "Professional Candidate";

  const summary =
    cleanText(data.tailoredSummary) ||
    "Professional summary not available.";

  const fallbackBullets = Array.isArray(data.tailoredBullets)
    ? data.tailoredBullets.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  const skills = Array.isArray(data.tailoredSkills)
    ? data.tailoredSkills.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  const experience = Array.isArray(data.experience)
    ? data.experience.filter(
        (item) =>
          item &&
          (cleanText(item.jobTitle) ||
            cleanText(item.company) ||
            cleanText(item.duration) ||
            item.bullets?.length)
      )
    : [];

  const education = Array.isArray(data.education)
    ? data.education.filter(
        (item) =>
          item &&
          (cleanText(item.degree) ||
            cleanText(item.college) ||
            cleanText(item.year))
      )
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects.filter(
        (item) =>
          item &&
          (cleanText(item.title) || cleanText(item.description))
      )
    : [];

  function ensureSpace(requiredSpace = 12) {
    if (y + requiredSpace > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
  }

  function addSectionTitle(title: string) {
    ensureSpace(14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(title.toUpperCase(), margin, y);

    y += 3;

    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(0.45);
    doc.line(margin, y, pageWidth - margin, y);

    y += 7;
  }

  function addParagraph(text: string, extraBottom = 4) {
    const safeText = cleanText(text);
    if (!safeText) return;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    const lines = doc.splitTextToSize(safeText, contentWidth);

    for (const line of lines) {
      ensureSpace(5);
      doc.text(line, margin, y);
      y += 4.7;
    }

    y += extraBottom;
  }

  function addBullets(items: string[]) {
    for (const item of items) {
      const safeItem = cleanText(item);
      if (!safeItem) continue;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.2);
      doc.setTextColor(31, 41, 55);

      const lines = doc.splitTextToSize(
        `• ${safeItem}`,
        contentWidth - 4
      );

      for (const line of lines) {
        ensureSpace(5);
        doc.text(line, margin + 2, y);
        y += 4.6;
      }

      y += 1.4;
    }

    y += 2;
  }

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(17, 24, 39);
  doc.text(candidateName.toUpperCase(), pageWidth / 2, y, {
    align: "center",
  });

  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(55, 65, 81);

  const headlineLines = doc.splitTextToSize(
    headline,
    contentWidth
  );

  doc.text(headlineLines, pageWidth / 2, y, {
    align: "center",
  });

  y += headlineLines.length * 4.8 + 5;

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageWidth - margin, y);

  y += 9;

  // Summary
  addSectionTitle("Professional Summary");
  addParagraph(summary, 5);

  // Structured experience
  if (experience.length > 0) {
    addSectionTitle("Professional Experience");

    experience.forEach((item, index) => {
      ensureSpace(18);

      const title = cleanText(item.jobTitle);
      const company = cleanText(item.company);
      const duration = cleanText(item.duration);

      if (title || company || duration) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.8);
        doc.setTextColor(17, 24, 39);

        if (title) {
          doc.text(title, margin, y);
        }

        if (duration) {
          doc.setFontSize(8.5);
          doc.setTextColor(75, 85, 99);
          doc.text(duration, pageWidth - margin, y, {
            align: "right",
          });
        }

        y += 4.8;

        if (company) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.8);
          doc.setTextColor(55, 65, 81);
          doc.text(company, margin, y);
          y += 5.5;
        }
      }

      const itemBullets = Array.isArray(item.bullets)
        ? item.bullets.filter(
            (bullet) =>
              typeof bullet === "string" && bullet.trim()
          )
        : [];

      addBullets(itemBullets);

      if (index < experience.length - 1) {
        y += 2;
      }
    });
  } else if (fallbackBullets.length > 0) {
    addSectionTitle("Professional Experience");
    addBullets(fallbackBullets);
  }

  // Skills
  if (skills.length > 0) {
    addSectionTitle("Core Skills");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.setTextColor(31, 41, 55);

    const skillLines = doc.splitTextToSize(
      skills.join(" • "),
      contentWidth
    );

    for (const line of skillLines) {
      ensureSpace(5);
      doc.text(line, margin, y);
      y += 4.6;
    }

    y += 5;
  }

  // Projects
  if (projects.length > 0) {
    addSectionTitle("Projects");

    projects.forEach((project) => {
      ensureSpace(12);

      const title = cleanText(project.title);
      const description = cleanText(project.description);

      if (title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.7);
        doc.setTextColor(17, 24, 39);
        doc.text(title, margin, y);
        y += 5;
      }

      if (description) {
        addParagraph(description, 3);
      }
    });
  }

  // Certifications
  if (certifications.length > 0) {
    addSectionTitle("Certifications");
    addBullets(certifications);
  }

  // Education
  if (education.length > 0) {
    addSectionTitle("Education");

    education.forEach((item) => {
      ensureSpace(12);

      const degree = cleanText(item.degree);
      const college = cleanText(item.college);
      const year = cleanText(item.year);

      if (degree) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.7);
        doc.setTextColor(17, 24, 39);
        doc.text(degree, margin, y);
      }

      if (year) {
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 99);
        doc.text(year, pageWidth - margin, y, {
          align: "right",
        });
      }

      y += 4.8;

      if (college) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.text(college, margin, y);
        y += 6;
      }
    });
  }

  // Footer
  ensureSpace(14);
  y += 3;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "Review and personalize this resume before submitting.",
    margin,
    y
  );

  const safeName = candidateName
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");

  doc.save(`${safeName}_Tailored_Resume.pdf`);
}