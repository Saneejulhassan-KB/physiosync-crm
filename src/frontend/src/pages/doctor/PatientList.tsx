import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_PATIENTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { Department, PatientStatus } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Activity, Filter, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useEffect } from "react";

const STATUS_COLORS: Record<PatientStatus, string> = {
  active:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  inactive: "bg-muted text-muted-foreground border-border",
  discharged:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
};

const DEPT_COLORS: Record<string, string> = {
  PMR: "bg-primary/10 text-primary border-primary/20",
  General: "bg-secondary/10 text-secondary border-secondary/20",
  Admin: "bg-accent/10 text-accent border-accent/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-secondary/20 text-secondary",
    "bg-accent/20 text-accent",
    "bg-emerald-500/20 text-emerald-600",
    "bg-amber-500/20 text-amber-600",
    "bg-rose-500/20 text-rose-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function PatientList() {
  const { setBreadcrumb } = useUIStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department | "All">("All");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "All">(
    "All",
  );

  useEffect(() => {
    setBreadcrumb([{ label: "My Patients" }]);
  }, [setBreadcrumb]);

  const filtered = useMemo(() => {
    return MOCK_PATIENTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.patientId.toLowerCase().includes(search.toLowerCase()) ||
        p.medicalHistory.some((h) =>
          h.toLowerCase().includes(search.toLowerCase()),
        );
      const matchDept = deptFilter === "All" || p.department === deptFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, deptFilter, statusFilter]);

  return (
    <div className="space-y-6" data-ocid="patient_list.page">
      <PageHeader
        title="My Patients"
        subtitle={`${MOCK_PATIENTS.length} total patients across all departments`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: MOCK_PATIENTS.length,
            color: "text-foreground",
          },
          {
            label: "Active",
            value: MOCK_PATIENTS.filter((p) => p.status === "active").length,
            color: "text-emerald-500",
          },
          {
            label: "PMR",
            value: MOCK_PATIENTS.filter((p) => p.department === "PMR").length,
            color: "text-primary",
          },
          {
            label: "General",
            value: MOCK_PATIENTS.filter((p) => p.department === "General")
              .length,
            color: "text-secondary",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or diagnosis…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="patient_list.search_input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {(["All", "PMR", "General"] as const).map((d) => (
            <Button
              key={d}
              type="button"
              size="sm"
              variant={deptFilter === d ? "default" : "outline"}
              onClick={() => setDeptFilter(d as Department | "All")}
              data-ocid={`patient_list.dept_filter.${d.toLowerCase()}`}
            >
              {d}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {(["All", "active", "inactive", "discharged"] as const).map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s as PatientStatus | "All")}
              data-ocid={`patient_list.status_filter.${s}`}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="patient_list.empty_state"
        >
          <Users className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-lg font-semibold text-muted-foreground">
            No patients found
          </p>
          <p className="text-sm text-muted-foreground/60">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          data-ocid="patient_list.list"
        >
          {filtered.map((patient, i) => (
            <motion.button
              key={patient.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() =>
                navigate({
                  to: "/doctor/patients/$patientId",
                  params: { patientId: patient.id },
                })
              }
              data-ocid={`patient_list.item.${i + 1}`}
              className="glass-card rounded-xl p-5 cursor-pointer hover:shadow-elevation-medium hover:-translate-y-0.5 transition-all duration-200 group w-full text-left"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                    getAvatarColor(patient.name),
                  )}
                >
                  {getInitials(patient.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.patientId}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] shrink-0",
                        STATUS_COLORS[patient.status],
                      )}
                    >
                      {patient.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        DEPT_COLORS[patient.department],
                      )}
                    >
                      {patient.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {patient.gender}, {patient.age} yrs
                    </span>
                  </div>

                  {patient.medicalHistory[0] && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground/80 truncate">
                        <Activity className="inline w-3 h-3 mr-1 opacity-60" />
                        {patient.medicalHistory[0]}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      Doctor:{" "}
                      <span className="text-foreground font-medium">
                        {patient.assignedDoctor.replace("Dr. ", "")}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Since{" "}
                      {new Date(patient.registeredDate).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
