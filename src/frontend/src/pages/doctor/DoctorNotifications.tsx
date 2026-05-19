import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { NotificationType } from "@/types";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCheck,
  Clock,
  CreditCard,
  Filter,
  FlaskConical,
  Info,
  Pill,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const TYPE_ICONS: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  appointment: Calendar,
  lab_report: FlaskConical,
  prescription: Pill,
  billing: CreditCard,
  system: Info,
  reminder: Clock,
  emergency: AlertTriangle,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  appointment: "bg-primary/15 text-primary",
  lab_report: "bg-amber-500/15 text-amber-500",
  prescription: "bg-secondary/15 text-secondary",
  billing: "bg-emerald-500/15 text-emerald-500",
  system: "bg-muted text-muted-foreground",
  reminder: "bg-accent/15 text-accent",
  emergency: "bg-destructive/15 text-destructive",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-destructive/15 text-destructive border-destructive/25",
  high: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

type TabFilter =
  | "all"
  | "appointment"
  | "lab_report"
  | "reminder"
  | "emergency";

export default function DoctorNotifications() {
  const { setBreadcrumb } = useUIStore();
  const [search, setSearch] = useState("");
  const [readState, setReadState] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_NOTIFICATIONS.map((n) => [n.id, n.isRead])),
  );
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  useEffect(() => {
    setBreadcrumb([{ label: "Notifications" }]);
  }, [setBreadcrumb]);

  function markAllRead() {
    setReadState(
      Object.fromEntries(MOCK_NOTIFICATIONS.map((n) => [n.id, true])),
    );
  }

  function toggleRead(id: string) {
    setReadState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => {
      const matchTab = activeTab === "all" || n.type === activeTab;
      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()) ||
        (n.patientName?.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const unreadCount = Object.values(readState).filter((r) => !r).length;

  const TAB_ITEMS: {
    value: TabFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { value: "all", label: "All", icon: Bell },
    { value: "appointment", label: "Patient Updates", icon: Calendar },
    { value: "lab_report", label: "Reports", icon: FlaskConical },
    { value: "reminder", label: "Reminders", icon: Clock },
    { value: "emergency", label: "Emergency", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6" data-ocid="doctor_notifications.page">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Notification Center"
          subtitle={`${unreadCount} unread notifications`}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={markAllRead}
          data-ocid="doctor_notifications.mark_all_read_button"
          className="gap-1.5 shrink-0"
        >
          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notifications by title, message, or patient…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="doctor_notifications.search_input"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: MOCK_NOTIFICATIONS.length,
            color: "text-foreground",
          },
          { label: "Unread", value: unreadCount, color: "text-primary" },
          {
            label: "Urgent",
            value: MOCK_NOTIFICATIONS.filter((n) => n.priority === "urgent")
              .length,
            color: "text-destructive",
          },
          {
            label: "Today",
            value: MOCK_NOTIFICATIONS.filter(
              (n) =>
                new Date(n.createdAt).toDateString() ===
                new Date().toDateString(),
            ).length,
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

      {/* Tabs + feed */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabFilter)}
        data-ocid="doctor_notifications.tabs"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`doctor_notifications.tab.${tab.value}`}
            >
              <tab.icon className="w-3.5 h-3.5 mr-1.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_ITEMS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="doctor_notifications.empty_state"
              >
                <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="font-semibold text-muted-foreground">
                  No notifications found
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Try a different filter or search term.
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="doctor_notifications.list">
                {filtered.map((notif, i) => {
                  const Icon = TYPE_ICONS[notif.type] ?? Bell;
                  const isRead = readState[notif.id];
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`doctor_notifications.item.${i + 1}`}
                      className={cn(
                        "glass-card rounded-xl p-4 border transition-all duration-200",
                        !isRead
                          ? "border-primary/20 bg-primary/[0.02]"
                          : "border-border",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            TYPE_COLORS[notif.type],
                          )}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className={cn(
                                  "text-sm font-semibold",
                                  !isRead
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {notif.title}
                              </p>
                              {!isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] capitalize",
                                  PRIORITY_COLORS[notif.priority],
                                )}
                              >
                                {notif.priority}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>

                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              {notif.patientName && (
                                <span className="text-[11px] text-muted-foreground">
                                  Patient:{" "}
                                  <span className="text-foreground font-medium">
                                    {notif.patientName}
                                  </span>
                                </span>
                              )}
                              <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(notif.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleRead(notif.id)}
                              data-ocid={`doctor_notifications.read_toggle.${i + 1}`}
                              className="text-[11px] text-primary hover:underline"
                            >
                              {isRead ? "Mark unread" : "Mark read"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
