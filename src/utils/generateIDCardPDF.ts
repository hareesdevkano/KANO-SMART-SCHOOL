import jsPDF from "jspdf";

interface IDCardPDFData {
  studentName: string;
  registrationNumber: string;
  className: string;
  gender: string;
  session: string;
  schoolName: string;
  schoolAddress?: string;
  schoolLogoUrl?: string;
  photoUrl?: string;
}

// Draw a single professional ID card on the document at position (x, y)
const drawIDCard = (doc: jsPDF, data: IDCardPDFData, x: number, y: number, cardW: number, cardH: number) => {
  // White background with rounded corners
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, cardW, cardH, 2, 2, "F");

  // Outer border
  doc.setDrawColor(13, 110, 80);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, cardW, cardH, 2, 2, "D");

  // Inner decorative border
  doc.setDrawColor(13, 110, 80);
  doc.setLineWidth(0.15);
  doc.roundedRect(x + 1.2, y + 1.2, cardW - 2.4, cardH - 2.4, 1.5, 1.5, "D");

  // Top gradient stripe
  doc.setFillColor(13, 110, 80);
  doc.rect(x + 1.2, y + 1.2, cardW - 2.4, 1.5, "F");
  
  // Gold accent line
  doc.setFillColor(234, 179, 8);
  doc.rect(x + 1.2, y + 2.7, cardW - 2.4, 0.5, "F");

  // Header bar
  doc.setFillColor(13, 85, 60);
  doc.rect(x + 1.2, y + 3.2, cardW - 2.4, 11, "F");

  // School logo circle
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 9, y + 8.7, 3.8, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 85, 60);
  doc.text(data.schoolName.charAt(0).toUpperCase(), x + 9, y + 10.2, { align: "center" });

  // School name
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const schoolNameTrunc = data.schoolName.length > 30 ? data.schoolName.substring(0, 30) + "..." : data.schoolName;
  doc.text(schoolNameTrunc.toUpperCase(), x + 15, y + 7.5);

  // School address
  doc.setFontSize(4);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 230, 215);
  const addr = data.schoolAddress || "School Address";
  const addrTrunc = addr.length > 45 ? addr.substring(0, 45) + "..." : addr;
  doc.text(addrTrunc, x + 15, y + 10.5);

  // STUDENT ID badge
  doc.setFillColor(234, 179, 8);
  doc.roundedRect(x + cardW - 19, y + 5, 16, 5, 1.2, 1.2, "F");
  doc.setFontSize(4.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("STUDENT ID", x + cardW - 11, y + 8.2, { align: "center" });

  // Decorative side accent
  doc.setFillColor(13, 110, 80);
  doc.rect(x + 1.2, y + 14.2, 1, cardH - 22.4, "F");

  // Photo placeholder with professional frame
  const photoX = x + 5;
  const photoY = y + 16;
  const photoW = 18;
  const photoH = 22;
  
  // Photo shadow
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(photoX + 0.5, photoY + 0.5, photoW, photoH, 1, 1, "F");
  
  // Photo border
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(13, 110, 80);
  doc.setLineWidth(0.4);
  doc.roundedRect(photoX, photoY, photoW, photoH, 1, 1, "FD");
  
  // Photo icon
  doc.setFontSize(5);
  doc.setTextColor(160, 160, 160);
  doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2 + 1, { align: "center" });

  // Student details section
  const detailX = x + 27;
  let detailY = y + 17;

  // Name field with underline
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("STUDENT NAME", detailX, detailY);
  detailY += 2.5;
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  const nameTrunc = data.studentName.length > 22 ? data.studentName.substring(0, 22) + "..." : data.studentName;
  doc.text(nameTrunc, detailX, detailY);
  detailY += 1.5;
  doc.setDrawColor(13, 110, 80);
  doc.setLineWidth(0.2);
  doc.line(detailX, detailY, detailX + 50, detailY);
  detailY += 3;

  // Two-column layout
  const col2X = detailX + 26;

  // Row 1: Reg No & Class
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("REG. NUMBER", detailX, detailY);
  doc.text("CLASS", col2X, detailY);
  detailY += 2.5;
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(data.registrationNumber || "N/A", detailX, detailY);
  doc.text(data.className || "N/A", col2X, detailY);
  detailY += 3.5;

  // Row 2: Gender & Session
  doc.setFontSize(3.5);
  doc.setTextColor(100, 100, 100);
  doc.text("GENDER", detailX, detailY);
  doc.text("SESSION", col2X, detailY);
  detailY += 2.5;
  doc.setFontSize(5.5);
  doc.setTextColor(20, 20, 20);
  doc.text(data.gender || "N/A", detailX, detailY);
  doc.text(data.session || "N/A", col2X, detailY);

  // Bottom decorative bar
  doc.setFillColor(13, 110, 80);
  doc.rect(x + 1.2, y + cardH - 7.5, cardW - 2.4, 0.3, "F");

  // Footer
  doc.setFillColor(248, 248, 248);
  doc.rect(x + 1.2, y + cardH - 7.2, cardW - 2.4, 5.8, "F");

  // Gold bottom accent
  doc.setFillColor(234, 179, 8);
  doc.rect(x + 1.2, y + cardH - 2.6, cardW - 2.4, 1.2, "F");

  doc.setFontSize(3.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("If found, please return to the school address above", x + cardW / 2, y + cardH - 4.5, { align: "center" });

  doc.setFontSize(3.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 110, 80);
  doc.text("Powered by SmartSchool", x + cardW / 2, y + cardH - 2, { align: "center" });
};

export const generateIDCardPDF = async (data: IDCardPDFData) => {
  // Standard credit card size: 85.6mm x 53.98mm
  const cardW = 85.6;
  const cardH = 53.98;
  const doc = new jsPDF("l", "mm", [cardW, cardH]);

  drawIDCard(doc, data, 0, 0, cardW, cardH);

  const fileName = `${data.studentName.replace(/\s+/g, "_")}_ID_Card.pdf`;
  doc.save(fileName);
};

export const generateBulkIDCardsPDF = async (students: IDCardPDFData[]) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
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
