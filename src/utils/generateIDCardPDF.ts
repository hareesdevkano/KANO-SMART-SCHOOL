import jsPDF from "jspdf";

export type IDCardDesign = "emerald" | "midnight" | "minimal";

export interface IDCardPDFData {
  studentName: string;
  registrationNumber: string;
  className: string;
  gender: string;
  session: string;
  schoolName: string;
  schoolAddress?: string;
  schoolLogoUrl?: string;
  photoUrl?: string;
  design?: IDCardDesign;
}

type RGB = [number, number, number];

interface Theme {
  bg: RGB;
  bgSoft: RGB;
  header: RGB;
  headerSoft: RGB;
  accentBar: RGB;
  gold: RGB;
  goldLight: RGB;
  goldDark: RGB;
  label: RGB;
  value: RGB;
  headerText: RGB;
  footerBg: RGB;
  frame: RGB;
  badgeBg: RGB;
  badgeText: RGB;
  photoBg: RGB;
  shadow: RGB;
}

const THEMES: Record<IDCardDesign, Theme> = {
  emerald: {
    bg: [255, 255, 255],
    bgSoft: [240, 238, 226],
    header: [6, 78, 59],
    headerSoft: [13, 122, 95],
    accentBar: [13, 110, 80],
    gold: [201, 168, 76],
    goldLight: [240, 221, 155],
    goldDark: [140, 110, 38],
    label: [104, 112, 108],
    value: [17, 24, 22],
    headerText: [253, 251, 244],
    footerBg: [243, 241, 232],
    frame: [6, 78, 59],
    badgeBg: [201, 168, 76],
    badgeText: [26, 26, 26],
    photoBg: [240, 238, 228],
    shadow: [200, 205, 200],
  },
  midnight: {
    bg: [19, 26, 43],
    bgSoft: [10, 15, 26],
    header: [10, 15, 26],
    headerSoft: [27, 35, 56],
    accentBar: [201, 168, 76],
    gold: [201, 168, 76],
    goldLight: [247, 236, 192],
    goldDark: [141, 111, 38],
    label: [155, 168, 188],
    value: [248, 250, 252],
    headerText: [248, 250, 252],
    footerBg: [8, 13, 24],
    frame: [201, 168, 76],
    badgeBg: [201, 168, 76],
    badgeText: [17, 24, 39],
    photoBg: [33, 43, 64],
    shadow: [6, 9, 17],
  },
  minimal: {
    bg: [254, 253, 248],
    bgSoft: [235, 231, 216],
    header: [254, 253, 248],
    headerSoft: [246, 243, 232],
    accentBar: [6, 78, 59],
    gold: [201, 168, 76],
    goldLight: [240, 221, 155],
    goldDark: [140, 110, 38],
    label: [138, 134, 120],
    value: [22, 30, 28],
    headerText: [6, 78, 59],
    footerBg: [246, 243, 232],
    frame: [206, 200, 182],
    badgeBg: [6, 78, 59],
    badgeText: [253, 251, 244],
    photoBg: [248, 246, 238],
    shadow: [214, 210, 196],
  },
};

const setFill = (doc: jsPDF, c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/** Fakes a gradient by painting thin horizontal bands (jsPDF has no native gradients). */
const gradientRect = (
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  from: RGB,
  to: RGB,
  steps = 24
) => {
  const bandH = h / steps;
  for (let i = 0; i < steps; i++) {
    setFill(doc, mix(from, to, i / (steps - 1)));
    doc.rect(x, y + i * bandH, w, bandH + 0.05, "F");
  }
};

const truncate = (value: string, max: number) =>
  value && value.length > max ? `${value.substring(0, max - 1)}…` : value || "";

const field = (
  doc: jsPDF,
  theme: Theme,
  label: string,
  value: string,
  x: number,
  y: number,
  max = 22
) => {
  doc.setFontSize(3.2);
  doc.setFont("helvetica", "bold");
  setText(doc, theme.label);
  doc.text(label.toUpperCase(), x, y);
  doc.setFontSize(5.6);
  setText(doc, theme.value);
  doc.text(truncate(value || "N/A", max), x, y + 2.9);
};

const drawIDCard = (
  doc: jsPDF,
  data: IDCardPDFData,
  x: number,
  y: number,
  cardW: number,
  cardH: number
) => {
  const design: IDCardDesign = data.design ?? "emerald";
  const theme = THEMES[design];

  // Drop shadow for a lifted, 3D feel
  setFill(doc, theme.shadow);
  doc.roundedRect(x + 0.7, y + 0.9, cardW, cardH, 2.4, 2.4, "F");

  // Card surface with vertical gradient
  doc.saveGraphicsState();
  setFill(doc, theme.bg);
  doc.roundedRect(x, y, cardW, cardH, 2.4, 2.4, "F");
  gradientRect(doc, x + 0.35, y + 0.35, cardW - 0.7, cardH - 0.7, theme.bg, theme.bgSoft, 28);
  doc.restoreGraphicsState();

  setDraw(doc, theme.frame);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, cardW, cardH, 2.4, 2.4, "D");

  const headerH = design === "minimal" ? 13 : 14.5;

  // Top foil rule
  gradientRect(doc, x + 0.4, y + 0.4, cardW - 0.8, 1.2, theme.goldLight, theme.goldDark, 6);

  if (design !== "minimal") {
    gradientRect(doc, x + 0.4, y + 1.6, cardW - 0.8, headerH - 1.2, theme.header, theme.headerSoft, 20);
    // Bevel highlight + gold separator
    setFill(doc, theme.goldLight);
    doc.rect(x + 0.4, y + headerH + 0.4, cardW - 0.8, 0.35, "F");
    setFill(doc, theme.goldDark);
    doc.rect(x + 0.4, y + headerH + 0.75, cardW - 0.8, 0.35, "F");
  } else {
    setFill(doc, theme.accentBar);
    doc.rect(x + 0.4, y + headerH + 0.4, cardW - 0.8, 0.3, "F");
  }

  // Monogram tile (embossed)
  const monoX = x + 8.5;
  const monoY = y + headerH / 2 + 1.2;
  setFill(doc, theme.shadow);
  doc.rect(monoX - 3.7, monoY - 4.1, 8, 8, "F");
  if (design === "minimal") {
    gradientRect(doc, monoX - 4, monoY - 4.4, 8, 8, theme.headerSoft, theme.accentBar, 8);
    setText(doc, [253, 251, 244]);
  } else {
    gradientRect(doc, monoX - 4, monoY - 4.4, 8, 8, theme.goldLight, theme.goldDark, 8);
    setText(doc, theme.badgeText);
  }
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text((data.schoolName || "S").charAt(0).toUpperCase(), monoX, monoY + 0.6, {
    align: "center",
  });

  // School name + address
  doc.setFontSize(6.4);
  doc.setFont("helvetica", "bold");
  setText(doc, theme.headerText);
  doc.text(truncate(data.schoolName, 34).toUpperCase(), x + 15, y + headerH / 2 - 0.6);
  doc.setFontSize(3.6);
  doc.setFont("helvetica", "normal");
  setText(doc, design === "minimal" ? theme.label : theme.gold);
  doc.text(truncate(data.schoolAddress || "School Address", 52), x + 15, y + headerH / 2 + 2.8);

  // ID badge
  gradientRect(doc, x + cardW - 22, y + headerH / 2 - 2.6, 17.5, 5.2, theme.goldLight, theme.goldDark, 6);
  doc.setFontSize(4.2);
  doc.setFont("helvetica", "bold");
  setText(doc, design === "minimal" ? theme.badgeText : [26, 26, 26]);
  doc.text("STUDENT ID", x + cardW - 13.25, y + headerH / 2 + 0.9, { align: "center" });

  // Photo frame (with shadow + optional real photo)
  const photoX = x + 6;
  const photoY = y + headerH + 4.5;
  const photoW = 18;
  const photoH = 22;
  setFill(doc, theme.shadow);
  doc.roundedRect(photoX + 0.5, photoY + 0.6, photoW, photoH, 1, 1, "F");
  setFill(doc, theme.photoBg);
  setDraw(doc, theme.accentBar);
  doc.setLineWidth(0.35);
  doc.roundedRect(photoX, photoY, photoW, photoH, 1, 1, "FD");

  if (data.photoUrl) {
    try {
      const format = data.photoUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(data.photoUrl, format, photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
    } catch {
      /* fall back to placeholder text below */
    }
  } else {
    doc.setFontSize(4.2);
    doc.setFont("helvetica", "bold");
    setText(doc, theme.label);
    doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2 + 1, { align: "center" });
  }

  // Details
  const detailX = photoX + photoW + 5;
  const col2X = detailX + 27;
  let cursorY = photoY + 2;

  doc.setFontSize(3.2);
  doc.setFont("helvetica", "bold");
  setText(doc, theme.label);
  doc.text("STUDENT NAME", detailX, cursorY);
  cursorY += 3.4;
  doc.setFontSize(7.4);
  doc.setFont("helvetica", "bold");
  setText(doc, theme.value);
  doc.text(truncate(data.studentName || "Student", 26), detailX, cursorY);
  cursorY += 1.8;
  gradientRect(doc, detailX, cursorY - 0.2, 50, 0.6, theme.goldLight, theme.goldDark, 4);
  cursorY += 4.4;

  field(doc, theme, "Reg. Number", data.registrationNumber, detailX, cursorY, 18);
  field(doc, theme, "Class", data.className, col2X, cursorY, 16);
  cursorY += 8;
  field(doc, theme, "Gender", data.gender, detailX, cursorY, 18);
  field(doc, theme, "Session", data.session, col2X, cursorY, 16);

  // Footer
  const footerH = 7;
  gradientRect(
    doc,
    x + 0.4,
    y + cardH - footerH - 0.4,
    cardW - 0.8,
    footerH,
    theme.bgSoft,
    theme.footerBg,
    10
  );
  gradientRect(doc, x + 0.4, y + cardH - footerH - 0.9, cardW - 0.8, 0.5, theme.goldLight, theme.goldDark, 4);

  doc.setFontSize(3.4);
  doc.setFont("helvetica", "italic");
  setText(doc, theme.label);
  doc.text("If found, please return to the school address above", x + cardW / 2, y + cardH - 4.4, {
    align: "center",
  });
  doc.setFontSize(3.4);
  doc.setFont("helvetica", "bold");
  setText(doc, design === "midnight" ? theme.gold : theme.accentBar);
  doc.text(
    "Powered by Dual Intelligence ICT Services Kano",
    x + cardW / 2,
    y + cardH - 1.8,
    { align: "center" }
  );
};

export const generateIDCardPDF = async (data: IDCardPDFData) => {
  const cardW = 85.6;
  const cardH = 53.98;
  const doc = new jsPDF("l", "mm", [cardW, cardH]);
  drawIDCard(doc, data, 0, 0, cardW, cardH);
  const fileName = `${(data.studentName || "student").replace(/\s+/g, "_")}_ID_Card.pdf`;
  doc.save(fileName);
};

export const generateBulkIDCardsPDF = async (students: IDCardPDFData[]) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageH = doc.internal.pageSize.getHeight();
  const cardW = 85.6;
  const cardH = 53.98;
  const margin = 12;
  const gapX = 6;
  const gapY = 8;
  const cols = 2;
  const rows = Math.floor((pageH - 2 * margin + gapY) / (cardH + gapY));

  students.forEach((data, idx) => {
    const posOnPage = idx % (cols * rows);
    const col = posOnPage % cols;
    const row = Math.floor(posOnPage / cols);

    if (idx > 0 && posOnPage === 0) doc.addPage();

    const x = margin + col * (cardW + gapX);
    const y = margin + row * (cardH + gapY);

    drawIDCard(doc, data, x, y, cardW, cardH);
  });

  doc.save("Student_ID_Cards_Bulk.pdf");
};
