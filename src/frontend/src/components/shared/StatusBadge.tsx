import { cn } from "@/lib/utils";

type StatusVariant =
  | "active"
  | "inactive"
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending"
  | "urgent"
  | "critical"
  | "processing"
  | "paid"
  | "overdue"
  | "partial"
  | "discharged"
  | "on_leave";

const STATUS_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border border-border",
  },
  discharged: {
    label: "Discharged",
    className: "bg-muted text-muted-foreground border border-border",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-secondary/20 text-secondary-foreground border border-secondary/30",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
  no_show: {
    label: "No Show",
    className:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
  critical: {
    label: "Critical",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
  processing: {
    label: "Processing",
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
  partial: {
    label: "Partial",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  },
  on_leave: {
    label: "On Leave",
    className:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20",
  },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as StatusVariant] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
