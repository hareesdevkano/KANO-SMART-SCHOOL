import Barcode from "react-barcode";
import { Users } from "lucide-react";

export type IDCardDesign = "emerald" | "midnight" | "minimal";

export const ID_CARD_DESIGNS: { id: IDCardDesign; label: string; description: string }[] = [
  { id: "emerald", label: "Emerald Prestige", description: "Deep emerald header with gold rules" },
  { id: "midnight", label: "Midnight Gold", description: "Dark executive card with gold accents" },
  { id: "minimal", label: "Ivory Minimal", description: "Clean cream card with hairline detail" },
];

export interface CardStudent {
  id?: string;
  studentName: string;
  registration_number?: string | null;
  className?: string | null;
  gender?: string | null;
}

export interface CardSchool {
  name?: string | null;
  logo_url?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
}

interface Props {
  design: IDCardDesign;
  student: CardStudent;
  school?: CardSchool | null;
  session: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const Field = ({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  labelClass: string;
  valueClass: string;
}) => (
  <div className="min-w-0">
    <p className={`text-[6.5px] uppercase tracking-[0.18em] font-semibold ${labelClass}`}>{label}</p>
    <p className={`text-[10px] font-bold leading-tight truncate ${valueClass}`}>{value || "N/A"}</p>
  </div>
);

const StudentIDCardPreview = ({ design, student, school, session, cardRef }: Props) => {
  const address = [school?.address, school?.city, school?.state].filter(Boolean).join(", ");
  const barcodeValue = student.registration_number || student.id?.slice(0, 12) || "000000";

  const palette = {
    emerald: {
      shell: "bg-white border-[hsl(160,84%,16%)]/30",
      header: "bg-[hsl(160,84%,16%)]",
      headerTitle: "text-[hsl(45,60%,94%)]",
      headerSub: "text-[hsl(45,55%,72%)]",
      label: "text-muted-foreground",
      value: "text-[hsl(160,40%,12%)]",
      rule: "bg-[hsl(43,52%,52%)]",
      footer: "bg-[hsl(45,30%,96%)] border-t border-[hsl(160,84%,16%)]/15",
      footerText: "text-[hsl(160,50%,20%)]",
      photo: "border-[hsl(160,84%,16%)]/30 bg-[hsl(45,20%,95%)]",
      badge: "bg-[hsl(43,52%,52%)] text-[hsl(160,45%,12%)]",
      barcodeBg: "transparent",
    },
    midnight: {
      shell: "bg-[hsl(222,47%,11%)] border-[hsl(43,52%,52%)]/40",
      header: "bg-[hsl(222,55%,8%)]",
      headerTitle: "text-[hsl(45,60%,94%)]",
      headerSub: "text-[hsl(43,52%,62%)]",
      label: "text-[hsl(215,20%,65%)]",
      value: "text-[hsl(45,60%,96%)]",
      rule: "bg-[hsl(43,52%,52%)]",
      footer: "bg-[hsl(222,55%,9%)] border-t border-[hsl(43,52%,52%)]/25",
      footerText: "text-[hsl(43,52%,62%)]",
      photo: "border-[hsl(43,52%,52%)]/40 bg-[hsl(217,33%,17%)]",
      badge: "bg-[hsl(43,52%,52%)] text-[hsl(222,47%,11%)]",
      barcodeBg: "transparent",
    },
    minimal: {
      shell: "bg-[hsl(45,45%,97%)] border-[hsl(40,15%,80%)]",
      header: "bg-transparent",
      headerTitle: "text-[hsl(160,60%,16%)]",
      headerSub: "text-[hsl(40,10%,45%)]",
      label: "text-[hsl(40,10%,50%)]",
      value: "text-[hsl(160,45%,14%)]",
      rule: "bg-[hsl(160,60%,20%)]",
      footer: "bg-transparent border-t border-[hsl(40,15%,82%)]",
      footerText: "text-[hsl(160,45%,22%)]",
      photo: "border-[hsl(40,15%,78%)] bg-white",
      badge: "bg-[hsl(160,60%,16%)] text-[hsl(45,45%,97%)]",
      barcodeBg: "transparent",
    },
  }[design];

  return (
    <div
      ref={cardRef}
      className={`w-[360px] h-[228px] rounded-xl overflow-hidden shadow-xl border relative ${palette.shell}`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {design === "minimal" ? (
        <div className={`h-[5px] w-full ${palette.rule}`} />
      ) : (
        <div className="h-[6px] w-full bg-gradient-to-r from-[hsl(160,84%,16%)] via-[hsl(160,60%,30%)] to-[hsl(43,52%,52%)]" />
      )}

      {/* Header */}
      <div className={`flex items-center gap-2.5 px-4 pt-2.5 pb-2 ${palette.header}`}>
        {school?.logo_url ? (
          <img
            src={school.logo_url}
            alt={`${school?.name || "School"} logo`}
            className="w-9 h-9 rounded-sm object-cover flex-shrink-0"
          />
        ) : (
          <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${palette.badge}`}>
            <span className="font-bold text-sm">{school?.name?.charAt(0) || "S"}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-[11px] leading-tight truncate ${palette.headerTitle}`}>
            {school?.name || "School Name"}
          </p>
          <p className={`text-[8px] leading-tight truncate ${palette.headerSub}`}>
            {address || "School Address"}
          </p>
        </div>
        <span className={`text-[7px] px-2 py-[3px] rounded-sm font-bold tracking-[0.16em] ${palette.badge}`}>
          STUDENT ID
        </span>
      </div>

      {design !== "minimal" && <div className={`h-[2px] w-full ${palette.rule}`} />}

      {/* Body */}
      <div className="flex px-4 pt-3 gap-3.5">
        <div className={`w-[70px] h-[84px] rounded-md border-2 flex items-center justify-center overflow-hidden flex-shrink-0 ${palette.photo}`}>
          <Users className={`w-8 h-8 opacity-40 ${palette.label}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p className={`text-[6.5px] uppercase tracking-[0.2em] font-semibold ${palette.label}`}>
              Student Name
            </p>
            <p className={`text-[13px] font-extrabold leading-snug truncate ${palette.value}`}>
              {student.studentName || "Student Name"}
            </p>
            <div className={`h-[1.5px] w-full mt-1 ${palette.rule} opacity-70`} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Field label="Reg. No." value={student.registration_number || ""} labelClass={palette.label} valueClass={palette.value} />
            <Field label="Class" value={student.className || ""} labelClass={palette.label} valueClass={palette.value} />
            <Field label="Gender" value={student.gender || ""} labelClass={palette.label} valueClass={`${palette.value} capitalize`} />
            <Field label="Session" value={session} labelClass={palette.label} valueClass={palette.value} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-1 ${palette.footer}`}>
        <Barcode
          value={barcodeValue}
          width={1.1}
          height={26}
          fontSize={8}
          margin={0}
          displayValue={false}
          background={palette.barcodeBg}
          lineColor={design === "midnight" ? "#e6d9a8" : "#14322a"}
        />
        <p className={`text-[6.5px] font-semibold text-right leading-tight ${palette.footerText}`}>
          Powered by Dual Intelligence
          <br />
          ICT Services Kano
        </p>
      </div>
    </div>
  );
};

export default StudentIDCardPreview;
