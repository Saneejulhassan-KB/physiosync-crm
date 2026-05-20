import { PageHeader } from "@/components/shared/PageHeader";
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
import type { Patient } from "@/types";
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  HeartPulse,
  Pencil,
  Search,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ── Inline helpers ──────────────────────────────────────────────────────────

type StatusVariant = "active" | "inactive" | "discharged" | "archived";

const STATUS_COLORS: Record<StatusVariant, string> = {
  active:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border border-border",
  discharged:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  archived:
    "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20",
};

const StatusBadge = ({ status }: { status: StatusVariant }) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
      STATUS_COLORS[status] ?? STATUS_COLORS.inactive,
    )}
  >
    {status}
  </span>
);

const DeptBadge = ({ dept }: { dept: string }) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      dept === "PMR"
        ? "bg-primary/10 text-primary"
        : "bg-secondary/10 text-secondary-foreground",
    )}
  >
    {dept}
  </span>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function PatientDrawer({
  patient,
  onClose,
}: { patient: Patient | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {patient && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            data-ocid="admin.patients.dialog"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patient Profile
                </p>
                <h2 className="text-base font-bold text-foreground">
                  {patient.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-ocid="admin.patients.close_button"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Avatar + basic */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.gender} · {patient.age} yrs
                  </p>
                  <div className="mt-1 flex gap-2">
                    <DeptBadge dept={patient.department} />
                    <StatusBadge status={patient.status as StatusVariant} />
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["Patient ID", patient.patientId],
                    ["Blood Group", patient.bloodGroup ?? "—"],
                    ["Phone", patient.phone],
                    ["Email", patient.email ?? "—"],
                    ["Insurance", patient.insurance ?? "None"],
                    ["Emergency", patient.emergencyContact ?? "—"],
                  ] as [string, string][]
                ).map(([label, val]) => (
                  <div
                    key={label}
                    className="p-3 rounded-lg bg-muted/40 border border-border"
                  >
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Assigned Doctor */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Assigned Doctor
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {patient.assignedDoctor}
                </p>
              </div>

              {/* Medical History */}
              {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Medical History
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalHistory.map((h) => (
                      <span
                        key={h}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                    ⚠ Allergies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a) => (
                      <span
                        key={a}
                        className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Registered Date */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Registered On
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(patient.registeredDate)}
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-5 py-4 border-t border-border bg-muted/20 flex gap-2">
              <Button
                type="button"
                size="sm"
                className="flex-1 gap-2"
                data-ocid="admin.patients.confirm_button"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Record
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                data-ocid="admin.patients.cancel_button"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    patientId: "PSC-001",
    name: "Ahmed Al-Rashid",
    age: 45,
    gender: "Male",
    dob: "1979-03-12",
    phone: "+971 50 123 4567",
    email: "ahmed.rashid@email.com",
    address: "Al Nahda, Dubai",
    bloodGroup: "B+",
    department: "PMR",
    assignedDoctor: "Dr. Sarah Mitchell",
    status: "active",
    registeredDate: "2024-01-15",
    insurance: "Daman Standard",
    emergencyContact: "+971 50 987 6543",
    medicalHistory: ["Lumbar Disc Herniation", "Hypertension"],
    allergies: ["Penicillin"],
  },
  {
    id: "p2",
    patientId: "PSC-002",
    name: "Fatima Hassan",
    age: 33,
    gender: "Female",
    dob: "1991-07-22",
    phone: "+971 55 234 5678",
    email: "fatima.hassan@email.com",
    address: "Jumeirah, Dubai",
    bloodGroup: "A+",
    department: "PMR",
    assignedDoctor: "Dr. James Patel",
    status: "active",
    registeredDate: "2024-02-08",
    emergencyContact: "+971 55 876 5432",
    medicalHistory: ["Rotator Cuff Injury"],
    allergies: [],
  },
  {
    id: "p3",
    patientId: "PSC-003",
    name: "Mohammed Al-Mansoori",
    age: 58,
    gender: "Male",
    dob: "1966-11-05",
    phone: "+971 52 345 6789",
    email: "m.mansoori@email.com",
    address: "Mirdif, Dubai",
    bloodGroup: "O+",
    department: "General",
    assignedDoctor: "Dr. Linda Chen",
    status: "active",
    registeredDate: "2024-01-30",
    insurance: "AXA Enhanced",
    emergencyContact: "+971 52 765 4321",
    medicalHistory: ["Type 2 Diabetes", "Knee Osteoarthritis"],
    allergies: ["NSAIDs"],
  },
  {
    id: "p4",
    patientId: "PSC-004",
    name: "Sara Khalid Al-Zaabi",
    age: 28,
    gender: "Female",
    dob: "1996-04-18",
    phone: "+971 56 456 7890",
    email: "sara.zaabi@email.com",
    address: "Business Bay, Dubai",
    bloodGroup: "AB-",
    department: "PMR",
    assignedDoctor: "Dr. Sarah Mitchell",
    status: "active",
    registeredDate: "2024-03-12",
    emergencyContact: "+971 56 654 3210",
    medicalHistory: ["Sports Injury - ACL"],
    allergies: [],
  },
  {
    id: "p5",
    patientId: "PSC-005",
    name: "Ravi Shankar",
    age: 52,
    gender: "Male",
    dob: "1972-09-14",
    phone: "+971 58 567 8901",
    email: "ravi.shankar@email.com",
    address: "Deira, Dubai",
    bloodGroup: "O-",
    department: "General",
    assignedDoctor: "Dr. James Patel",
    status: "inactive",
    registeredDate: "2023-11-20",
    insurance: "Oman Insurance",
    emergencyContact: "+971 58 543 2109",
    medicalHistory: ["Chronic Back Pain", "Hypertension"],
    allergies: ["Aspirin"],
  },
  {
    id: "p6",
    patientId: "PSC-006",
    name: "Elena Popescu",
    age: 39,
    gender: "Female",
    dob: "1985-12-03",
    phone: "+971 50 678 9012",
    email: "elena.popescu@email.com",
    address: "Marina, Dubai",
    bloodGroup: "A-",
    department: "PMR",
    assignedDoctor: "Dr. Linda Chen",
    status: "discharged",
    registeredDate: "2023-09-05",
    emergencyContact: "+971 50 432 1098",
    medicalHistory: ["Post-Surgical Rehabilitation"],
    allergies: [],
  },
];

export default function AdminPatients() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    return MOCK_PATIENTS.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q);
      const matchDept = dept === "all" || p.department === dept;
      const matchStatus = status === "all" || p.status === status;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, dept, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPatients = MOCK_PATIENTS.length;
  const activePatients = MOCK_PATIENTS.filter(
    (p) => p.status === "active",
  ).length;
  const pmrPatients = MOCK_PATIENTS.filter(
    (p) => p.department === "PMR",
  ).length;
  const generalPatients = MOCK_PATIENTS.filter(
    (p) => p.department === "General",
  ).length;

  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      delta: "+12 this month",
      icon: Users,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Active Patients",
      value: activePatients,
      delta: `${Math.round((activePatients / totalPatients) * 100)}% of total`,
      icon: Activity,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "PMR Department",
      value: pmrPatients,
      delta: "Physical Medicine",
      icon: HeartPulse,
      iconClass: "bg-secondary/10 text-secondary",
    },
    {
      label: "General Dept.",
      value: generalPatients,
      delta: "General Medicine",
      icon: Stethoscope,
      iconClass: "bg-accent/10 text-accent",
    },
  ];

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleDept = (v: string) => {
    setDept(v);
    setPage(1);
  };
  const handleStatus = (v: string) => {
    setStatus(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Management"
        subtitle="Monitor and manage all registered patients across both departments"
        actions={
          <Button
            data-ocid="admin.patients.add_button"
            size="sm"
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Patient
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-elevation-subtle"
          >
            <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-primary/5 blur-2xl" />
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {s.label}
                </p>
                <p className="text-2xl font-bold font-display text-foreground">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.delta}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconClass}`}
              >
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters + Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="bg-card border border-border rounded-xl shadow-elevation-subtle overflow-hidden"
      >
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              Patient List
            </span>
            <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {filtered.length} records
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name or ID…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 text-sm w-full sm:w-56"
                data-ocid="admin.patients.search_input"
              />
            </div>
            <Select value={dept} onValueChange={handleDept}>
              <SelectTrigger
                className="h-9 w-full sm:w-40 text-sm"
                data-ocid="admin.patients.dept_select"
              >
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="PMR">PMR</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={handleStatus}>
              <SelectTrigger
                className="h-9 w-full sm:w-36 text-sm"
                data-ocid="admin.patients.status_select"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Patient ID",
                  "Full Name",
                  "Age",
                  "Department",
                  "Assigned Doctor",
                  "Last Visit",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div
                      data-ocid="admin.patients.empty_state"
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Users className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        No patients found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    data-ocid={`admin.patients.item.${(page - 1) * PAGE_SIZE + i + 1}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="bg-card hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-primary bg-primary/8 px-2 py-0.5 rounded">
                        {p.patientId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate max-w-40">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground font-medium">
                        {p.age}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        yrs
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DeptBadge dept={p.department} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground whitespace-nowrap">
                        {p.assignedDoctor}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(p.registeredDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={(p.status ?? "inactive") as StatusVariant}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(p)}
                          data-ocid={`admin.patients.view_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                          className="h-7 px-2 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          data-ocid={`admin.patients.edit_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                          className="h-7 px-2 text-xs gap-1.5 hover:bg-muted"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              patients
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                data-ocid="admin.patients.pagination_prev"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    data-ocid={`admin.patients.page.${pageNum}`}
                    className={`h-8 min-w-8 px-2 rounded text-xs font-medium transition-colors ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                data-ocid="admin.patients.pagination_next"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick-View Slide-Over */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
