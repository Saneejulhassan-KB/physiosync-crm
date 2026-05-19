import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { Appointment, AppointmentStatus } from "@/types";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  List,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type ViewMode = "list" | "calendar";

const STATUS_FILTER_OPTIONS: (AppointmentStatus | "all")[] = [
  "all",
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DOT_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "bg-primary",
  confirmed: "bg-emerald-500",
  in_progress: "bg-amber-500",
  completed: "bg-muted-foreground",
  cancelled: "bg-destructive",
  no_show: "bg-rose-400",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Appointments() {
  const { setBreadcrumb } = useUIStore();
  const [view, setView] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4); // May = index 4

  useEffect(() => {
    setBreadcrumb([{ label: "Appointments" }]);
  }, [setBreadcrumb]);

  const filtered = useMemo(() => {
    return MOCK_APPOINTMENTS.filter((a) => {
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchFrom = !dateFrom || a.date >= dateFrom;
      const matchTo = !dateTo || a.date <= dateTo;
      return matchStatus && matchFrom && matchTo;
    }).sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
  }, [statusFilter, dateFrom, dateTo]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of MOCK_APPOINTMENTS) {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    }
    return map;
  }, []);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  }

  const calDateStr = (day: number) => {
    const mm = String(calMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${calYear}-${mm}-${dd}`;
  };

  return (
    <div className="space-y-6" data-ocid="appointments.page">
      <PageHeader
        title="My Appointments"
        subtitle={`${MOCK_APPOINTMENTS.length} total appointments`}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setView("list")}
            data-ocid="appointments.list_view_toggle"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "list"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="w-4 h-4" /> List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            data-ocid="appointments.calendar_view_toggle"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "calendar"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <CalendarDays className="w-4 h-4" /> Calendar
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground shrink-0">
              From
            </Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-xs w-36"
              data-ocid="appointments.date_from_input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground shrink-0">To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-xs w-36"
              data-ocid="appointments.date_to_input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AppointmentStatus | "all")
            }
            data-ocid="appointments.status_filter"
            className="h-8 text-xs bg-background border border-input rounded-md px-2 text-foreground"
          >
            {STATUS_FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card rounded-xl overflow-hidden"
            data-ocid="appointments.list"
          >
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                {filtered.length} appointments
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Patient",
                      "Date & Time",
                      "Type",
                      "Duration",
                      "Status",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-muted-foreground"
                      >
                        No appointments match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((a, i) => (
                      <tr
                        key={a.id}
                        className="hover:bg-muted/30 transition-colors"
                        data-ocid={`appointments.item.${i + 1}`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {a.patientName}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {a.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-sm font-medium text-foreground">
                            {a.time}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {a.date}
                          </p>
                        </td>
                        <td className="px-5 py-3 max-w-[180px]">
                          <p className="text-sm text-foreground truncate">
                            {a.type}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {a.duration}min
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelected(a)}
                            data-ocid={`appointments.view_button.${i + 1}`}
                            className="h-7 text-xs"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CALENDAR VIEW */}
        {view === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card rounded-xl overflow-hidden"
            data-ocid="appointments.calendar"
          >
            {/* Calendar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button
                type="button"
                onClick={prevMonth}
                data-ocid="appointments.cal_prev"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-semibold text-foreground">
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <button
                type="button"
                onClick={nextMonth}
                data-ocid="appointments.cal_next"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 border-b border-border">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }, (_, i) => i).map((idx) => (
                <div
                  key={`spacer-${idx}`}
                  className="min-h-[80px] border-b border-r border-border/50 bg-muted/20"
                />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = calDateStr(day);
                const dayAppts = appointmentsByDate[dateStr] ?? [];
                const isToday = dateStr === "2026-05-19";
                return (
                  <div
                    key={day}
                    className={cn(
                      "min-h-[80px] p-2 border-b border-r border-border/50 hover:bg-muted/20 transition-colors",
                      isToday && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayAppts.slice(0, 3).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setSelected(a)}
                          data-ocid={`appointments.cal_event.${a.id}`}
                          className="flex items-center gap-1 w-full text-left hover:opacity-80"
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              DOT_COLORS[a.status],
                            )}
                          />
                          <span className="text-[10px] text-foreground truncate">
                            {a.patientName.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                      {dayAppts.length > 3 && (
                        <p className="text-[10px] text-muted-foreground">
                          +{dayAppts.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment detail modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-md" data-ocid="appointments.dialog">
          <DialogHeader>
            <DialogTitle className="text-base">Appointment Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selected.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selected.department}
                  </p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Date
                  </p>
                  <p className="font-medium text-foreground">{selected.date}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Time
                  </p>
                  <p className="font-medium text-foreground">{selected.time}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="font-medium text-foreground">
                    {selected.duration} min
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Token
                  </p>
                  <p className="font-medium text-foreground">
                    {selected.tokenNumber ? `#${selected.tokenNumber}` : "N/A"}
                  </p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Type
                  </p>
                  <p className="font-medium text-foreground">{selected.type}</p>
                </div>
                {selected.notes && (
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                      Notes
                    </p>
                    <p className="text-sm text-foreground">{selected.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  data-ocid="appointments.mark_complete_button"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  data-ocid="appointments.add_notes_button"
                >
                  <FileText className="w-3.5 h-3.5" /> Add Notes
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelected(null)}
                  data-ocid="appointments.close_button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
