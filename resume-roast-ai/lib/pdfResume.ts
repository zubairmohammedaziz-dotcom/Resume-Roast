import jsPDF from "jspdf";

type PdfResumeData = {
  candidateName?: string;
  headline?: string;
  tailoredSummary?: string;
  tailoredBullets?: string[];
  tailoredSkills?: string[];
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
  let y = 20;

  const candidateName =
    cleanText(data.candidateName) || "Candidate Name";

  const headline =
    cleanText(data.headline) || "Professional Candidate";

  const summary =
    cleanText(data.tailoredSummary) ||
    "Professional summary not available.";

  const bullets = Array.isArray(data.tailoredBullets)
    ? data.tailoredBullets.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  const skills = Array.isArray(data.tailoredSkills)
    ? data.tailoredSkills.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  function checkPage(requiredSpace = 12) {
    if (y + requiredSpace > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  }

  function addSectionTitle(title: string) {
    checkPage(15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(title.toUpperCase(), margin, y);

    y += 3;

    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;
  }

  function addParagraph(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);

    const lines = doc.splitTextToSize(text, contentWidth);

    lines.forEach((line: string) => {
      checkPage(6);
      doc.text(line, margin, y);
      y += 5;
    });

    y += 4;
  }

  function addBullets(items: string[]) {
    if (items.length === 0) {
      addParagraph("Relevant experience details can be added here.");
      return;
    }

    items.forEach((item) => {
      const lines = doc.splitTextToSize(
        `• ${item.trim()}`,
        contentWidth - 3
      );

      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin + 2, y);
        y += 5;
      });

      y += 2;
    });

    y += 3;
  }

  // Candidate name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(17, 24, 39);
  doc.text(candidateName.toUpperCase(), pageWidth / 2, y, {
    align: "center",
  });

  y += 8;

  // Professional headline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);

  const headlineLines = doc.splitTextToSize(
    headline,
    contentWidth
  );

  doc.text(headlineLines, pageWidth / 2, y, {
    align: "center",
  });

  y += headlineLines.length * 5 + 6;

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // Summary
  addSectionTitle("Professional Summary");
  addParagraph(summary);

  // Experience
  addSectionTitle("Professional Experience");
  addBullets(bullets);

  // Skills
  addSectionTitle("Core Skills");

  if (skills.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);

    const skillText = skills.join(" • ");
    const skillLines = doc.splitTextToSize(
      skillText,
      contentWidth
    );

    skillLines.forEach((line: string) => {
      checkPage(6);
      doc.text(line, margin, y);
      y += 5;
    });

    y += 5;
  } else {
    addParagraph("Relevant professional skills can be added here.");
  }

  // Footer
  checkPage(15);

  y += 5;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
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