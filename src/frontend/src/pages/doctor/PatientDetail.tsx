import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  MOCK_APPOINTMENTS,
  MOCK_INVOICES,
  MOCK_LAB_REPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_PATIENT_ACTIVITIES,
  MOCK_PRESCRIPTIONS,
  MOCK_THERAPY_SESSIONS,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Edit,
  FileText,
  FlaskConical,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Pill,
  Plus,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const ACTIVITY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  appointment: Calendar,
  lab: FlaskConical,
  prescription: Pill,
  payment: CreditCard,
  note: FileText,
  therapy: Activity,
  notification: Bell,
  message: MessageSquare,
};

const ACTIVITY_COLORS: Record<string, string> = {
  appointment: "bg-primary/15 text-primary",
  lab: "bg-amber-500/15 text-amber-500",
  prescription: "bg-secondary/15 text-secondary",
  payment: "bg-emerald-500/15 text-emerald-500",
  note: "bg-muted text-muted-foreground",
  therapy: "bg-accent/15 text-accent",
  notification: "bg-rose-500/15 text-rose-500",
  message: "bg-teal-500/15 text-teal-500",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarBg(name: string) {
  const opts = [
    "from-primary/30 to-primary/10",
    "from-secondary/30 to-secondary/10",
    "from-accent/30 to-accent/10",
  ];
  return opts[name.charCodeAt(0) % opts.length];
}

export default function PatientDetail() {
  const { patientId } = useParams({ strict: false }) as { patientId: string };
  const navigate = useNavigate();
  const { setBreadcrumb } = useUIStore();
  const [note, setNote] = useState("");
  const [followupDate, setFollowupDate] = useState("");
  const [followupType, setFollowupType] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const patient =
    MOCK_PATIENTS.find((p) => p.id === patientId) ?? MOCK_PATIENTS[0];
  const patientAppts = MOCK_APPOINTMENTS.filter(
    (a) => a.patientId === patient.id,
  );
  const patientPrescriptions = MOCK_PRESCRIPTIONS.filter(
    (p) => p.patientId === patient.id,
  );
  const patientLabs = MOCK_LAB_REPORTS.filter(
    (l) => l.patientId === patient.id,
  );
  const patientTherapy = MOCK_THERAPY_SESSIONS.filter(
    (t) => t.patientId === patient.id,
  );
  const patientInvoices = MOCK_INVOICES.filter(
    (i) => i.patientId === patient.id,
  );
  const patientNotifs = MOCK_NOTIFICATIONS.filter(
    (n) => n.patientId === patient.id,
  ).slice(0, 5);

  useEffect(() => {
    setBreadcrumb([
      { label: "My Patients", href: "/doctor/patients" },
      { label: patient.name },
    ]);
  }, [setBreadcrumb, patient.name]);

  function handleSaveNote() {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
    setNote("");
  }

  const statusColor = {
    active:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    inactive: "bg-muted text-muted-foreground border-border",
    discharged: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  }[patient.status];

  return (
    <div className="space-y-6" data-ocid="patient_detail.page">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/doctor/patients" })}
          data-ocid="patient_detail.back_button"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Button>
      </div>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
        data-ocid="patient_detail.header"
      >
        <div className="flex flex-col md:flex-row gap-5">
          {/* Avatar */}
          <div
            className={cn(
              "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl font-bold shrink-0",
              getAvatarBg(patient.name),
            )}
          >
            <span className="text-foreground">{getInitials(patient.name)}</span>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {patient.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {patient.patientId} · {patient.gender} · {patient.age} years
                  old · DOB:{" "}
                  {new Date(patient.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusColor)}
                >
                  {patient.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {patient.department}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-ocid="patient_detail.edit_button"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{patient.address}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Assigned:{" "}
              <span className="text-foreground font-medium">
                {patient.assignedDoctor}
              </span>
              {patient.insurance && (
                <>
                  {" "}
                  · Insurance:{" "}
                  <span className="text-foreground font-medium">
                    {patient.insurance}
                  </span>
                </>
              )}
              {patient.emergencyContact && (
                <>
                  {" "}
                  · Emergency:{" "}
                  <span className="text-foreground font-medium">
                    {patient.emergencyContact}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Medical summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Diagnosis",
            value: patient.medicalHistory[0] ?? "N/A",
            icon: Activity,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Blood Type",
            value: patient.bloodGroup,
            icon: Activity,
            color: "text-rose-500 bg-rose-500/10",
          },
          {
            label: "Allergies",
            value:
              patient.allergies.length > 0
                ? patient.allergies.join(", ")
                : "None known",
            icon: AlertTriangle,
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            label: "Insurance",
            value: patient.insurance ?? "None",
            icon: CreditCard,
            color: "text-secondary bg-secondary/10",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card rounded-xl p-4"
            data-ocid={`patient_detail.medical_card.${i + 1}`}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center mb-2",
                card.color,
              )}
            >
              <card.icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              {card.label}
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main content + Right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Tabbed content */}
        <div className="xl:col-span-2">
          <Tabs
            defaultValue="timeline"
            className="space-y-4"
            data-ocid="patient_detail.tabs"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger
                value="timeline"
                data-ocid="patient_detail.timeline_tab"
              >
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                data-ocid="patient_detail.appointments_tab"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="prescriptions"
                data-ocid="patient_detail.prescriptions_tab"
              >
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="labs" data-ocid="patient_detail.labs_tab">
                Lab Reports
              </TabsTrigger>
              <TabsTrigger
                value="therapy"
                data-ocid="patient_detail.therapy_tab"
              >
                Therapy
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                data-ocid="patient_detail.billing_tab"
              >
                Billing
              </TabsTrigger>
            </TabsList>

            {/* TIMELINE */}
            <TabsContent value="timeline">
              <div className="glass-card rounded-xl p-5 space-y-0">
                {MOCK_PATIENT_ACTIVITIES.map((activity, i) => {
                  const Icon = ACTIVITY_ICONS[activity.type] ?? FileText;
                  return (
                    <div
                      key={activity.id}
                      className="flex gap-4"
                      data-ocid={`patient_detail.timeline_item.${i + 1}`}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            ACTIVITY_COLORS[activity.type] ??
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {i < MOCK_PATIENT_ACTIVITIES.length - 1 && (
                          <div className="w-px flex-1 bg-border my-1" />
                        )}
                      </div>
                      <div className="pb-5 flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">
                            {activity.title}
                          </p>
                          {activity.status && (
                            <Badge variant="outline" className="text-[10px]">
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[11px] text-muted-foreground/70">
                            {activity.date} {activity.time}
                          </p>
                          {activity.by && (
                            <p className="text-[11px] text-muted-foreground/70">
                              by {activity.by}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* APPOINTMENTS */}
            <TabsContent value="appointments">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">
                    All Appointments ({patientAppts.length})
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {patientAppts.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground text-sm">
                      No appointments found.
                    </p>
                  ) : (
                    patientAppts.map((a, i) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-4 px-5 py-4"
                        data-ocid={`patient_detail.appointment_item.${i + 1}`}
                      >
                        <div className="text-center w-16 shrink-0">
                          <p className="text-xs font-bold text-primary">
                            {a.time}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {a.date}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {a.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {a.doctorName} · {a.duration}min
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="capitalize text-[10px] shrink-0"
                        >
                          {a.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* PRESCRIPTIONS */}
            <TabsContent value="prescriptions">
              <div className="space-y-3">
                {patientPrescriptions.length === 0 ? (
                  <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
                    No prescriptions found.
                  </div>
                ) : (
                  patientPrescriptions.map((rx, i) => (
                    <div
                      key={rx.id ?? `rx-${i}`}
                      className="glass-card rounded-xl p-5"
                      data-ocid={`patient_detail.prescription_item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {rx.diagnosis}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {rx.doctorName} · {rx.date}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize shrink-0",
                            rx.status === "active"
                              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25"
                              : "",
                          )}
                        >
                          {rx.status}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {rx.medicines.map((med, j) => (
                          <div
                            key={`med-${med.name}-${j}`}
                            className="flex items-start gap-2 text-xs"
                          >
                            <Pill className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium text-foreground">
                                {med.name}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                · {med.dosage} · {med.frequency} ·{" "}
                                {med.duration}
                              </span>
                              {med.instructions && (
                                <span className="text-muted-foreground/70">
                                  {" "}
                                  ({med.instructions})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {rx.notes && (
                        <p className="mt-3 text-xs text-muted-foreground italic border-t border-border pt-3">
                          {rx.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* LAB REPORTS */}
            <TabsContent value="labs">
              <div className="space-y-3">
                {patientLabs.length === 0 ? (
                  <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
                    No lab reports found.
                  </div>
                ) : (
                  patientLabs.map((lab, i) => (
                    <div
                      key={lab.id}
                      className="glass-card rounded-xl p-5"
                      data-ocid={`patient_detail.lab_item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="font-semibold text-sm text-foreground truncate">
                              {lab.testName}
                            </p>
                            {lab.isCritical && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] shrink-0"
                              >
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {lab.category} · Ordered by {lab.orderedBy} ·{" "}
                            {lab.orderedDate}
                          </p>
                          {lab.results && (
                            <p className="text-xs text-muted-foreground/80 mt-2 border-t border-border pt-2">
                              {lab.results}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] capitalize",
                              lab.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25"
                                : lab.status === "pending"
                                  ? "bg-amber-500/15 text-amber-600 border-amber-500/25"
                                  : "",
                            )}
                          >
                            {lab.status}
                          </Badge>
                          {lab.status === "completed" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              data-ocid={`patient_detail.lab_download.${i + 1}`}
                            >
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* THERAPY */}
            <TabsContent value="therapy">
              <div className="space-y-3">
                {patientTherapy.length === 0 ? (
                  <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
                    No therapy sessions found.
                  </div>
                ) : (
                  patientTherapy.map((session, i) => (
                    <div
                      key={session.id}
                      className="glass-card rounded-xl p-5"
                      data-ocid={`patient_detail.therapy_item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {session.type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {session.date} · {session.therapistName}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-primary">
                            Session {session.sessionNumber}/
                            {session.totalSessions}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.progress}% complete
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{session.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${session.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      {session.notes && (
                        <p className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
                          {session.notes}
                        </p>
                      )}
                      {session.exercises.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {session.exercises.map((ex) => (
                            <Badge
                              key={ex}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* BILLING */}
            <TabsContent value="billing">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">
                    Invoices ({patientInvoices.length})
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {patientInvoices.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground text-sm">
                      No invoices found.
                    </p>
                  ) : (
                    patientInvoices.map((inv, i) => (
                      <div
                        key={inv.id}
                        className="flex items-center gap-4 px-5 py-4"
                        data-ocid={`patient_detail.invoice_item.${i + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Invoice #{inv.id.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {inv.date} · Due {inv.dueDate}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">
                            ${inv.total.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paid: ${inv.paid.toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize shrink-0 ml-2",
                            inv.status === "paid"
                              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25"
                              : inv.status === "overdue"
                                ? "bg-destructive/15 text-destructive border-destructive/25"
                                : inv.status === "partial"
                                  ? "bg-amber-500/15 text-amber-600 border-amber-500/25"
                                  : "",
                          )}
                        >
                          {inv.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Latest Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl overflow-hidden"
            data-ocid="patient_detail.notifications_panel"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Recent Notifications
              </h3>
            </div>
            <div className="divide-y divide-border">
              {patientNotifs.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">
                  No notifications
                </p>
              ) : (
                patientNotifs.map((notif) => (
                  <div key={notif.id} className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          notif.priority === "urgent"
                            ? "bg-destructive"
                            : notif.priority === "high"
                              ? "bg-amber-500"
                              : "bg-primary",
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(notif.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Follow-up Scheduler */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl overflow-hidden"
            data-ocid="patient_detail.followup_panel"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <h3 className="font-semibold text-sm text-foreground">
                Schedule Follow-up
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  className="text-xs"
                  data-ocid="patient_detail.followup_date_input"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Appointment Type</Label>
                <Input
                  placeholder="e.g. Follow-up Consultation"
                  value={followupType}
                  onChange={(e) => setFollowupType(e.target.value)}
                  className="text-xs"
                  data-ocid="patient_detail.followup_type_input"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="w-full gap-1.5"
                data-ocid="patient_detail.followup_submit_button"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule Appointment
              </Button>
            </div>
          </motion.div>

          {/* Quick Notes */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl overflow-hidden"
            data-ocid="patient_detail.quick_notes_panel"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-sm text-foreground">
                Quick Note
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <Textarea
                placeholder="Add a clinical note for this patient…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="resize-none text-xs"
                data-ocid="patient_detail.note_textarea"
              />
              {noteSaved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Note saved
                  successfully
                </div>
              )}
              <Button
                type="button"
                size="sm"
                className="w-full gap-1.5"
                disabled={!note.trim()}
                onClick={handleSaveNote}
                data-ocid="patient_detail.note_save_button"
              >
                <Send className="w-3.5 h-3.5" /> Save Note
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
