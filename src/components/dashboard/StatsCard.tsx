import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatsCardProps) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const changeDots = {
    positive: "bg-success shadow-[0_0_8px_hsl(var(--success))]",
    negative: "bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]",
    neutral: "bg-muted-foreground",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[hsl(43_40%_60%/0.12)] bg-gradient-to-br from-[hsl(220_30%_12%/0.85)] to-[hsl(220_35%_9%/0.85)] backdrop-blur-xl p-6 transition-all duration-300 hover:border-[hsl(43_74%_55%/0.35)] hover:shadow-[0_20px_50px_-20px_hsl(43_74%_55%/0.25)] hover:-translate-y-0.5">
      {/* Top gold hairline accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[hsl(43_74%_55%/0.5)] to-transparent" />
      {/* Hover glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[hsl(43_74%_55%/0.08)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.18em] uppercase">
            {title}
          </p>
          <p className="font-display text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${changeDots[changeType]}`} />
              <p className={`text-xs font-medium ${changeColors[changeType]}`}>{change}</p>
            </div>
          )}
        </div>
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(43_74%_55%/0.18)] to-[hsl(43_74%_55%/0.04)] flex items-center justify-center ring-1 ring-inset ring-[hsl(43_74%_55%/0.25)]">
          <Icon className="w-5 h-5 text-[hsl(43_74%_60%)]" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
