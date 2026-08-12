import Barcode from "react-barcode";
import { Users } from "lucide-react";

export type IDCardDesign = "emerald" | "midnight" | "minimal";

export const ID_CARD_DESIGNS: { id: IDCardDesign; label: string; description: string }[] = [
  { id: "emerald", label: "Emerald Prestige", description: "Embossed emerald crest with gold foil rules" },
  { id: "midnight", label: "Midnight Gold", description: "Executive dark card with metallic gold depth" },
  { id: "minimal", label: "Ivory Platinum", description: "Soft ivory card with sculpted hairline detail" },
];

export interface CardStudent {
  id?: string;
  studentName: string;
  registration_number?: string | null;
  className?: string | null;
  gender?: string | null;
  photoUrl?: string | null;
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
      shell: "border-[hsl(160,84%,16%)]/40",
      shellStyle: {
        background:
          "linear-gradient(150deg, #ffffff 0%, #f7f6f0 46%, #ece9dc 100%)",
        boxShadow:
          "0 18px 34px -14px rgba(6,78,59,0.55), 0 4px 10px -2px rgba(6,78,59,0.25), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 6px rgba(6,78,59,0.10)",
      } as React.CSSProperties,
      headerStyle: {
        background:
          "linear-gradient(135deg, #043528 0%, #064e3b 45%, #0d7a5f 100%)",
        boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
      } as React.CSSProperties,
      headerTitle: "text-[hsl(45,60%,94%)]",
      headerSub: "text-[hsl(45,55%,76%)]",
      label: "text-[hsl(160,10%,40%)]",
      value: "text-[hsl(160,40%,12%)]",
      rule: "bg-gradient-to-r from-[#a8862f] via-[#e6cd7a] to-[#a8862f]",
      footer: "border-t border-[hsl(160,84%,16%)]/15",
      footerStyle: {
        background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(236,233,220,0.95))",
      } as React.CSSProperties,
      footerText: "text-[hsl(160,50%,20%)]",
      photo: "border-[hsl(160,84%,16%)]/35",
      photoStyle: {
        background: "linear-gradient(160deg, #ffffff, #e8e5d8)",
        boxShadow:
          "0 6px 12px -4px rgba(6,78,59,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
      } as React.CSSProperties,
      badge: "text-[hsl(160,45%,12%)]",
      badgeStyle: {
        background: "linear-gradient(135deg, #f0dd9b 0%, #c9a84c 55%, #9c7c2c 100%)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)",
      } as React.CSSProperties,
      lineColor: "#14322a",
    },
    midnight: {
      shell: "border-[hsl(43,52%,52%)]/45",
      shellStyle: {
        background:
          "linear-gradient(150deg, #131a2b 0%, #0d1322 48%, #1b2338 100%)",
        boxShadow:
          "0 20px 38px -16px rgba(0,0,0,0.8), 0 4px 10px -2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(230,217,168,0.22), inset 0 -3px 8px rgba(0,0,0,0.55)",
      } as React.CSSProperties,
      headerStyle: {
        background: "linear-gradient(135deg, #060a14 0%, #101a2e 55%, #0a1120 100%)",
        boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(230,217,168,0.18)",
      } as React.CSSProperties,
      headerTitle: "text-[hsl(45,60%,94%)]",
      headerSub: "text-[hsl(43,52%,66%)]",
      label: "text-[hsl(215,20%,68%)]",
      value: "text-[hsl(45,60%,96%)]",
      rule: "bg-gradient-to-r from-[#8d6f26] via-[#f0dd9b] to-[#8d6f26]",
      footer: "border-t border-[hsl(43,52%,52%)]/25",
      footerStyle: {
        background: "linear-gradient(180deg, rgba(10,17,32,0.6), rgba(6,10,20,0.95))",
      } as React.CSSProperties,
      footerText: "text-[hsl(43,52%,66%)]",
      photo: "border-[hsl(43,52%,52%)]/50",
      photoStyle: {
        background: "linear-gradient(160deg, #263149, #141c2e)",
        boxShadow:
          "0 6px 14px -4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(240,221,155,0.28)",
      } as React.CSSProperties,
      badge: "text-[hsl(222,47%,11%)]",
      badgeStyle: {
        background: "linear-gradient(135deg, #f7ecc0 0%, #c9a84c 55%, #8d6f26 100%)",
        boxShadow: "0 2px 5px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55)",
      } as React.CSSProperties,
      lineColor: "#e6d9a8",
    },
    minimal: {
      shell: "border-[hsl(40,15%,80%)]",
      shellStyle: {
        background: "linear-gradient(150deg, #fefdf8 0%, #f6f3e8 60%, #ebe7d8 100%)",
        boxShadow:
          "0 16px 30px -14px rgba(60,60,50,0.35), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 6px rgba(120,115,95,0.12)",
      } as React.CSSProperties,
      headerStyle: { background: "transparent" } as React.CSSProperties,
      headerTitle: "text-[hsl(160,60%,16%)]",
      headerSub: "text-[hsl(40,10%,45%)]",
      label: "text-[hsl(40,10%,50%)]",
      value: "text-[hsl(160,45%,14%)]",
      rule: "bg-gradient-to-r from-[#064e3b] via-[#0d7a5f] to-[#064e3b]",
      footer: "border-t border-[hsl(40,15%,82%)]",
      footerStyle: { background: "transparent" } as React.CSSProperties,
      footerText: "text-[hsl(160,45%,22%)]",
      photo: "border-[hsl(40,15%,78%)]",
      photoStyle: {
        background: "linear-gradient(160deg, #ffffff, #f0ede2)",
        boxShadow: "0 5px 12px -4px rgba(60,60,50,0.35), inset 0 1px 0 #fff",
      } as React.CSSProperties,
      badge: "text-[hsl(45,45%,97%)]",
      badgeStyle: {
        background: "linear-gradient(135deg, #0d7a5f 0%, #064e3b 100%)",
        boxShadow: "0 2px 4px rgba(6,78,59,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
      } as React.CSSProperties,
      lineColor: "#14322a",
    },
  }[design];

  return (
    <div
      ref={cardRef}
      className={`w-[360px] h-[228px] rounded-xl overflow-hidden border relative ${palette.shell}`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", ...palette.shellStyle }}
    >
      {/* Gloss sheen for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0) 46%)",
        }}
      />

      <div className={`h-[5px] w-full ${palette.rule}`} />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-2.5 pb-2 relative" style={palette.headerStyle}>
        {school?.logo_url ? (
          <img
            src={school.logo_url}
            alt={`${school?.name || "School"} logo`}
            className="w-9 h-9 rounded-sm object-cover flex-shrink-0"
            style={{ boxShadow: "0 3px 6px rgba(0,0,0,0.35)" }}
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${palette.badge}`}
            style={palette.badgeStyle}
          >
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
        <span
          className={`text-[7px] px-2 py-[3px] rounded-sm font-bold tracking-[0.16em] ${palette.badge}`}
          style={palette.badgeStyle}
        >
          STUDENT ID
        </span>
      </div>

      <div className={`h-[2px] w-full ${palette.rule} opacity-90`} />

      {/* Body */}
      <div className="flex px-4 pt-3 gap-3.5 relative">
        <div
          className={`w-[70px] h-[84px] rounded-md border-2 flex items-center justify-center overflow-hidden flex-shrink-0 ${palette.photo}`}
          style={palette.photoStyle}
        >
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={`${student.studentName} passport photograph`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className={`w-8 h-8 opacity-40 ${palette.label}`} />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p className={`text-[6.5px] uppercase tracking-[0.2em] font-semibold ${palette.label}`}>
              Student Name
            </p>
            <p className={`text-[13px] font-extrabold leading-snug truncate ${palette.value}`}>
              {student.studentName || "Student Name"}
            </p>
            <div className={`h-[1.5px] w-full mt-1 ${palette.rule} opacity-80`} />
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
      <div
        className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-1 ${palette.footer}`}
        style={palette.footerStyle}
      >
        <Barcode
          value={barcodeValue}
          width={1.1}
          height={26}
          fontSize={8}
          margin={0}
          displayValue={false}
          background="transparent"
          lineColor={palette.lineColor}
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
