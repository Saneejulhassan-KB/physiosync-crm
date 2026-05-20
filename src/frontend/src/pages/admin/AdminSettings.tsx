import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  Lock,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Sliders,
  TriangleAlert,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClinicFormValues {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
}

interface WorkingHours {
  day: string;
  open: string;
  close: string;
  enabled: boolean;
}

interface RoleNotifRow {
  role: string;
  sms: boolean;
  email: boolean;
  inApp: boolean;
}

const DAYS: WorkingHours[] = [
  { day: "Monday", open: "08:00", close: "20:00", enabled: true },
  { day: "Tuesday", open: "08:00", close: "20:00", enabled: true },
  { day: "Wednesday", open: "08:00", close: "20:00", enabled: true },
  { day: "Thursday", open: "08:00", close: "20:00", enabled: true },
  { day: "Friday", open: "08:00", close: "17:00", enabled: true },
  { day: "Saturday", open: "09:00", close: "14:00", enabled: true },
  { day: "Sunday", open: "09:00", close: "13:00", enabled: false },
];

const TIME_OPTIONS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? "00" : "30";
  const val = `${String(h).padStart(2, "0")}:${m}`;
  return { value: val, label: val };
});

export default function AdminSettings() {
  const lastSaved = "Today at 9:42 AM";

  // ── Clinic tab ──
  const clinicForm = useForm<ClinicFormValues>({
    defaultValues: {
      clinicName: "PhysioSync Rehabilitation Clinic",
      address: "Al Wasl Road, Jumeirah, Dubai, UAE",
      phone: "+971 4 234 5678",
      email: "admin@physiosync.ae",
    },
  });
  const [departments, setDepartments] = useState({ pmr: true, general: true });
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(DAYS);

  // ── Notifications tab ──
  const [notifChannels, setNotifChannels] = useState({
    apptReminderSms: true,
    apptReminderEmail: true,
    apptReminderWhatsapp: false,
    medicineRefill: true,
    labReportReady: true,
    billingReminders: true,
    doctorFollowup: true,
  });
  const [reminderLeadTime, setReminderLeadTime] = useState("24h");
  const [roleNotifs, setRoleNotifs] = useState<RoleNotifRow[]>([
    { role: "Super Admin", sms: true, email: true, inApp: true },
    { role: "Doctors", sms: true, email: true, inApp: true },
    { role: "Receptionist", sms: true, email: false, inApp: true },
    { role: "Sales", sms: false, email: true, inApp: true },
    { role: "Lab Staff", sms: false, email: true, inApp: true },
    { role: "Patient", sms: true, email: true, inApp: true },
  ]);

  // ── CRM Controls tab ──
  const [leadSources, setLeadSources] = useState({
    facebook: true,
    instagram: true,
    manual: true,
    walkin: true,
    referral: true,
  });
  const [autoAssignLeads, setAutoAssignLeads] = useState(true);
  const [slotDuration, setSlotDuration] = useState("30");
  const [queueMode, setQueueMode] = useState("token");
  const [featureFlags, setFeatureFlags] = useState({
    analyticsForDoctors: true,
    patientSelfBooking: false,
    labReportViewer: true,
  });

  // ── Security tab ──
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState("strong");
  const [auditRetention, setAuditRetention] = useState("90");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);

  function updateWorkingHours(
    idx: number,
    field: keyof WorkingHours,
    value: string | boolean,
  ) {
    setWorkingHours((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, [field]: value } : h)),
    );
  }

  function toggleRoleField(roleIdx: number, field: "sms" | "email" | "inApp") {
    setRoleNotifs((prev) =>
      prev.map((r, i) => (i === roleIdx ? { ...r, [field]: !r[field] } : r)),
    );
  }

  function handleSave(section: string) {
    toast.success(`${section} settings saved`, {
      description: "Changes have been applied successfully.",
    });
  }

  function handleResetAll() {
    setShowResetDialog(false);
    toast.success("All settings reset to defaults", {
      description: "The system has been restored to factory defaults.",
    });
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeader
          title="System Settings"
          subtitle="Configure clinic operations, notifications, CRM controls, and security"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border px-3 py-1.5 rounded-lg shrink-0 self-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>Last saved: {lastSaved}</span>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 p-1">
          <TabsTrigger
            value="clinic"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="admin.settings.tab.clinic"
          >
            <Building2 className="w-3.5 h-3.5" /> Clinic Info
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="admin.settings.tab.notifications"
          >
            <Bell className="w-3.5 h-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger
            value="crm"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="admin.settings.tab.crm"
          >
            <Sliders className="w-3.5 h-3.5" /> CRM Controls
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="admin.settings.tab.security"
          >
            <Shield className="w-3.5 h-3.5" /> Security
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════ CLINIC INFO TAB ═══════════════ */}
        <TabsContent value="clinic">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Clinic Information
                </h3>
              </div>
              <form
                onSubmit={clinicForm.handleSubmit(() =>
                  handleSave("Clinic Information"),
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="clinic-name">Clinic Name</Label>
                    <Input
                      id="clinic-name"
                      {...clinicForm.register("clinicName", { required: true })}
                      data-ocid="admin.settings.clinic_name_input"
                    />
                    {clinicForm.formState.errors.clinicName && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="admin.settings.clinic_name_input.field_error"
                      >
                        Clinic name is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clinic-email">Email</Label>
                    <Input
                      id="clinic-email"
                      type="email"
                      {...clinicForm.register("email", { required: true })}
                      data-ocid="admin.settings.clinic_email_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clinic-phone">Phone</Label>
                    <Input
                      id="clinic-phone"
                      {...clinicForm.register("phone")}
                      data-ocid="admin.settings.clinic_phone_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clinic-address">Address</Label>
                    <Input
                      id="clinic-address"
                      {...clinicForm.register("address")}
                      data-ocid="admin.settings.clinic_address_input"
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Active Departments
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="min-w-0 mr-4 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            PMR Department
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Physical Medicine &amp; Rehabilitation — physiotherapy
                          and rehabilitation services
                        </p>
                      </div>
                      <Switch
                        checked={departments.pmr}
                        onCheckedChange={(v) =>
                          setDepartments((p) => ({ ...p, pmr: v }))
                        }
                        data-ocid="admin.settings.dept.pmr_toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="min-w-0 mr-4 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            General / Other Medical
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          General consultations and other medical specialties
                        </p>
                      </div>
                      <Switch
                        checked={departments.general}
                        onCheckedChange={(v) =>
                          setDepartments((p) => ({ ...p, general: v }))
                        }
                        data-ocid="admin.settings.dept.general_toggle"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="gap-2"
                    data-ocid="admin.settings.clinic.save_button"
                  >
                    <Save className="w-4 h-4" /> Save Clinic Info
                  </Button>
                </div>
              </form>
            </div>

            {/* Working Hours */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Working Hours
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border">
                      <th className="text-left pb-2 font-medium">Day</th>
                      <th className="text-left pb-2 font-medium">Open</th>
                      <th className="text-left pb-2 font-medium">Close</th>
                      <th className="text-center pb-2 font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {workingHours.map((row, idx) => (
                      <tr
                        key={row.day}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2.5 pr-4 font-medium text-foreground w-32">
                          {row.day}
                        </td>
                        <td className="py-2.5 pr-3">
                          <select
                            value={row.open}
                            onChange={(e) =>
                              updateWorkingHours(idx, "open", e.target.value)
                            }
                            disabled={!row.enabled}
                            data-ocid={`admin.settings.hours.open.${idx + 1}`}
                            className="h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {TIME_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 pr-4">
                          <select
                            value={row.close}
                            onChange={(e) =>
                              updateWorkingHours(idx, "close", e.target.value)
                            }
                            disabled={!row.enabled}
                            data-ocid={`admin.settings.hours.close.${idx + 1}`}
                            className="h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {TIME_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 text-center">
                          <Switch
                            checked={row.enabled}
                            onCheckedChange={(v) =>
                              updateWorkingHours(idx, "enabled", v)
                            }
                            data-ocid={`admin.settings.hours.enabled.${idx + 1}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => handleSave("Working Hours")}
                  data-ocid="admin.settings.hours.save_button"
                >
                  <Save className="w-4 h-4" /> Save Hours
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ NOTIFICATIONS TAB ═══════════════ */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Notification Channels
                </h3>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Appointment Reminders
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      key: "apptReminderSms",
                      label: "SMS Reminders",
                      badge: "SMS",
                    },
                    {
                      key: "apptReminderEmail",
                      label: "Email Reminders",
                      badge: "Email",
                    },
                    {
                      key: "apptReminderWhatsapp",
                      label: "WhatsApp Reminders",
                      badge: "WhatsApp",
                    },
                  ] as const
                ).map(({ key, label, badge }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 mr-3">
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {badge}
                      </Badge>
                    </div>
                    <Switch
                      checked={notifChannels[key]}
                      onCheckedChange={(v) =>
                        setNotifChannels((p) => ({ ...p, [key]: v }))
                      }
                      data-ocid={`admin.settings.notif.appt_${key}_toggle`}
                    />
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Alert Types
              </p>
              {(
                [
                  {
                    key: "medicineRefill",
                    label: "Medicine Refill Alerts",
                    desc: "Remind patients when prescriptions are due for refill",
                  },
                  {
                    key: "labReportReady",
                    label: "Lab Report Ready Alerts",
                    desc: "Notify patients and doctors when lab results are uploaded",
                  },
                  {
                    key: "billingReminders",
                    label: "Billing Reminders",
                    desc: "Send payment due reminders to patients",
                  },
                  {
                    key: "doctorFollowup",
                    label: "Doctor Follow-up Alerts",
                    desc: "Alert doctors about scheduled follow-ups and missed appointments",
                  },
                ] as const
              ).map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 mr-4 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {desc}
                    </p>
                  </div>
                  <Switch
                    checked={notifChannels[key]}
                    onCheckedChange={(v) =>
                      setNotifChannels((p) => ({ ...p, [key]: v }))
                    }
                    data-ocid={`admin.settings.notif.${key}_toggle`}
                  />
                </div>
              ))}
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Default Reminder Lead Time
                </Label>
                <select
                  value={reminderLeadTime}
                  onChange={(e) => setReminderLeadTime(e.target.value)}
                  data-ocid="admin.settings.notif.lead_time_select"
                  className="w-full sm:w-64 h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="1h">1 hour before</option>
                  <option value="2h">2 hours before</option>
                  <option value="24h">24 hours before</option>
                  <option value="48h">48 hours before</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => handleSave("Notifications")}
                  data-ocid="admin.settings.notif.save_button"
                >
                  <Save className="w-4 h-4" /> Save Notifications
                </Button>
              </div>
            </div>

            {/* Per-Role Matrix */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Per-Role Notification Settings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[420px]">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border">
                      <th className="text-left pb-2 font-medium">Role</th>
                      <th className="text-center pb-2 font-medium">SMS</th>
                      <th className="text-center pb-2 font-medium">Email</th>
                      <th className="text-center pb-2 font-medium">In-App</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {roleNotifs.map((row, idx) => (
                      <tr
                        key={row.role}
                        className="hover:bg-muted/20 transition-colors"
                        data-ocid={`admin.settings.role_notif.item.${idx + 1}`}
                      >
                        <td className="py-3 pr-4 font-medium text-foreground">
                          {row.role}
                        </td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={row.sms}
                            onCheckedChange={() => toggleRoleField(idx, "sms")}
                            data-ocid={`admin.settings.role_notif.sms.${idx + 1}`}
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={row.email}
                            onCheckedChange={() =>
                              toggleRoleField(idx, "email")
                            }
                            data-ocid={`admin.settings.role_notif.email.${idx + 1}`}
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={row.inApp}
                            onCheckedChange={() =>
                              toggleRoleField(idx, "inApp")
                            }
                            data-ocid={`admin.settings.role_notif.inapp.${idx + 1}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => handleSave("Role Notifications")}
                  data-ocid="admin.settings.role_notif.save_button"
                >
                  <Save className="w-4 h-4" /> Save Role Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ CRM CONTROLS TAB ═══════════════ */}
        <TabsContent value="crm">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Lead Source Channels
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    {
                      key: "facebook",
                      label: "Facebook",
                      desc: "Capture leads from Facebook Ads and pages",
                      badge: "Social",
                    },
                    {
                      key: "instagram",
                      label: "Instagram",
                      desc: "Capture leads from Instagram profiles and ads",
                      badge: "Social",
                    },
                    {
                      key: "manual",
                      label: "Manual Entry",
                      desc: "Leads entered manually by the sales team",
                      badge: "Internal",
                    },
                    {
                      key: "walkin",
                      label: "Walk-in",
                      desc: "Walk-in patients registered at the front desk",
                      badge: "Internal",
                    },
                    {
                      key: "referral",
                      label: "Referral",
                      desc: "Leads referred by existing patients or partners",
                      badge: "Referral",
                    },
                  ] as const
                ).map(({ key, label, desc, badge }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0 mr-4 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {label}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {desc}
                      </p>
                    </div>
                    <Switch
                      checked={leadSources[key]}
                      onCheckedChange={(v) =>
                        setLeadSources((p) => ({ ...p, [key]: v }))
                      }
                      data-ocid={`admin.settings.leads.${key}_toggle`}
                    />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 mr-4 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Auto-Assign Leads
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatically distribute new leads to sales staff in
                    round-robin rotation
                  </p>
                </div>
                <Switch
                  checked={autoAssignLeads}
                  onCheckedChange={setAutoAssignLeads}
                  data-ocid="admin.settings.crm.auto_assign_toggle"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Appointment Slot Duration
                  </Label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    data-ocid="admin.settings.crm.slot_duration_select"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Queue Management Mode
                  </Label>
                  <select
                    value={queueMode}
                    onChange={(e) => setQueueMode(e.target.value)}
                    data-ocid="admin.settings.crm.queue_mode_select"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="token">Token-Based Queue</option>
                    <option value="timeslot">Time-Slot Based Queue</option>
                  </select>
                </div>
              </div>
              <Separator />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Feature Flags
              </p>
              {(
                [
                  {
                    key: "analyticsForDoctors",
                    label: "Show Analytics to Doctors",
                    desc: "Allow doctors to view patient analytics and department performance",
                  },
                  {
                    key: "patientSelfBooking",
                    label: "Allow Patient Self-Booking",
                    desc: "Enable patients to book appointments via the patient portal",
                  },
                  {
                    key: "labReportViewer",
                    label: "Enable Lab Report Viewer",
                    desc: "Show lab PDF report viewer to patients in the patient portal",
                  },
                ] as const
              ).map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 mr-4 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {desc}
                    </p>
                  </div>
                  <Switch
                    checked={featureFlags[key]}
                    onCheckedChange={(v) =>
                      setFeatureFlags((p) => ({ ...p, [key]: v }))
                    }
                    data-ocid={`admin.settings.flags.${key}_toggle`}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => handleSave("CRM Controls")}
                  data-ocid="admin.settings.crm.save_button"
                >
                  <Save className="w-4 h-4" /> Save CRM Controls
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ SECURITY TAB ═══════════════ */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Access &amp; Authentication
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Session Timeout</Label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    data-ocid="admin.settings.security.session_timeout_select"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Password Policy</Label>
                  <select
                    value={passwordPolicy}
                    onChange={(e) => setPasswordPolicy(e.target.value)}
                    data-ocid="admin.settings.security.password_policy_select"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="standard">Standard (6+ chars)</option>
                    <option value="strong">
                      Strong (8+ chars, mixed case)
                    </option>
                    <option value="very_strong">
                      Very Strong (12+ chars, symbols)
                    </option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Audit Log Retention
                  </Label>
                  <select
                    value={auditRetention}
                    onChange={(e) => setAuditRetention(e.target.value)}
                    data-ocid="admin.settings.security.audit_retention_select"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 mr-4 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Two-Factor Authentication
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Require all staff to verify with an authenticator app at
                    login (UI only)
                  </p>
                </div>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                  data-ocid="admin.settings.security.twofa_toggle"
                />
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label htmlFor="ip-whitelist" className="text-sm font-medium">
                  IP Whitelist
                </Label>
                <Textarea
                  id="ip-whitelist"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder={
                    "Enter allowed IP addresses, one per line\n192.168.1.0/24\n203.0.113.42"
                  }
                  rows={4}
                  data-ocid="admin.settings.security.ip_whitelist_input"
                  className="font-mono text-xs resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to allow access from all IPs.
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => handleSave("Security")}
                  data-ocid="admin.settings.security.save_button"
                >
                  <Save className="w-4 h-4" /> Save Security Settings
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">
                  Danger Zone
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Resetting all settings will restore every configuration option
                to factory defaults. This action cannot be undone.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={() => setShowResetDialog(true)}
                data-ocid="admin.settings.danger.reset_button"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Settings
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent data-ocid="admin.settings.reset.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="w-5 h-5 text-destructive" /> Confirm
              Reset
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all settings to factory defaults?
              All custom configurations including working hours, notification
              rules, and CRM controls will be permanently erased.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              data-ocid="admin.settings.reset.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleResetAll}
              data-ocid="admin.settings.reset.confirm_button"
            >
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
