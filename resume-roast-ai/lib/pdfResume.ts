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

  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };

  tailoredSummary?: string;
  tailoredBullets?: string[];
  tailoredSkills?: string[];

  experience?: PdfExperience[];
  education?: PdfEducation[];
  certifications?: string[];
  projects?: PdfProject[];
};

type LayoutProfile = {
  marginX: number;
  marginTop: number;
  marginBottom: number;

  nameSize: number;
  headlineSize: number;
  contactSize: number;

  sectionTitleSize: number;
  bodySize: number;
  smallSize: number;
  dateSize: number;

  bodyLineHeight: number;
  bulletLineHeight: number;

  headerBottomGap: number;
  sectionTopGap: number;
  sectionTitleBottomGap: number;
  paragraphBottomGap: number;
  experienceGap: number;
};

const STANDARD_LAYOUT: LayoutProfile = {
  marginX: 18,
  marginTop: 16,
  marginBottom: 17,

  nameSize: 19,
  headlineSize: 9.3,
  contactSize: 8,

  sectionTitleSize: 9.5,
  bodySize: 9,
  smallSize: 8.4,
  dateSize: 8,

  bodyLineHeight: 4.45,
  bulletLineHeight: 4.3,

  headerBottomGap: 7,
  sectionTopGap: 6,
  sectionTitleBottomGap: 5,
  paragraphBottomGap: 3.5,
  experienceGap: 3.5,
};

const COMPACT_LAYOUT: LayoutProfile = {
  marginX: 16,
  marginTop: 13,
  marginBottom: 14,

  nameSize: 17.5,
  headlineSize: 8.8,
  contactSize: 7.5,

  sectionTitleSize: 9,
  bodySize: 8.35,
  smallSize: 7.9,
  dateSize: 7.5,

  bodyLineHeight: 3.95,
  bulletLineHeight: 3.85,

  headerBottomGap: 5.5,
  sectionTopGap: 4.5,
  sectionTitleBottomGap: 4,
  paragraphBottomGap: 2.5,
  experienceGap: 2.5,
};

function cleanText(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeText(value?: string): string {
  return cleanText(value)
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanStringArray(value?: string[]): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map(normalizeText)
    .filter(Boolean);
}

export function downloadResumePdf(data: PdfResumeData) {
  const normalizedData = normalizeResumeData(data);

  const profile = chooseLayoutProfile(normalizedData);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  renderResume(doc, normalizedData, profile);
  addPageFooters(doc, profile);

  const safeName = normalizedData.candidateName
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  doc.save(`${safeName || "Candidate"}_Tailored_Resume.pdf`);
}

function normalizeResumeData(data: PdfResumeData) {
  const candidateName =
    normalizeText(data.candidateName) || "Candidate Name";

  const headline =
    normalizeText(data.headline) || "Professional Candidate";

  const contact = {
    email: normalizeText(data.contact?.email),
    phone: normalizeText(data.contact?.phone),
    location: normalizeText(data.contact?.location),
    linkedin: normalizeText(data.contact?.linkedin),
  };

  const summary =
    normalizeText(data.tailoredSummary) ||
    "Professional summary not available.";

  const fallbackBullets = cleanStringArray(data.tailoredBullets);
  const skills = cleanStringArray(data.tailoredSkills);
  const certifications = cleanStringArray(data.certifications);

  const experience = Array.isArray(data.experience)
    ? data.experience
        .map((item) => ({
          jobTitle: normalizeText(item?.jobTitle),
          company: normalizeText(item?.company),
          duration: normalizeText(item?.duration),
          bullets: cleanStringArray(item?.bullets),
        }))
        .filter(
          (item) =>
            item.jobTitle ||
            item.company ||
            item.duration ||
            item.bullets.length > 0
        )
    : [];

  const education = Array.isArray(data.education)
    ? data.education
        .map((item) => ({
          degree: normalizeText(item?.degree),
          college: normalizeText(item?.college),
          year: normalizeText(item?.year),
        }))
        .filter((item) => item.degree || item.college || item.year)
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects
        .map((item) => ({
          title: normalizeText(item?.title),
          description: normalizeText(item?.description),
        }))
        .filter((item) => item.title || item.description)
    : [];

  return {
    candidateName,
    headline,
    contact,
    summary,
    fallbackBullets,
    skills,
    experience,
    education,
    certifications,
    projects,
  };
}

type NormalizedResumeData = ReturnType<typeof normalizeResumeData>;

function chooseLayoutProfile(
  data: NormalizedResumeData
): LayoutProfile {
  /*
   * Use the compact profile only when content is likely to fit on
   * one page with moderate tightening.
   *
   * Long resumes still use the standard profile and paginate cleanly.
   */
  const bulletCount =
    data.experience.reduce(
      (total, item) => total + item.bullets.length,
      0
    ) + data.fallbackBullets.length;

  const contentWeight =
    data.summary.length / 110 +
    bulletCount * 1.05 +
    data.skills.length * 0.22 +
    data.education.length * 0.65 +
    data.certifications.length * 0.45 +
    data.projects.length * 1.1;

  return contentWeight <= 15.5
    ? COMPACT_LAYOUT
    : STANDARD_LAYOUT;
}

function renderResume(
  doc: jsPDF,
  data: NormalizedResumeData,
  profile: LayoutProfile
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const contentWidth = pageWidth - profile.marginX * 2;
  const pageBottom = pageHeight - profile.marginBottom;

  let y = profile.marginTop;

  function startNewPage() {
    doc.addPage();
    y = profile.marginTop;
  }

  function remainingSpace() {
    return pageBottom - y;
  }

  function ensureSpace(requiredHeight: number) {
    if (requiredHeight > remainingSpace()) {
      startNewPage();
    }
  }

  function setBodyFont() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(profile.bodySize);
    doc.setTextColor(42, 49, 64);
  }

  function measureWrappedText(
    text: string,
    width: number,
    fontSize: number,
    lineHeight: number,
    fontStyle: "normal" | "bold" = "normal"
  ) {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(text, width) as string[];

    return {
      lines,
      height: lines.length * lineHeight,
    };
  }

  function drawWrappedText({
    text,
    x,
    width,
    fontSize,
    lineHeight,
    color = [42, 49, 64],
    fontStyle = "normal",
    align = "left",
  }: {
    text: string;
    x: number;
    width: number;
    fontSize: number;
    lineHeight: number;
    color?: [number, number, number];
    fontStyle?: "normal" | "bold";
    align?: "left" | "center" | "right";
  }) {
    if (!text) return;

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, width) as string[];

    for (const line of lines) {
      ensureSpace(lineHeight);

      doc.text(line, x, y, {
        align,
      });

      y += lineHeight;
    }
  }

  function sectionHeaderHeight() {
    return (
      profile.sectionTopGap +
      profile.sectionTitleSize * 0.38 +
      profile.sectionTitleBottomGap
    );
  }

  function drawSectionTitle(
    title: string,
    anticipatedContentHeight = 8
  ) {
    /*
     * Reserve enough room for both the heading and at least the first
     * meaningful content block. This prevents orphaned headings.
     */
    ensureSpace(
      sectionHeaderHeight() + anticipatedContentHeight
    );

    y += profile.sectionTopGap;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(profile.sectionTitleSize);
    doc.setTextColor(17, 24, 39);

    doc.text(title.toUpperCase(), profile.marginX, y);

    const titleWidth = doc.getTextWidth(title.toUpperCase());
    const lineStart = Math.min(
      profile.marginX + titleWidth + 5,
      pageWidth - profile.marginX - 10
    );

    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(0.35);

    doc.line(
      lineStart,
      y - 0.7,
      pageWidth - profile.marginX,
      y - 0.7
    );

    y += profile.sectionTitleBottomGap;
  }

  function drawParagraph(text: string, bottomGap?: number) {
    if (!text) return;

    const measured = measureWrappedText(
      text,
      contentWidth,
      profile.bodySize,
      profile.bodyLineHeight
    );

    ensureSpace(
      Math.min(
        measured.height + (bottomGap ?? profile.paragraphBottomGap),
        pageBottom - profile.marginTop
      )
    );

    setBodyFont();

    for (const line of measured.lines) {
      ensureSpace(profile.bodyLineHeight);

      doc.text(line, profile.marginX, y);
      y += profile.bodyLineHeight;
    }

    y += bottomGap ?? profile.paragraphBottomGap;
  }

  function measureBulletHeight(
    bullet: string,
    width = contentWidth - 5
  ) {
    return measureWrappedText(
      bullet,
      width,
      profile.bodySize,
      profile.bulletLineHeight
    ).height + 1.25;
  }

  function drawBullet(
    bullet: string,
    width = contentWidth - 5
  ) {
    if (!bullet) return;

    const measured = measureWrappedText(
      bullet,
      width,
      profile.bodySize,
      profile.bulletLineHeight
    );

    ensureSpace(
      Math.min(
        measured.height + 1.25,
        pageBottom - profile.marginTop
      )
    );

    doc.setFillColor(71, 85, 105);
    doc.circle(
      profile.marginX + 1.2,
      y - profile.bodyLineHeight * 0.22,
      0.45,
      "F"
    );

    setBodyFont();

    for (const line of measured.lines) {
      ensureSpace(profile.bulletLineHeight);

      doc.text(line, profile.marginX + 4, y);
      y += profile.bulletLineHeight;
    }

    y += 1.25;
  }

  function drawBulletList(items: string[]) {
    items.forEach((item) => drawBullet(item));
  }

  function measureExperienceItem(item: {
    jobTitle: string;
    company: string;
    duration: string;
    bullets: string[];
  }) {
    let height = 0;

    if (item.jobTitle || item.duration) {
      height += 4.8;
    }

    if (item.company) {
      height += 4.2;
    }

    height += item.bullets.reduce(
      (total, bullet) =>
        total + measureBulletHeight(bullet),
      0
    );

    height += profile.experienceGap;

    return height;
  }

  function drawExperienceItem(
    item: NormalizedResumeData["experience"][number]
  ) {
    const estimatedHeight = measureExperienceItem(item);

    /*
     * Keep a complete role together when it fits on a fresh page.
     * Very long roles may still split naturally across pages.
     */
    const freshPageCapacity =
      pageBottom - profile.marginTop;

    if (
      estimatedHeight <= freshPageCapacity &&
      estimatedHeight > remainingSpace()
    ) {
      startNewPage();
    }

    const leftTextWidth = item.duration
      ? contentWidth * 0.72
      : contentWidth;

    if (item.jobTitle) {
      const titleMeasurement = measureWrappedText(
        item.jobTitle,
        leftTextWidth,
        profile.bodySize + 0.3,
        4.3,
        "bold"
      );

      ensureSpace(titleMeasurement.height);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(profile.bodySize + 0.3);
      doc.setTextColor(17, 24, 39);

      titleMeasurement.lines.forEach((line) => {
        doc.text(line, profile.marginX, y);
        y += 4.3;
      });

      if (item.duration) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(profile.dateSize);
        doc.setTextColor(86, 96, 112);

        doc.text(
          item.duration,
          pageWidth - profile.marginX,
          y - titleMeasurement.height,
          {
            align: "right",
          }
        );
      }
    } else if (item.duration) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(profile.dateSize);
      doc.setTextColor(86, 96, 112);

      doc.text(
        item.duration,
        pageWidth - profile.marginX,
        y,
        {
          align: "right",
        }
      );

      y += 4.2;
    }

    if (item.company) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(profile.smallSize);
      doc.setTextColor(71, 85, 105);

      const companyLines = doc.splitTextToSize(
        item.company,
        contentWidth
      ) as string[];

      companyLines.forEach((line) => {
        ensureSpace(4);
        doc.text(line, profile.marginX, y);
        y += 4;
      });

      y += 1;
    }

    drawBulletList(item.bullets);
    y += profile.experienceGap;
  }

  function measureSkillsHeight() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(profile.bodySize);

    const skillLines = doc.splitTextToSize(
      data.skills.join(" | "),
      contentWidth
    ) as string[];

    return skillLines.length * profile.bodyLineHeight;
  }

  function drawSkills() {
    const text = data.skills.join(" | ");

    drawWrappedText({
      text,
      x: profile.marginX,
      width: contentWidth,
      fontSize: profile.bodySize,
      lineHeight: profile.bodyLineHeight,
    });

    y += profile.paragraphBottomGap;
  }

  function measureEducationSectionHeight() {
    let height = sectionHeaderHeight();

    for (const item of data.education) {
      if (item.degree || item.year) {
        const degreeWidth = item.year
          ? contentWidth * 0.76
          : contentWidth;

        const degreeLines = measureWrappedText(
          item.degree || "",
          degreeWidth,
          profile.bodySize,
          4.1,
          "bold"
        ).lines.length;

        height += Math.max(1, degreeLines) * 4.1;
      }

      if (item.college) {
        const collegeLines = measureWrappedText(
          item.college,
          contentWidth,
          profile.smallSize,
          3.8
        ).lines.length;

        height += collegeLines * 3.8;
      }

      height += 2;
    }

    return height;
  }

  function drawEducationItem(
    item: NormalizedResumeData["education"][number]
  ) {
    const leftWidth = item.year
      ? contentWidth * 0.76
      : contentWidth;

    if (item.degree) {
      const degreeLines = measureWrappedText(
        item.degree,
        leftWidth,
        profile.bodySize,
        4.1,
        "bold"
      ).lines;

      ensureSpace(degreeLines.length * 4.1 + 4);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(profile.bodySize);
      doc.setTextColor(17, 24, 39);

      degreeLines.forEach((line) => {
        doc.text(line, profile.marginX, y);
        y += 4.1;
      });

      if (item.year) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(profile.dateSize);
        doc.setTextColor(86, 96, 112);

        doc.text(
          item.year,
          pageWidth - profile.marginX,
          y - degreeLines.length * 4.1,
          {
            align: "right",
          }
        );
      }
    } else if (item.year) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(profile.dateSize);
      doc.setTextColor(86, 96, 112);

      doc.text(
        item.year,
        pageWidth - profile.marginX,
        y,
        {
          align: "right",
        }
      );

      y += 4;
    }

    if (item.college) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(profile.smallSize);
      doc.setTextColor(71, 85, 105);

      const collegeLines = doc.splitTextToSize(
        item.college,
        contentWidth
      ) as string[];

      collegeLines.forEach((line) => {
        doc.text(line, profile.marginX, y);
        y += 3.8;
      });
    }

    y += 2;
  }

  // HEADER ----------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(profile.nameSize);
  doc.setTextColor(17, 24, 39);

  const nameLines = doc.splitTextToSize(
    data.candidateName.toUpperCase(),
    contentWidth
  ) as string[];

  nameLines.forEach((line) => {
    doc.text(line, pageWidth / 2, y, {
      align: "center",
    });

    y += profile.nameSize * 0.36;
  });

  y += 1.5;

  const headlineMeasurement = measureWrappedText(
    data.headline,
    contentWidth,
    profile.headlineSize,
    4,
    "bold"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(profile.headlineSize);
  doc.setTextColor(71, 85, 105);

  headlineMeasurement.lines.forEach((line) => {
    doc.text(line, pageWidth / 2, y, {
      align: "center",
    });

    y += 4;
  });

  const contactLine = [
    data.contact.location,
    data.contact.email,
    data.contact.phone,
    data.contact.linkedin,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contactLine) {
    y += 1.5;

    const contactMeasurement = measureWrappedText(
      contactLine,
      contentWidth,
      profile.contactSize,
      3.6
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(profile.contactSize);
    doc.setTextColor(100, 116, 139);

    contactMeasurement.lines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, {
        align: "center",
      });

      y += 3.6;
    });
  }

  y += 3;

  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.32);

  doc.line(
    profile.marginX,
    y,
    pageWidth - profile.marginX,
    y
  );

  y += profile.headerBottomGap;

  // SUMMARY ---------------------------------------------------------

  const summaryMeasurement = measureWrappedText(
    data.summary,
    contentWidth,
    profile.bodySize,
    profile.bodyLineHeight
  );

  drawSectionTitle(
    "Professional Summary",
    summaryMeasurement.height
  );

  drawParagraph(data.summary);

  // EXPERIENCE ------------------------------------------------------

  if (
    data.experience.length > 0 ||
    data.fallbackBullets.length > 0
  ) {
    const firstExperienceHeight =
      data.experience.length > 0
        ? Math.min(
            measureExperienceItem(data.experience[0]),
            35
          )
        : Math.min(
            data.fallbackBullets
              .slice(0, 2)
              .reduce(
                (total, bullet) =>
                  total + measureBulletHeight(bullet),
                0
              ),
            30
          );

    drawSectionTitle(
      "Professional Experience",
      firstExperienceHeight
    );

    if (data.experience.length > 0) {
      data.experience.forEach(drawExperienceItem);
    } else {
      drawBulletList(data.fallbackBullets);
    }
  }

  // SKILLS ----------------------------------------------------------

  if (data.skills.length > 0) {
    const skillsHeight = measureSkillsHeight();

    drawSectionTitle("Core Skills", skillsHeight);
    drawSkills();
  }

  // PROJECTS --------------------------------------------------------

  if (data.projects.length > 0) {
    const firstProject = data.projects[0];

    const firstProjectHeight =
      (firstProject.title ? 5 : 0) +
      (firstProject.description
        ? measureWrappedText(
            firstProject.description,
            contentWidth,
            profile.bodySize,
            profile.bodyLineHeight
          ).height
        : 0);

    drawSectionTitle("Projects", firstProjectHeight);

    data.projects.forEach((project) => {
      let estimatedHeight = 0;

      if (project.title) estimatedHeight += 5;

      if (project.description) {
        estimatedHeight += measureWrappedText(
          project.description,
          contentWidth,
          profile.bodySize,
          profile.bodyLineHeight
        ).height;
      }

      estimatedHeight += profile.paragraphBottomGap;

      if (
        estimatedHeight <= pageBottom - profile.marginTop &&
        estimatedHeight > remainingSpace()
      ) {
        startNewPage();
      }

      if (project.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(profile.bodySize);
        doc.setTextColor(17, 24, 39);

        doc.text(project.title, profile.marginX, y);
        y += 4.5;
      }

      if (project.description) {
        drawParagraph(
          project.description,
          profile.paragraphBottomGap
        );
      }
    });
  }

  // CERTIFICATIONS --------------------------------------------------

  if (data.certifications.length > 0) {
    const firstCertificationHeight =
      measureBulletHeight(data.certifications[0]);

    drawSectionTitle(
      "Certifications",
      firstCertificationHeight
    );

    drawBulletList(data.certifications);
  }

  // EDUCATION -------------------------------------------------------

  if (data.education.length > 0) {
    const educationHeight =
      measureEducationSectionHeight();

    /*
     * Keep the entire Education section together whenever it can fit
     * on one page. This removes the awkward education-only spill.
     */
    if (
      educationHeight <= pageBottom - profile.marginTop &&
      educationHeight > remainingSpace()
    ) {
      startNewPage();
    }

    drawSectionTitle(
      "Education",
      Math.max(8, educationHeight - sectionHeaderHeight())
    );

    data.education.forEach(drawEducationItem);
  }
}

function addPageFooters(
  doc: jsPDF,
  profile: LayoutProfile
) {
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 7;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);

    doc.line(
      profile.marginX,
      footerY - 3.5,
      pageWidth - profile.marginX,
      footerY - 3.5
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    doc.text(
      "Generated with Resume Roast AI",
      profile.marginX,
      footerY
    );

    if (pageCount > 1) {
      doc.text(
        `${page} / ${pageCount}`,
        pageWidth - profile.marginX,
        footerY,
        {
          align: "right",
        }
      );
    }
  }
}