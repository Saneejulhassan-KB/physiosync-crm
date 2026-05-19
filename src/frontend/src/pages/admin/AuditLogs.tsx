import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import {
  AlertCircle,
  AlertTriangle,
  Download,
  Filter,
  Info,
  Search,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type Severity = "info" | "warning" | "error";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  severity: Severity;
  details: string;
}

const USERS = [
  { name: "Dr. Sarah Mitchell", role: "Super Admin" },
  { name: "Dr. James Reeves", role: "Doctor" },
  { name: "Dr. Priya Sharma", role: "Doctor" },
  { name: "Dr. Michael Chen", role: "Doctor" },
  { name: "Emily Torres", role: "Receptionist" },
  { name: "Ryan Patel", role: "Lab Tech" },
  { name: "Maria Santos", role: "Pharmacist" },
  { name: "Chloe Bennett", role: "Billing" },
];

const ACTIONS = [
  {
    action: "LOGIN",
    resource: "Auth",
    severity: "info" as Severity,
    details: "User logged in successfully",
  },
  {
    action: "LOGOUT",
    resource: "Auth",
    severity: "info" as Severity,
    details: "User session ended",
  },
  {
    action: "LOGIN_FAILED",
    resource: "Auth",
    severity: "warning" as Severity,
    details: "Invalid credentials provided",
  },
  {
    action: "VIEW_PATIENT_RECORD",
    resource: "Patient",
    severity: "info" as Severity,
    details: "Accessed patient medical record",
  },
  {
    action: "UPDATE_PATIENT_RECORD",
    resource: "Patient",
    severity: "info" as Severity,
    details: "Modified patient demographic information",
  },
  {
    action: "CREATE_PRESCRIPTION",
    resource: "Prescription",
    severity: "info" as Severity,
    details: "New prescription created and signed",
  },
  {
    action: "MODIFY_PRESCRIPTION",
    resource: "Prescription",
    severity: "warning" as Severity,
    details: "Existing prescription dosage modified",
  },
  {
    action: "DELETE_PRESCRIPTION",
    resource: "Prescription",
    severity: "warning" as Severity,
    details: "Prescription marked as discontinued",
  },
  {
    action: "UPLOAD_LAB_REPORT",
    resource: "Lab Report",
    severity: "info" as Severity,
    details: "PDF lab report uploaded to patient record",
  },
  {
    action: "VIEW_LAB_REPORT",
    resource: "Lab Report",
    severity: "info" as Severity,
    details: "Lab report accessed and downloaded",
  },
  {
    action: "MARK_CRITICAL_RESULT",
    resource: "Lab Report",
    severity: "warning" as Severity,
    details: "Test result flagged as critical",
  },
  {
    action: "BOOK_APPOINTMENT",
    resource: "Appointment",
    severity: "info" as Severity,
    details: "New appointment slot reserved",
  },
  {
    action: "CANCEL_APPOINTMENT",
    resource: "Appointment",
    severity: "warning" as Severity,
    details: "Appointment cancelled with reason noted",
  },
  {
    action: "RESCHEDULE_APPOINTMENT",
    resource: "Appointment",
    severity: "info" as Severity,
    details: "Appointment moved to new time slot",
  },
  {
    action: "CREATE_INVOICE",
    resource: "Invoice",
    severity: "info" as Severity,
    details: "Invoice generated for patient services",
  },
  {
    action: "PROCESS_PAYMENT",
    resource: "Invoice",
    severity: "info" as Severity,
    details: "Payment processed and receipt issued",
  },
  {
    action: "REFUND_PAYMENT",
    resource: "Invoice",
    severity: "warning" as Severity,
    details: "Partial refund initiated for cancelled service",
  },
  {
    action: "UNAUTHORIZED_ACCESS",
    resource: "Patient",
    severity: "error" as Severity,
    details: "Attempted to access record outside assigned department",
  },
  {
    action: "BULK_EXPORT",
    resource: "Reports",
    severity: "warning" as Severity,
    details: "Mass data export of patient records initiated",
  },
  {
    action: "SYSTEM_CONFIG_CHANGE",
    resource: "Settings",
    severity: "warning" as Severity,
    details: "System configuration parameter modified",
  },
  {
    action: "ADD_STAFF_MEMBER",
    resource: "Staff",
    severity: "info" as Severity,
    details: "New staff account created and activated",
  },
  {
    action: "DEACTIVATE_STAFF",
    resource: "Staff",
    severity: "warning" as Severity,
    details: "Staff account suspended pending review",
  },
  {
    action: "RESET_PASSWORD",
    resource: "Auth",
    severity: "warning" as Severity,
    details: "Password reset link sent to registered email",
  },
  {
    action: "FAILED_PAYMENT",
    resource: "Invoice",
    severity: "error" as Severity,
    details: "Payment transaction declined by processor",
  },
  {
    action: "MEDICINE_DISPENSE",
    resource: "Pharmacy",
    severity: "info" as Severity,
    details: "Prescription dispensed and logged in inventory",
  },
  {
    action: "LOW_STOCK_ALERT",
    resource: "Pharmacy",
    severity: "warning" as Severity,
    details: "Medicine stock below minimum threshold",
  },
];

const IPS = [
  "192.168.1.10",
  "192.168.1.24",
  "10.0.0.15",
  "10.0.0.31",
  "172.16.0.8",
  "192.168.1.55",
];

function generateLogs(): AuditLog[] {
  const logs: AuditLog[] = [];
  const now = new Date("2026-05-19T17:00:00");
  let id = 1;

  for (let i = 0; i < 50; i++) {
    const minutesAgo = i * 28 + Math.floor(Math.random() * 15);
    const ts = new Date(now.getTime() - minutesAgo * 60000);
    const user = USERS[i % USERS.length];
    const actionData = ACTIONS[i % ACTIONS.length];
    const resourceId = `${actionData.resource.replace(" ", "").toUpperCase()}-${1000 + i}`;

    logs.push({
      id: `log-${id++}`,
      timestamp: ts.toISOString(),
      user: user.name,
      role: user.role,
      action: actionData.action,
      resource: actionData.resource,
      resourceId,
      ipAddress: IPS[i % IPS.length],
      severity: actionData.severity,
      details: actionData.details,
    });
  }
  return logs;
}

const AUDIT_LOGS = generateLogs();

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; className: string; icon: typeof Info; badgeClass: string }
> = {
  info: {
    label: "Info",
    icon: Info,
    className: "text-blue-600 dark:text-blue-400",
    badgeClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    className: "text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    className: "text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
  },
};

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AuditLogs() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Dashboard", href: "/admin" },
        { label: "Audit Logs" },
      ]),
    [setBreadcrumb],
  );

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(
    () =>
      AUDIT_LOGS.filter((l) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.resource.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.ipAddress.includes(q);
        const matchSev =
          severityFilter === "all" || l.severity === severityFilter;
        const matchAction = actionFilter === "all" || l.action === actionFilter;
        const matchUser = userFilter === "all" || l.user === userFilter;
        return matchSearch && matchSev && matchAction && matchUser;
      }),
    [search, severityFilter, actionFilter, userFilter],
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(
    () => ({
      info: AUDIT_LOGS.filter((l) => l.severity === "info").length,
      warning: AUDIT_LOGS.filter((l) => l.severity === "warning").length,
      error: AUDIT_LOGS.filter((l) => l.severity === "error").length,
    }),
    [],
  );

  const uniqueActions = useMemo(
    () => Array.from(new Set(AUDIT_LOGS.map((l) => l.action))),
    [],
  );
  const uniqueUsers = useMemo(
    () => Array.from(new Set(AUDIT_LOGS.map((l) => l.user))),
    [],
  );

  return (
    <div className="space-y-6" data-ocid="audit.page">
      <PageHeader
        title="Audit Logs"
        subtitle="System-wide activity log with real-time security monitoring and compliance tracking"
        actions={
          <Button
            type="button"
            variant="outline"
            data-ocid="audit.export_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Severity summary */}
      <div className="grid grid-cols-3 gap-4">
        {(
          [
            [
              "info",
              "Informational",
              "text-blue-600 dark:text-blue-400",
              "bg-blue-500/10 border-blue-500/20",
            ],
            [
              "warning",
              "Warnings",
              "text-amber-600 dark:text-amber-400",
              "bg-amber-500/10 border-amber-500/20",
            ],
            [
              "error",
              "Errors",
              "text-rose-600 dark:text-rose-400",
              "bg-rose-500/10 border-rose-500/20",
            ],
          ] as const
        ).map(([sev, label, textColor, bgColor]) => (
          <motion.div
            key={sev}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: sev === "info" ? 0 : sev === "warning" ? 0.05 : 0.1,
            }}
            className={cn(
              "rounded-xl border p-4 cursor-pointer transition-all",
              bgColor,
              severityFilter === sev ? "ring-2 ring-offset-1 ring-primary" : "",
            )}
            onClick={() =>
              setSeverityFilter(severityFilter === sev ? "all" : sev)
            }
            data-ocid={`audit.${sev}_filter`}
          >
            <div className="flex items-center gap-2">
              {sev === "info" ? (
                <Info className={cn("w-5 h-5", textColor)} />
              ) : sev === "warning" ? (
                <AlertTriangle className={cn("w-5 h-5", textColor)} />
              ) : (
                <AlertCircle className={cn("w-5 h-5", textColor)} />
              )}
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
            </div>
            <p
              className={cn("text-2xl font-bold font-display mt-1", textColor)}
            >
              {counts[sev]}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
            data-ocid="audit.search_input"
          />
        </div>
        <Select
          value={severityFilter}
          onValueChange={(v) => {
            setSeverityFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36" data-ocid="audit.severity_filter">
            <Shield className="w-4 h-4 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={actionFilter}
          onValueChange={(v) => {
            setActionFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44" data-ocid="audit.action_filter">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={userFilter}
          onValueChange={(v) => {
            setUserFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44" data-ocid="audit.user_filter">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {uniqueUsers.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Timestamp",
                  "User",
                  "Action",
                  "Resource",
                  "Details",
                  "IP Address",
                  "Severity",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((log, i) => {
                const cfg = SEVERITY_CONFIG[log.severity];
                const Icon = cfg.icon;
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`audit.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-foreground text-xs whitespace-nowrap">
                        {log.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.role}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-foreground whitespace-nowrap">
                        {log.action}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {log.resource}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 max-w-[240px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="text-xs font-mono text-muted-foreground">
                        {log.ipAddress}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
                          cfg.badgeClass,
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                    data-ocid="audit.empty_state"
                  >
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                data-ocid="audit.pagination_prev"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-ocid="audit.pagination_next"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
