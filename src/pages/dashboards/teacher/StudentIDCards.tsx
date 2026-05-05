import { useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllStudents, useTeacherClasses } from "@/hooks/useTeacherData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard as IdCard,
  Download,
  Printer,
  Users,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from "lucide-react";
import Barcode from "react-barcode";
import { generateIDCardPDF, generateBulkIDCardsPDF } from "@/utils/generateIDCardPDF";

const StudentIDCard = ({
  student,
  school,
  cardRef,
}: {
  student: any;
  school: any;
  cardRef?: React.RefObject<HTMLDivElement>;
}) => {
  const currentYear = new Date().getFullYear();
  const sessionYear = `${currentYear}/${currentYear + 1}`;

  return (
    <div
      ref={cardRef}
      className="w-[360px] h-[228px] rounded-xl overflow-hidden shadow-xl border border-border relative bg-card"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Top accent stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-[hsl(168,84%,24%)] via-[hsl(168,76%,36%)] to-[hsl(45,93%,47%)]" />

      {/* Header with school info */}
      <div className="flex items-center gap-2 px-4 pt-2 pb-1.5 bg-[hsl(168,90%,18%)]">
        {school?.logo_url ? (
          <img
            src={school.logo_url}
            alt="Logo"
            className="w-9 h-9 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">
              {school?.name?.charAt(0) || "S"}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[11px] leading-tight truncate">
            {school?.name || "School Name"}
          </p>
          <p className="text-white/70 text-[8px] leading-tight truncate">
            {school?.address ? `${school.address}, ${school.city || ""}, ${school.state || ""}` : "School Address"}
          </p>
        </div>
        <Badge className="bg-[hsl(45,93%,47%)] text-[hsl(0,0%,10%)] text-[7px] px-1.5 py-0 font-bold border-0 flex-shrink-0">
          STUDENT
        </Badge>
      </div>

      {/* Body */}
      <div className="flex px-4 pt-2 pb-1 gap-3">
        {/* Photo placeholder */}
        <div className="flex-shrink-0">
          <div className="w-[70px] h-[80px] rounded-lg border-2 border-[hsl(168,84%,24%)]/30 bg-muted flex items-center justify-center overflow-hidden">
            <Users className="w-8 h-8 text-muted-foreground/50" />
          </div>
        </div>

        {/* Student details */}
        <div className="flex-1 min-w-0 space-y-[3px]">
          <div>
            <p className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">
              Student Name
            </p>
            <p className="text-[11px] font-bold text-foreground leading-tight truncate">
              {student.guardian_name || "Student Name"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <p className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">
                Reg. No.
              </p>
              <p className="text-[10px] font-semibold text-foreground leading-tight">
                {student.registration_number || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">
                Class
              </p>
              <p className="text-[10px] font-semibold text-foreground leading-tight truncate">
                {student.classes?.name || "N/A"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <p className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">
                Gender
              </p>
              <p className="text-[10px] font-semibold text-foreground leading-tight capitalize">
                {student.gender || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">
                Session
              </p>
              <p className="text-[10px] font-semibold text-foreground leading-tight">
                {sessionYear}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-1 bg-muted/80 border-t border-border">
        <Barcode
          value={student.registration_number || student.id?.slice(0, 12) || "000000"}
          width={1.2}
          height={28}
          fontSize={8}
          margin={0}
          displayValue={false}
          background="transparent"
        />
        <div className="text-right">
          <p className="text-[7px] text-muted-foreground font-medium">
            Powered by SmartSchool
          </p>
        </div>
      </div>
    </div>
  );
};

const StudentIDCards = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { schoolId } = useAuth();

  const { data: students, isLoading: studentsLoading } = useAllStudents();
  const { data: classes } = useTeacherClasses();

  const { data: school } = useQuery({
    queryKey: ["school-info", schoolId],
    queryFn: async () => {
      if (!schoolId) return null;
      const { data, error } = await supabase
        .from("schools")
        .select("name, logo_url, address, city, state, phone, email")
        .eq("id", schoolId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });

  const filteredStudents =
    selectedClass === "all"
      ? students
      : students?.filter((s: any) => s.class_id === selectedClass);

  const currentStudent = selectedStudent
    ? filteredStudents?.find((s: any) => s.id === selectedStudent)
    : filteredStudents?.[0];

  const currentIndex = filteredStudents?.findIndex(
    (s: any) => s.id === (currentStudent?.id || "")
  ) ?? 0;

  const currentYear = new Date().getFullYear();
  const sessionYear = `${currentYear}/${currentYear + 1}`;

  const goToStudent = (direction: "prev" | "next") => {
    if (!filteredStudents?.length) return;
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % filteredStudents.length
        : (currentIndex - 1 + filteredStudents.length) % filteredStudents.length;
    setSelectedStudent(filteredStudents[newIndex].id);
  };

  const getCardData = (student: any) => ({
    studentName: student.guardian_name || "Student",
    registrationNumber: student.registration_number || "N/A",
    className: student.classes?.name || "N/A",
    gender: student.gender || "N/A",
    session: sessionYear,
    schoolName: school?.name || "School",
    schoolAddress: [school?.address, school?.city, school?.state].filter(Boolean).join(", "),
    schoolLogoUrl: school?.logo_url || undefined,
  });

  const handleDownloadPDF = () => {
    if (!currentStudent) return;
    generateIDCardPDF(getCardData(currentStudent));
  };

  const handleDownloadAllPDF = () => {
    if (!filteredStudents?.length) return;
    const allData = filteredStudents.map((s: any) => getCardData(s));
    generateBulkIDCardsPDF(allData);
  };

  const printCard = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !cardRef.current) return;

    const cardHtml = cardRef.current.outerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card</title>
          ${styles}
          <style>
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: white; }
            @media print {
              body { background: white; }
              @page { size: 3.6in 2.28in; margin: 0; }
            }
          </style>
        </head>
        <body>${cardHtml}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <IdCard className="w-6 h-6 text-primary" />
              Student ID Cards
            </h1>
            <p className="text-muted-foreground">
              Generate and download professional ID cards as PDF
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={printCard} disabled={!currentStudent}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!currentStudent}>
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button size="sm" onClick={handleDownloadAllPDF} disabled={!filteredStudents?.length}>
              <Download className="w-4 h-4 mr-2" />
              Download All ({filteredStudents?.length || 0})
            </Button>
          </div>
        </div>

        {/* Class Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <span className="text-sm font-medium text-foreground">Filter by Class:</span>
              <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedStudent(null); }}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes?.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="ml-auto">
                {filteredStudents?.length || 0} student{(filteredStudents?.length || 0) !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {studentsLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        ) : !filteredStudents?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No Students Found</p>
              <p className="text-muted-foreground">Select a class or enroll students first</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Card Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Card Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToStudent("prev")}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                      {currentIndex + 1} / {filteredStudents?.length || 0}
                    </span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToStudent("next")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                {currentStudent && (
                  <div data-id-card>
                    <StudentIDCard
                      student={currentStudent}
                      school={school}
                      cardRef={cardRef}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredStudents?.map((student: any, idx: number) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        currentStudent?.id === student.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {student.guardian_name || "Unnamed Student"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.registration_number || "No Reg."} • {student.classes?.name || "N/A"}
                        </p>
                      </div>
                      {currentStudent?.id === student.id && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">
                          Selected
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentIDCards;
