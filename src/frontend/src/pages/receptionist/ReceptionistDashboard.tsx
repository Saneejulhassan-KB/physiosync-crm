import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_APPOINTMENTS,
  MOCK_INVOICES,
  MOCK_PATIENTS,
} from "@/lib/mockData";
import { useUIStore } from "@/stores/uiStore";
import { Calendar, Clock, CreditCard, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function ReceptionistDashboard() {
  const { setBreadcrumb } = useUIStore();
  useEffect(() => setBreadcrumb([{ label: "Dashboard" }]), [setBreadcrumb]);

  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-19");
  const queue = todayAppts.filter(
    (a) =>
      a.status === "scheduled" ||
      a.status === "confirmed" ||
      a.status === "in_progress",
  );

  return (
    <div className="space-y-6" data-ocid="receptionist_dashboard.page">
      <PageHeader
        title="Front Desk Dashboard"
        subtitle="Today's queue, appointments, and patient check-ins"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Calendar,
            title: "Today's Appointments",
            value: todayAppts.length,
            iconClassName: "bg-primary/10",
            ocid: "receptionist_dashboard.appts_card",
          },
          {
            icon: Clock,
            title: "Queue Active",
            value: queue.length,
            iconClassName: "bg-secondary/10",
            ocid: "receptionist_dashboard.queue_card",
          },
          {
            icon: Users,
            title: "Total Patients",
            value: MOCK_PATIENTS.length,
            iconClassName: "bg-accent/10",
            ocid: "receptionist_dashboard.patients_card",
          },
          {
            icon: CreditCard,
            title: "Pending Invoices",
            value: MOCK_INVOICES.filter((i) => i.status !== "paid").length,
            iconClassName: "bg-amber-500/10",
            ocid: "receptionist_dashboard.invoices_card",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Queue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
          data-ocid="receptionist_dashboard.queue"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Live Queue</h3>
            <p className="text-xs text-muted-foreground">
              {queue.length} patients waiting or in progress
            </p>
          </div>
          <div className="divide-y divide-border">
            {queue.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-4 px-5 py-3"
                data-ocid={`receptionist_dashboard.queue.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">
                    {a.tokenNumber}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.time} · {a.doctorName}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's full schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
          data-ocid="receptionist_dashboard.schedule"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              All Today's Appointments
            </h3>
          </div>
          <div className="divide-y divide-border">
            {todayAppts.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-3 px-5 py-3"
                data-ocid={`receptionist_dashboard.schedule.item.${i + 1}`}
              >
                <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                  {a.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.doctorName} · {a.type}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
