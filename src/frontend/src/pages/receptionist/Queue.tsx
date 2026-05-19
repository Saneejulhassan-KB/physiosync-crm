import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPOINTMENTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { AppointmentStatus } from "@/types";
import {
  Activity,
  CheckCircle,
  Clock,
  LogIn,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type QueueEntry = {
  id: string;
  token: number;
  patientName: string;
  time: string;
  doctor: string;
  department: string;
  type: string;
  status: AppointmentStatus;
};

const STATUS_CONFIG = {
  scheduled: {
    label: "Waiting",
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    dot: "bg-primary",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-secondary/15",
    text: "text-secondary-foreground",
    border: "border-secondary/30",
    dot: "bg-secondary",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  no_show: {
    label: "No Show",
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
    dot: "bg-destructive",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    dot: "bg-muted-foreground",
  },
};

const ROW_BG: Record<string, string> = {
  scheduled: "border-l-amber-400",
  confirmed: "border-l-primary",
  in_progress: "border-l-secondary",
  completed: "border-l-emerald-500",
  no_show: "border-l-destructive",
  cancelled: "border-l-muted-foreground",
};

function initQueue(): QueueEntry[] {
  return MOCK_APPOINTMENTS.filter(
    (a) => a.date === "2026-05-19" && a.tokenNumber,
  )
    .sort((a, b) => (a.tokenNumber ?? 0) - (b.tokenNumber ?? 0))
    .map((a) => ({
      id: a.id,
      token: a.tokenNumber ?? 0,
      patientName: a.patientName,
      time: a.time,
      doctor: a.doctorName,
      department: a.department,
      type: a.type,
      status: a.status as AppointmentStatus,
    }));
}

export default function Queue() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Receptionist", href: "/receptionist" },
        { label: "Queue Management" },
      ]),
    [setBreadcrumb],
  );

  const [queue, setQueue] = useState<QueueEntry[]>(initQueue);

  const update = (id: string, status: AppointmentStatus) => {
    setQueue((q) => q.map((e) => (e.id === id ? { ...e, status } : e)));
    const entry = queue.find((e) => e.id === id);
    const labels: Record<string, string> = {
      in_progress: "checked in",
      completed: "completed",
      no_show: "marked as no-show",
    };
    toast.success(`${entry?.patientName} ${labels[status] ?? "updated"}`);
  };

  const stats = [
    {
      label: "Total Today",
      value: queue.length,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Waiting",
      value: queue.filter(
        (e) => e.status === "scheduled" || e.status === "confirmed",
      ).length,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "In Progress",
      value: queue.filter((e) => e.status === "in_progress").length,
      icon: Activity,
      color: "bg-secondary/20 text-secondary-foreground",
    },
    {
      label: "Completed",
      value: queue.filter((e) => e.status === "completed").length,
      icon: CheckCircle,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="queue.page">
      <PageHeader
        title="Queue Management"
        subtitle="Real-time patient flow for today"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQueue(initQueue())}
            data-ocid="queue.refresh_button"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
          </Button>
        }
      />

      {/* Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="queue.stats"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 shadow-elevation-subtle"
            data-ocid={`queue.stat.${i + 1}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  s.color.split(" ")[0],
                )}
              >
                <s.icon className={cn("w-5 h-5", s.color.split(" ")[1])} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold font-display text-foreground">
                  {s.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Queue table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl shadow-elevation-subtle overflow-hidden"
        data-ocid="queue.table"
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Today's Queue</h3>
            <p className="text-xs text-muted-foreground">
              May 19, 2026 — {queue.length} patients
            </p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Token",
                  "Patient",
                  "Time",
                  "Doctor",
                  "Dept",
                  "Type",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {queue.map((entry, i) => {
                const cfg =
                  STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG] ??
                  STATUS_CONFIG.cancelled;
                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "border-l-4 transition-colors hover:bg-muted/20",
                      ROW_BG[entry.status] ?? "border-l-border",
                    )}
                    data-ocid={`queue.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {entry.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">
                        {entry.patientName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-foreground">
                        {entry.time}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground truncate max-w-[140px]">
                        {entry.doctor}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {entry.department}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {entry.type}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                          cfg.bg,
                          cfg.text,
                          cfg.border,
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)}
                        />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(entry.status === "scheduled" ||
                          entry.status === "confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => update(entry.id, "in_progress")}
                            data-ocid={`queue.check_in_button.${i + 1}`}
                            className="h-7 text-xs"
                          >
                            <LogIn className="w-3.5 h-3.5 mr-1" />
                            Check In
                          </Button>
                        )}
                        {entry.status === "in_progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => update(entry.id, "completed")}
                            data-ocid={`queue.complete_button.${i + 1}`}
                            className="h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Complete
                          </Button>
                        )}
                        {(entry.status === "scheduled" ||
                          entry.status === "confirmed") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => update(entry.id, "no_show")}
                            data-ocid={`queue.no_show_button.${i + 1}`}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            No Show
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {queue.map((entry, i) => {
            const cfg =
              STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG] ??
              STATUS_CONFIG.cancelled;
            return (
              <div
                key={entry.id}
                className={cn(
                  "px-4 py-4 border-l-4",
                  ROW_BG[entry.status] ?? "border-l-border",
                )}
                data-ocid={`queue.mobile.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">
                        {entry.token}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {entry.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.time} · {entry.doctor}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                      cfg.bg,
                      cfg.text,
                      cfg.border,
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                  </span>
                </div>
                <div className="flex gap-2 ml-12">
                  {(entry.status === "scheduled" ||
                    entry.status === "confirmed") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update(entry.id, "in_progress")}
                      data-ocid={`queue.mobile_check_in_button.${i + 1}`}
                      className="h-7 text-xs"
                    >
                      <LogIn className="w-3.5 h-3.5 mr-1" />
                      Check In
                    </Button>
                  )}
                  {entry.status === "in_progress" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update(entry.id, "completed")}
                      data-ocid={`queue.mobile_complete_button.${i + 1}`}
                      className="h-7 text-xs text-emerald-600 border-emerald-500/30"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Complete
                    </Button>
                  )}
                  {(entry.status === "scheduled" ||
                    entry.status === "confirmed") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => update(entry.id, "no_show")}
                      data-ocid={`queue.mobile_no_show_button.${i + 1}`}
                      className="h-7 text-xs text-destructive"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      No Show
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
