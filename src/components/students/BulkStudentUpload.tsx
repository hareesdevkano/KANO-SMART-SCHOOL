import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export interface BulkUploadClass {
  id: string;
  name: string;
}

interface ParsedRow {
  full_name: string;
  registration_number: string;
  class_name: string;
  gender: string;
  date_of_birth: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  address: string;
  error?: string;
}

const HEADERS = [
  "full_name",
  "registration_number",
  "class_name",
  "gender",
  "date_of_birth",
  "guardian_name",
  "guardian_phone",
  "guardian_email",
  "address",
];

const TEMPLATE = `${HEADERS.join(",")}\nAisha Bello,STU-2026-001,JSS 1A,female,2013-05-14,Musa Bello,08012345678,musa@example.com,12 Kano Road\nIbrahim Sani,STU-2026-002,JSS 1A,male,2012-11-02,Sani Aliyu,08087654321,sani@example.com,4 Zoo Road\n`;

const splitCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
};

const normalizeDate = (value: string): string => {
  if (!value) return "";
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (iso.test(value)) return value;
  const parts = value.split(/[/.-]/);
  if (parts.length === 3) {
    const [d, m, y] = parts;
    if (y?.length === 4) {
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }
  return "";
};

interface Props {
  classes?: BulkUploadClass[];
  invalidateKeys?: string[];
}

const BulkStudentUpload = ({ classes = [], invalidateKeys = [] }: Props) => {
  const { schoolId } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [fallbackClass, setFallbackClass] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resolveClassId = (name: string) => {
    if (!name) return fallbackClass || null;
    const match = classes.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, "") === name.toLowerCase().replace(/\s+/g, "")
    );
    return match?.id ?? (fallbackClass || null);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-bulk-upload-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error("The file has no data rows");
      setRows([]);
      return;
    }
    const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
    const index = (key: string) => header.indexOf(key);

    const parsed: ParsedRow[] = lines.slice(1).map((line) => {
      const cells = splitCsvLine(line);
      const get = (key: string) => {
        const i = index(key);
        return i >= 0 ? (cells[i] ?? "").replace(/^"|"$/g, "") : "";
      };
      const row: ParsedRow = {
        full_name: get("full_name") || get("name") || get("student_name"),
        registration_number: get("registration_number") || get("reg_number"),
        class_name: get("class_name") || get("class"),
        gender: get("gender").toLowerCase(),
        date_of_birth: normalizeDate(get("date_of_birth") || get("dob")),
        guardian_name: get("guardian_name"),
        guardian_phone: get("guardian_phone"),
        guardian_email: get("guardian_email"),
        address: get("address"),
      };
      if (!row.full_name) row.error = "Missing student name";
      else if (!row.registration_number) row.error = "Missing registration number";
      return row;
    });

    setRows(parsed);
    toast.success(`${parsed.length} rows loaded from ${file.name}`);
  };

  const validRows = rows.filter((r) => !r.error);

  const handleImport = async () => {
    if (!schoolId) {
      toast.error("No school linked to your account");
      return;
    }
    const missingClass = validRows.filter((r) => !resolveClassId(r.class_name));
    if (missingClass.length > 0) {
      toast.error("Some rows have no matching class. Pick a default class first.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = validRows.map((r) => ({
        school_id: schoolId,
        full_name: r.full_name,
        registration_number: r.registration_number,
        class_id: resolveClassId(r.class_name),
        gender: r.gender || null,
        date_of_birth: r.date_of_birth || null,
        guardian_name: r.guardian_name || null,
        guardian_phone: r.guardian_phone || null,
        guardian_email: r.guardian_email || null,
        address: r.address || null,
      }));

      const { error, data } = await supabase.from("students").insert(payload).select("id");
      if (error) throw error;

      toast.success(`${data?.length ?? payload.length} students imported successfully`);
      ["school-students", "all-students", "class-students", "school-stats", "teacher-stats", ...invalidateKeys].forEach(
        (key) => queryClient.invalidateQueries({ queryKey: [key] })
      );
      setRows([]);
      setFileName("");
      setOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Import failed";
      toast.error(`Bulk import failed: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Students</DialogTitle>
          <DialogDescription>
            Upload a CSV file with student names and details. Download the template to see the
            expected columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <label className="inline-flex">
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                  e.target.value = "";
                }}
              />
              <Button asChild variant="outline">
                <span className="cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  {fileName || "Choose CSV File"}
                </span>
              </Button>
            </label>
          </div>

          {classes.length > 0 && (
            <div className="grid gap-2 max-w-xs">
              <Label>Default class (used when class column is blank or unmatched)</Label>
              <Select value={fallbackClass} onValueChange={setFallbackClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {rows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{validRows.length} valid</Badge>
                {rows.length - validRows.length > 0 && (
                  <Badge variant="destructive">{rows.length - validRows.length} with issues</Badge>
                )}
              </div>
              <div className="max-h-72 overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Reg. No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.full_name || "-"}</TableCell>
                        <TableCell>{row.registration_number || "-"}</TableCell>
                        <TableCell>{row.class_name || "-"}</TableCell>
                        <TableCell>{row.guardian_name || "-"}</TableCell>
                        <TableCell>
                          {row.error ? (
                            <span className="inline-flex items-center gap-1 text-destructive text-xs">
                              <AlertCircle className="w-3 h-3" />
                              {row.error}
                            </span>
                          ) : (
                            <Badge variant="outline">Ready</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isSaving || validRows.length === 0}>
            {isSaving ? "Importing..." : `Import ${validRows.length} Students`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkStudentUpload;
