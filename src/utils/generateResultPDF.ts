import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ResultPDFData {
  schoolName: string;
  schoolAddress?: string;
  schoolLogoUrl?: string;
  schoolEmail?: string;
  schoolPhone?: string;
  studentName: string;
  registrationNumber: string;
  className: string;
  gender?: string;
  termName?: string;
  sessionName?: string;
  studentPhotoUrl?: string;
  subjects: Array<{
    subject_name: string;
    ca1_score: number;
    ca2_score: number;
    exam_score: number;
    total_score: number;
    grade: string;
    remarks?: string;
  }>;
  totalScore: number;
  averageScore: number;
  position?: number;
  outOf?: number;
  attendancePresent: number;
  attendanceTotal: number;
  teacherRemarks?: string;
  principalRemarks?: string;
  behavioralRatings?: Record<string, number>;
}

const RATING_LABELS: Record<string, string> = {
  punctuality: "Punctuality",
  neatness: "Neatness",
  conduct: "Conduct",
  attentiveness: "Attentiveness",
  perseverance: "Perseverance",
  relationship_with_others: "Relationship with Others",
  honesty: "Honesty",
};

const RATING_SCALE = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const getGradeColor = (grade: string): [number, number, number] => {
  switch (grade) {
    case "A": return [34, 139, 34];
    case "B": return [0, 100, 200];
    case "C": return [200, 150, 0];
    case "D": return [200, 100, 0];
    case "F": return [200, 0, 0];
    default: return [0, 0, 0];
  }
};

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getGradeRemark(grade: string): string {
  switch (grade) {
    case "A": return "Excellent";
    case "B": return "Very Good";
    case "C": return "Good";
    case "D": return "Pass";
    case "F": return "Fail";
    default: return "";
  }
}

// Draw decorative border on the page
function drawPageBorder(doc: jsPDF, margin: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const m = margin - 5;

  // Outer border
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(1.2);
  doc.rect(m, m, pageWidth - 2 * m, pageHeight - 2 * m);

  // Inner border
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.3);
  doc.rect(m + 2, m + 2, pageWidth - 2 * m - 4, pageHeight - 2 * m - 4);

  // Corner decorations
  const cornerSize = 6;
  const corners = [
    [m, m], // top-left
    [pageWidth - m - cornerSize, m], // top-right
    [m, pageHeight - m - cornerSize], // bottom-left
    [pageWidth - m - cornerSize, pageHeight - m - cornerSize], // bottom-right
  ];

  doc.setFillColor(20, 60, 120);
  corners.forEach(([cx, cy]) => {
    doc.rect(cx, cy, cornerSize, 1.2, "F");
    doc.rect(cx, cy, 1.2, cornerSize, "F");
  });
}

// Draw SmartSchool watermark in the center
function drawWatermark(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.saveGraphicsState();
  // @ts-ignore - setGState exists in jsPDF
  const gState = new (doc as any).GState({ opacity: 0.06 });
  // @ts-ignore
  doc.setGState(gState);
  doc.setFontSize(55);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 60, 120);

  // Rotate text diagonally
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  // Draw watermark text rotated
  doc.text("SmartSchool", centerX, centerY - 15, {
    align: "center",
    angle: 35,
  });
  doc.text("REPORT CARD", centerX, centerY + 15, {
    align: "center",
    angle: 35,
  });

  doc.restoreGraphicsState();
}

export const generateResultPDF = async (data: ResultPDFData) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // ===== DECORATIVE BORDER =====
  drawPageBorder(doc, margin);

  // ===== WATERMARK =====
  drawWatermark(doc);

  // ===== HEADER WITH SCHOOL INFO =====
  // Try to load school logo
  if (data.schoolLogoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = data.schoolLogoUrl!;
      });
      doc.addImage(img, "PNG", margin + 2, y, 18, 18);
    } catch {
      // Skip logo if loading fails
    }
  }

  // School name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 60, 120);
  doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y + 8, { align: "center" });

  y += 14;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  if (data.schoolAddress) {
    doc.text(data.schoolAddress, pageWidth / 2, y, { align: "center" });
    y += 5;
  }
  const contactParts = [data.schoolEmail, data.schoolPhone].filter(Boolean);
  if (contactParts.length) {
    doc.text(contactParts.join(" | "), pageWidth / 2, y, { align: "center" });
    y += 5;
  }

  // Decorative divider
  y += 2;
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.8);
  doc.line(margin + 5, y, pageWidth - margin - 5, y);
  doc.setLineWidth(0.2);
  doc.line(margin + 5, y + 1.5, pageWidth - margin - 5, y + 1.5);
  y += 4;

  // Title bar
  doc.setFillColor(20, 60, 120);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 8, 1, 1, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const titleParts = ["STUDENT ACADEMIC REPORT"];
  if (data.termName) titleParts.push(`- ${data.termName}`);
  if (data.sessionName) titleParts.push(`(${data.sessionName})`);
  doc.text(titleParts.join(" "), pageWidth / 2, y + 5.5, { align: "center" });
  y += 14;

  // ===== STUDENT INFO BOX WITH PHOTO =====
  const infoBoxH = 28;
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, infoBoxH, 2, 2, "FD");

  // Student photo area
  const photoX = pageWidth - margin - 24;
  const photoY = y + 2;
  const photoW = 20;
  const photoH = 24;
  
  // Photo frame
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.4);
  doc.roundedRect(photoX, photoY, photoW, photoH, 1, 1, "FD");
  
  // Try to load student photo
  if (data.studentPhotoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = data.studentPhotoUrl!;
      });
      doc.addImage(img, "JPEG", photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
    } catch {
      // Show placeholder text
      doc.setFontSize(6);
      doc.setTextColor(160, 160, 160);
      doc.text("STUDENT", photoX + photoW / 2, photoY + photoH / 2 - 1, { align: "center" });
      doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2 + 3, { align: "center" });
    }
  } else {
    doc.setFontSize(6);
    doc.setTextColor(160, 160, 160);
    doc.text("STUDENT", photoX + photoW / 2, photoY + photoH / 2 - 1, { align: "center" });
    doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2 + 3, { align: "center" });
  }
  
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const infoY = y + 6;
  const infoRightLimit = photoX - 5;

  doc.setFont("helvetica", "bold");
  doc.text("Student Name:", margin + 4, infoY);
  doc.setFont("helvetica", "normal");
  doc.text(data.studentName, margin + 35, infoY);

  doc.setFont("helvetica", "bold");
  doc.text("Reg. Number:", margin + 4, infoY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(data.registrationNumber, margin + 35, infoY + 7);

  doc.setFont("helvetica", "bold");
  doc.text("Class:", margin + 4, infoY + 14);
  doc.setFont("helvetica", "normal");
  doc.text(data.className, margin + 35, infoY + 14);

  // Right column info
  const midCol = margin + 85;
  doc.setFont("helvetica", "bold");
  doc.text("Gender:", midCol, infoY);
  doc.setFont("helvetica", "normal");
  doc.text(data.gender || "N/A", midCol + 18, infoY);

  if (data.position) {
    doc.setFont("helvetica", "bold");
    doc.text("Position:", midCol, infoY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.position}${getOrdinal(data.position)} of ${data.outOf || "N/A"}`, midCol + 18, infoY + 7);
  }

  doc.setFont("helvetica", "bold");
  doc.text("Attendance:", midCol, infoY + 14);
  doc.setFont("helvetica", "normal");
  const attendPercent = data.attendanceTotal > 0
    ? Math.round((data.attendancePresent / data.attendanceTotal) * 100)
    : 0;
  doc.text(`${data.attendancePresent}/${data.attendanceTotal} (${attendPercent}%)`, midCol + 22, infoY + 14);

  y += infoBoxH + 5;

  // ===== SUBJECT SCORES TABLE =====
  const tableData = data.subjects.map((s, i) => [
    (i + 1).toString(),
    s.subject_name,
    s.ca1_score.toString(),
    s.ca2_score.toString(),
    (s.ca1_score + s.ca2_score).toString(),
    s.exam_score.toString(),
    s.total_score.toString(),
    s.grade,
    s.remarks || getGradeRemark(s.grade),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["S/N", "Subject", "CA1 (20)", "CA2 (20)", "CA Total", "Exam (60)", "Total (100)", "Grade", "Remark"]],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [20, 60, 120],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { halign: "left", cellWidth: 35 },
      7: { fontStyle: "bold" },
      8: { halign: "left", cellWidth: 25 },
    },
    didParseCell: (hookData) => {
      if (hookData.section === "body" && hookData.column.index === 7) {
        const grade = hookData.cell.raw as string;
        const color = getGradeColor(grade);
        hookData.cell.styles.textColor = color;
      }
    },
    theme: "grid",
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: {
      lineColor: [20, 60, 120],
      lineWidth: 0.2,
    },
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  // ===== SUMMARY ROW =====
  doc.setFillColor(20, 60, 120);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 7, 1, 1, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`Total: ${data.totalScore}`, margin + 4, y + 5);
  doc.text(`Average: ${data.averageScore}%`, pageWidth / 2 - 15, y + 5);
  doc.text(`Subjects: ${data.subjects.length}`, pageWidth / 2 + 20, y + 5);
  if (data.position) {
    doc.text(`Position: ${data.position}${getOrdinal(data.position)} of ${data.outOf}`, pageWidth - margin - 45, y + 5);
  }
  y += 12;

  // ===== BEHAVIORAL ASSESSMENT =====
  if (data.behavioralRatings && Object.keys(data.behavioralRatings).length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 60, 120);
    doc.text("BEHAVIORAL ASSESSMENT", margin, y);
    y += 5;

    const behavioralData = Object.entries(data.behavioralRatings).map(([key, value]) => [
      RATING_LABELS[key] || key.replace(/_/g, " "),
      RATING_SCALE[Math.min(Math.max(value - 1, 0), 4)] || "N/A",
      `${value} / 5`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Trait", "Rating", "Scale (1-5)"]],
      body: behavioralData,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [60, 100, 150],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { halign: "center", cellWidth: 30 },
        2: { halign: "center" },
      },
      theme: "grid",
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: {
        lineColor: [20, 60, 120],
        lineWidth: 0.2,
      },
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ===== REMARKS =====
  if (data.teacherRemarks || data.principalRemarks) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 60, 120);
    doc.text("REMARKS", margin, y);
    y += 2;

    // Remarks box
    const remarksH = (data.teacherRemarks && data.principalRemarks) ? 18 : 10;
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(20, 60, 120);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, remarksH, 1, 1, "FD");
    y += 5;

    if (data.teacherRemarks) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Class Teacher:", margin + 3, y);
      doc.setFont("helvetica", "italic");
      doc.text(data.teacherRemarks, margin + 30, y);
      y += 6;
    }

    if (data.principalRemarks) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Principal:", margin + 3, y);
      doc.setFont("helvetica", "italic");
      doc.text(data.principalRemarks, margin + 30, y);
      y += 6;
    }
    y += 3;
  }

  // ===== GRADING KEY =====
  y += 2;
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 14, 1, 1, "FD");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 60, 120);
  doc.text("GRADING KEY:", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("A = 70-100 (Excellent) | B = 60-69 (Very Good) | C = 50-59 (Good) | D = 40-49 (Pass) | F = 0-39 (Fail)", margin + 30, y + 5);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-NG", { dateStyle: "long" })}`, margin + 4, y + 10);

  // ===== SIGNATURE LINES =====
  y += 20;
  const sigWidth = 45;
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.3);

  // Teacher signature
  doc.line(margin + 5, y, margin + 5 + sigWidth, y);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Class Teacher's Signature", margin + 5 + sigWidth / 2, y + 4, { align: "center" });

  // Principal signature
  doc.line(pageWidth - margin - 5 - sigWidth, y, pageWidth - margin - 5, y);
  doc.text("Principal's Signature & Stamp", pageWidth - margin - 5 - sigWidth / 2, y + 4, { align: "center" });

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(20, 60, 120);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 60, 120);
  doc.text(`${data.schoolName} - Academic Report Card`, pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 140, 140);
  doc.text("Powered by SmartSchool | This is a computer-generated document", pageWidth / 2, pageHeight - 6.5, { align: "center" });

  // Save
  const fileName = `${data.studentName.replace(/\s+/g, "_")}_Result_${data.termName || "Term"}.pdf`;
  doc.save(fileName);
};
