import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  trend?: number; // positive = up, negative = down, 0 = neutral
  trendLabel?: string;
  className?: string;
  iconClassName?: string;
  "data-ocid"?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  trendLabel,
  className,
  iconClassName,
  "data-ocid": ocid,
}: StatCardProps) {
  const isUp = trend !== undefined && trend > 0;
  const isDown = trend !== undefined && trend < 0;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      data-ocid={ocid}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border border-border p-5 shadow-elevation-subtle",
        className,
      )}
    >
      {/* Subtle gradient orb */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold font-display text-foreground tracking-tight">
            {value}
          </p>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                isUp && "text-emerald-600 dark:text-emerald-400",
                isDown && "text-destructive",
                !isUp && !isDown && "text-muted-foreground",
              )}
            >
              {isUp && <TrendingUp className="w-3.5 h-3.5" />}
              {isDown && <TrendingDown className="w-3.5 h-3.5" />}
              {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
              <span>
                {isUp ? "+" : ""}
                {trend}%
              </span>
              {trendLabel && (
                <span className="text-muted-foreground font-normal">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            iconClassName ?? "bg-primary/10",
          )}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}
