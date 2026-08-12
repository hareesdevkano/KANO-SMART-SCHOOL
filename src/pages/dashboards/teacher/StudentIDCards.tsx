import { useEffect, useState, useRef } from "react";
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
import { generateIDCardPDF, generateBulkIDCardsPDF } from "@/utils/generateIDCardPDF";
import StudentIDCardPreview, { ID_CARD_DESIGNS, type IDCardDesign } from "@/components/students/IDCardDesigns";
import { getStudentPhotoUrls, imageUrlToDataUrl } from "@/utils/studentPhoto";


const StudentIDCards = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [design, setDesign] = useState<IDCardDesign>("emerald");
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

  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    if (!students?.length) return;
    getStudentPhotoUrls(students as any).then((map) => {
      if (active) setPhotoUrls(map);
    });
    return () => {
      active = false;
    };
  }, [students]);


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

  const studentDisplayName = (student: any) =>
    student?.full_name ||
    student?.profiles?.full_name ||
    student?.registration_number ||
    "Unnamed Student";

  const getCardData = (student: any) => ({
    design,
    studentName: studentDisplayName(student),
    registrationNumber: student.registration_number || "N/A",
    className: student.classes?.name || "N/A",
    gender: student.gender || "N/A",
    session: sessionYear,
    schoolName: school?.name || "School",
    schoolAddress: [school?.address, school?.city, school?.state].filter(Boolean).join(", "),
    schoolLogoUrl: school?.logo_url || undefined,
  });

  const withPhoto = async (student: any) => {
    const url = photoUrls[student.id];
    const dataUrl = url ? await imageUrlToDataUrl(url) : null;
    return { ...getCardData(student), photoUrl: dataUrl || undefined };
  };

  const handleDownloadPDF = async () => {
    if (!currentStudent) return;
    generateIDCardPDF(await withPhoto(currentStudent));
  };

  const handleDownloadAllPDF = async () => {
    if (!filteredStudents?.length) return;
    const allData = await Promise.all(filteredStudents.map((s: any) => withPhoto(s)));
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

        {/* Card Design Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Card Design</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {ID_CARD_DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDesign(d.id)}
                className={`text-left rounded-lg border p-3 transition-colors ${
                  design === d.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{d.label}</p>
                <p className="text-xs text-muted-foreground">{d.description}</p>
              </button>
            ))}
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
                    <StudentIDCardPreview
                      design={design}
                      student={{
                        id: currentStudent.id,
                        studentName: studentDisplayName(currentStudent),
                        registration_number: currentStudent.registration_number,
                        className: currentStudent.classes?.name,
                        gender: currentStudent.gender,
                        photoUrl: photoUrls[currentStudent.id],

                      }}
                      school={school}
                      session={sessionYear}
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
                          {studentDisplayName(student)}
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
