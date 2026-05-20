import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_RECEPTION_QUEUE } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Pencil,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface ReceptionStaff {
  id: string;
  name: string;
  shift: string;
  status: "active" | "off_duty" | "on_leave";
  checkinsToday: number;
  appointmentsManaged: number;
  avgWaitTime: string;
  phone: string;
  joinDate: string;
}

const RECEPTION_STAFF: ReceptionStaff[] = [
  {
    id: "R001",
    name: "Nadia Al-Farsi",
    shift: "Morning (08:00–14:00)",
    status: "active",
    checkinsToday: 38,
    appointmentsManaged: 247,
    avgWaitTime: "8 min",
    phone: "+971 50 100 2001",
    joinDate: "2022-04-01",
  },
  {
    id: "R002",
    name: "Preethi Nair",
    shift: "Evening (14:00–20:00)",
    status: "active",
    checkinsToday: 22,
    appointmentsManaged: 198,
    avgWaitTime: "11 min",
    phone: "+971 55 200 3002",
    joinDate: "2023-02-15",
  },
  {
    id: "R003",
    name: "Khalid Al-Hammadi",
    shift: "Morning (08:00–14:00)",
    status: "on_leave",
    checkinsToday: 0,
    appointmentsManaged: 312,
    avgWaitTime: "9 min",
    phone: "+971 52 300 4003",
    joinDate: "2021-09-10",
  },
];

interface QueueStat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const QUEUE_STATS: QueueStat[] = [
  { label: "In Queue Now", value: 14, icon: Clock, color: "text-primary" },
  {
    label: "Checked In Today",
    value: 60,
    icon: UserCheck,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Appointments Today",
    value: 78,
    icon: Calendar,
    color: "text-secondary",
  },
  {
    label: "No-shows Today",
    value: 5,
    icon: XCircle,
    color: "text-destructive",
  },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  active: {
    label: "On Duty",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  off_duty: {
    label: "Off Duty",
    className: "bg-muted text-muted-foreground border border-border",
  },
  on_leave: {
    label: "On Leave",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  },
};

export default function AdminReception() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      RECEPTION_STAFF.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reception Management"
        subtitle="Monitor front-desk staff performance and daily queue metrics"
      />

      {/* Queue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUEUE_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                {s.label}
              </span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold font-display text-foreground">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Live queue visual */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">
            Live Queue – Counter View
          </p>
          <Badge variant="outline" className="text-xs gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {["Now", "#43", "#44", "#45", "#46", "#47", "#48", "#49"].map(
            (token, i) => (
              <div
                key={token}
                className={`rounded-xl p-3 text-center border ${
                  i === 0
                    ? "bg-primary border-primary/40 text-primary-foreground"
                    : i < 3
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                      : "bg-muted/60 border-border text-muted-foreground"
                }`}
                data-ocid={`admin.reception.queue_token.${i + 1}`}
              >
                <p className="text-xs font-medium">
                  {i === 0 ? "Now" : `#${i + 42}`}
                </p>
                <p className="text-lg font-bold font-display">
                  {i === 0 ? "#42" : `~${(i + 1) * 9} m`}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Queue table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="font-semibold text-sm text-foreground">
            Today's Queue Detail
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Token
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECEPTION_QUEUE.map((entry) => (
                <tr
                  key={entry.tokenNumber}
                  className="border-b border-border/60 hover:bg-muted/20"
                >
                  <td className="px-4 py-3 font-mono text-sm font-bold text-primary">
                    #{entry.tokenNumber}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {entry.patientName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.appointmentTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        entry.status === "waiting"
                          ? "bg-amber-100 text-amber-700"
                          : entry.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700",
                      )}
                    >
                      {entry.status === "in_progress"
                        ? "In Progress"
                        : entry.status.charAt(0).toUpperCase() +
                          entry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.doctor}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="px-2 py-1 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Mark Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-3">
          <p className="font-semibold text-sm text-foreground">
            Receptionist Staff
          </p>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search staff…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="admin.reception.search_input"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Check-ins Today</TableHead>
              <TableHead className="text-right">Appts Managed</TableHead>
              <TableHead className="text-right">Avg Wait</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                data-ocid={`admin.reception.staff.item.${i + 1}`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {s.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  {s.shift}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[s.status].className}`}
                  >
                    {STATUS_MAP[s.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {s.checkinsToday}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {s.appointmentsManaged}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {s.avgWaitTime}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    data-ocid={`admin.reception.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
