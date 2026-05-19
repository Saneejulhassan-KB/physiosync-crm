import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_APPOINTMENTS,
  MOCK_LAB_REPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_THERAPY_SESSIONS,
} from "@/lib/mockData";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import {
  Activity,
  Bell,
  Calendar,
  Clock,
  FlaskConical,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function DoctorDashboard() {
  const { setBreadcrumb } = useUIStore();
  const { currentUser } = useAuthStore();
  useEffect(() => setBreadcrumb([{ label: "Dashboard" }]), [setBreadcrumb]);

  const todayAppts = MOCK_APPOINTMENTS.filter(
    (a) => a.date === "2026-05-19" && a.doctorId === "d1",
  );
  const criticalLabs = MOCK_LAB_REPORTS.filter((l) => l.isCritical);
  const doctorNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).slice(0, 4);

  return (
    <div className="space-y-6" data-ocid="doctor_dashboard.page">
      <PageHeader
        title={`Good morning, ${currentUser?.name ?? "Doctor"}`}
        subtitle="Your clinical overview for today — patients, sessions, and alerts"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            title: "My Patients",
            value: MOCK_PATIENTS.filter(
              (p) => p.assignedDoctor === "Dr. James Reeves",
            ).length,
            iconClassName: "bg-primary/10",
            ocid: "doctor_dashboard.patients_card",
          },
          {
            icon: Calendar,
            title: "Today's Sessions",
            value: todayAppts.length,
            iconClassName: "bg-secondary/10",
            ocid: "doctor_dashboard.sessions_card",
          },
          {
            icon: Activity,
            title: "Active Therapies",
            value: MOCK_THERAPY_SESSIONS.length,
            iconClassName: "bg-accent/10",
            ocid: "doctor_dashboard.therapy_card",
          },
          {
            icon: FlaskConical,
            title: "Pending Labs",
            value: MOCK_LAB_REPORTS.filter(
              (l) => l.status === "pending" || l.status === "processing",
            ).length,
            iconClassName: "bg-amber-500/10",
            ocid: "doctor_dashboard.labs_card",
          },
        ].map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            iconClassName={stat.iconClassName}
            data-ocid={stat.ocid}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
          data-ocid="doctor_dashboard.schedule"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Today's Schedule</h3>
            <p className="text-xs text-muted-foreground">May 19, 2026</p>
          </div>
          <div className="divide-y divide-border">
            {todayAppts.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-4 px-5 py-4"
                data-ocid={`doctor_dashboard.schedule.item.${i + 1}`}
              >
                <div className="text-center w-14 shrink-0">
                  <p className="text-xs font-bold text-primary">{a.time}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {a.duration}min
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {a.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={a.status} />
                  {a.tokenNumber && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Token #{a.tokenNumber}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Critical Labs */}
          {criticalLabs.length > 0 && (
            <div
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-4"
              data-ocid="doctor_dashboard.critical_labs"
            >
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4 text-destructive" />
                <h4 className="text-sm font-semibold text-destructive">
                  Critical Lab Results
                </h4>
              </div>
              {criticalLabs.map((l) => (
                <div key={l.id} className="text-xs">
                  <p className="font-medium text-foreground">{l.patientName}</p>
                  <p className="text-muted-foreground">{l.testName}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent Notifications */}
          <div
            className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
            data-ocid="doctor_dashboard.notifications"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Recent Alerts</h4>
            </div>
            <div className="divide-y divide-border">
              {doctorNotifs.map((n, i) => (
                <div
                  key={n.id}
                  className="px-4 py-3"
                  data-ocid={`doctor_dashboard.notification.item.${i + 1}`}
                >
                  <p className="text-xs font-medium text-foreground truncate">
                    {n.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Therapy Progress */}
          <div
            className="rounded-xl border border-border bg-card p-4 shadow-elevation-subtle"
            data-ocid="doctor_dashboard.therapy_progress"
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Active Therapies</h4>
            </div>
            {MOCK_THERAPY_SESSIONS.slice(0, 3).map((s) => (
              <div key={s.id} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground truncate">
                    {s.patientName}
                  </span>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {s.progress}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary rounded-full h-1.5 transition-all"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Session {s.sessionNumber}/{s.totalSessions} · {s.type}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
