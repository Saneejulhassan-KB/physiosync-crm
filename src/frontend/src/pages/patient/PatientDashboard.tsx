import {
  MOCK_PATIENT_PROFILE,
  PATIENT_APPOINTMENTS,
  PATIENT_INVOICES,
  PATIENT_NOTIFICATIONS,
  PATIENT_PRESCRIPTIONS,
} from "@/lib/salesPatientData";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  ClipboardList,
  FileText,
  Pill,
  Receipt,
  TrendingUp,
} from "lucide-react";

const upcomingCount = PATIENT_APPOINTMENTS.filter(
  (a) => a.status === "upcoming",
).length;
const activePrescriptions = PATIENT_PRESCRIPTIONS.filter(
  (p) => p.status === "active",
).length;
const unreadNotifications = PATIENT_NOTIFICATIONS.filter(
  (n) => !n.isRead,
).length;
const _pendingInvoices = PATIENT_INVOICES.filter(
  (i) => i.status === "pending",
).length;

const quickLinks = [
  {
    label: "Book Appointment",
    icon: Calendar,
    to: "/patient/appointments",
    color: "bg-primary/10 text-primary",
    desc: "Schedule your next visit",
  },
  {
    label: "View Reports",
    icon: FileText,
    to: "/patient/reports",
    color: "bg-accent/10 text-accent",
    desc: "Lab & imaging results",
  },
  {
    label: "Prescriptions",
    icon: Pill,
    to: "/patient/prescriptions",
    color: "bg-secondary/10 text-secondary",
    desc: "Active medicines & refills",
  },
  {
    label: "Therapy Progress",
    icon: TrendingUp,
    to: "/patient/progress",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    desc: "Track your rehab journey",
  },
  {
    label: "Billing History",
    icon: Receipt,
    to: "/patient/billing",
    color:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    desc: "Invoices & payment history",
  },
  {
    label: "Notifications",
    icon: Bell,
    to: "/patient/notifications",
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    desc: "Updates & reminders",
  },
];

export default function PatientDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-accent/80 p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium opacity-80">Patient Portal</p>
            <h1 className="text-2xl font-bold font-display tracking-tight">
              Welcome back, {MOCK_PATIENT_PROFILE.name}
            </h1>
            <p className="text-sm opacity-70 mt-0.5">
              ID: {MOCK_PATIENT_PROFILE.patientId} ·{" "}
              {MOCK_PATIENT_PROFILE.bloodGroup}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Upcoming Appointments",
            value: upcomingCount,
            icon: Calendar,
            color: "bg-primary/10",
            iconColor: "text-primary",
            ocid: "patient.stat.appointments",
          },
          {
            label: "Active Prescriptions",
            value: activePrescriptions,
            icon: Pill,
            color: "bg-accent/10",
            iconColor: "text-accent",
            ocid: "patient.stat.prescriptions",
          },
          {
            label: "Pending Reports",
            value: 2,
            icon: ClipboardList,
            color: "bg-secondary/10",
            iconColor: "text-secondary",
            ocid: "patient.stat.reports",
          },
          {
            label: "Unread Notifications",
            value: unreadNotifications,
            icon: Bell,
            color: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
            ocid: "patient.stat.notifications",
          },
        ].map((s) => (
          <div
            key={s.label}
            data-ocid={s.ocid}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold font-display text-foreground mt-1">
                  {s.value}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}
              >
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`patient.quick_link.item.${i + 1}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-elevation-medium hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center shrink-0`}
              >
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm">
                  {link.label}
                </div>
                <div className="text-xs text-muted-foreground">{link.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Next Appointment */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Next Appointment
        </h2>
        {PATIENT_APPOINTMENTS.filter((a) => a.status === "upcoming")
          .slice(0, 1)
          .map((apt) => (
            <div
              key={apt.id}
              className="rounded-xl border border-border bg-card p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground">
                  {apt.doctorName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {apt.type} · {apt.department}
                </div>
                <div className="text-sm font-medium text-primary mt-1">
                  {apt.date} at {apt.time}
                </div>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Upcoming
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
