import { PATIENT_NOTIFICATIONS } from "@/lib/salesPatientData";
import type { PatientNotification } from "@/types/patient";
import {
  Activity,
  Bell,
  Calendar,
  CheckCheck,
  FileText,
  Megaphone,
  Pill,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterType = "All" | PatientNotification["type"];

const TYPE_META: Record<
  PatientNotification["type"],
  {
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    iconColor: string;
    label: string;
  }
> = {
  appointment: {
    icon: Calendar,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Appointment",
  },
  medicine: {
    icon: Pill,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Medicine",
  },
  report: {
    icon: FileText,
    bg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    label: "Report",
  },
  promotion: {
    icon: Megaphone,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Promotion",
  },
  billing: {
    icon: Receipt,
    bg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Billing",
  },
  therapy: {
    icon: Activity,
    bg: "bg-primary/10",
    iconColor: "text-primary",
    label: "Therapy",
  },
};

const FILTER_TABS: FilterType[] = [
  "All",
  "appointment",
  "medicine",
  "report",
  "promotion",
  "billing",
];

function timeAgo(date: string, time: string): string {
  const then = new Date(
    `${date}T${time.replace(" AM", "").replace(" PM", "")}`,
  );
  const diff = Date.now() - then.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState(PATIENT_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const unread = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const filtered =
    activeFilter === "All"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-display text-foreground">
            Notifications
          </h1>
          {unread > 0 && (
            <span
              data-ocid="patient.notifications.unread_badge"
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold"
            >
              {unread}
            </span>
          )}
        </div>
        <button
          type="button"
          data-ocid="patient.notifications.mark_all_read"
          onClick={markAllRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`patient.notifications.filter.${tab.toLowerCase()}`}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              activeFilter === tab
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab === "All"
              ? "All"
              : TYPE_META[tab as PatientNotification["type"]].label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div
            data-ocid="patient.notifications.empty_state"
            className="text-center py-8 text-muted-foreground"
          >
            No notifications found.
          </div>
        )}
        {filtered.map((n, i) => {
          const meta = TYPE_META[n.type];
          const Icon = meta.icon;
          return (
            <button
              key={n.id}
              type="button"
              data-ocid={`patient.notification.item.${i + 1}`}
              onClick={() => markRead(n.id)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-elevation-subtle ${
                n.isRead
                  ? "border-border bg-card"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${meta.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {timeAgo(n.date, n.time)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
