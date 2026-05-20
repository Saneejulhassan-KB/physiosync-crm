import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { MOCK_PERMISSIONS } from "@/lib/mockData";
import type {
  FunctionKey,
  PageKey,
  PermissionsMap,
  RoleName,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, RotateCcw, Save, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type UserRole = RoleName;

interface PermRow {
  module: string;
  action: string;
  permissions: Partial<Record<UserRole, boolean>>;
}

const _INITIAL_PERMS: PermRow[] = [
  {
    module: "Dashboard",
    action: "View Overview",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: true,
      sales: true,
      patient: true,
    },
  },
  {
    module: "Dashboard",
    action: "View Revenue Analytics",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: true,
      patient: false,
    },
  },
  {
    module: "Patients",
    action: "View Patient List",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Patients",
    action: "Create / Register Patient",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Patients",
    action: "Edit Patient Details",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Appointments",
    action: "View All Appointments",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Appointments",
    action: "Book Appointment",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: true,
      sales: false,
      patient: true,
    },
  },
  {
    module: "Appointments",
    action: "Cancel Appointment",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: true,
      sales: false,
      patient: true,
    },
  },
  {
    module: "Leads",
    action: "View Leads",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: true,
      patient: false,
    },
  },
  {
    module: "Leads",
    action: "Create Lead",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: true,
      patient: false,
    },
  },
  {
    module: "Leads",
    action: "Convert Lead",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: true,
      patient: false,
    },
  },
  {
    module: "Laboratory",
    action: "View Lab Reports",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: false,
      sales: false,
      patient: true,
    },
  },
  {
    module: "Laboratory",
    action: "Upload Lab Reports",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Pharmacy",
    action: "View Prescriptions",
    permissions: {
      super_admin: true,
      doctor: true,
      receptionist: false,
      sales: false,
      patient: true,
    },
  },
  {
    module: "Pharmacy",
    action: "Manage Inventory",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Billing",
    action: "View Invoices",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: true,
      sales: false,
      patient: true,
    },
  },
  {
    module: "Billing",
    action: "Create Invoice",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: true,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Staff",
    action: "View Staff List",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Staff",
    action: "Create / Edit Staff",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Settings",
    action: "CRM Settings",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Audit",
    action: "View Audit Logs",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
  {
    module: "Analytics",
    action: "View Full Analytics",
    permissions: {
      super_admin: true,
      doctor: false,
      receptionist: false,
      sales: false,
      patient: false,
    },
  },
];

// ── Types ──────────────────────────────────────────────────────────────────
type PermissionsState = Record<
  RoleName,
  Record<PageKey, Record<FunctionKey, boolean>>
>;

// ── Constants ─────────────────────────────────────────────────────────────
const ROLES_CONFIG: { id: RoleName; label: string; badgeCls: string }[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    badgeCls:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
  },
  {
    id: "doctor",
    label: "Doctor",
    badgeCls:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    badgeCls:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
  },
  {
    id: "sales",
    label: "Sales",
    badgeCls:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  },
  {
    id: "lab_staff",
    label: "Lab Staff",
    badgeCls:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
  },
  {
    id: "pharmacist",
    label: "Pharmacist",
    badgeCls:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
  },
  {
    id: "patient",
    label: "Patient",
    badgeCls: "bg-muted text-muted-foreground border-border",
  },
];

const FUNCTIONS: FunctionKey[] = ["view", "create", "edit", "delete"];

const PAGE_GROUPS: {
  label: string;
  pages: { key: PageKey; label: string }[];
}[] = [
  {
    label: "Overview",
    pages: [
      { key: "dashboard", label: "Dashboard" },
      { key: "analytics", label: "Analytics" },
      { key: "audit_logs", label: "Audit Logs" },
    ],
  },
  {
    label: "Patient Care",
    pages: [
      { key: "patients", label: "Patients" },
      { key: "appointments", label: "Appointments" },
      { key: "laboratory", label: "Laboratory" },
      { key: "pharmacy", label: "Pharmacy" },
    ],
  },
  {
    label: "CRM",
    pages: [
      { key: "leads", label: "Leads" },
      { key: "sales_mgmt", label: "Sales Mgmt" },
      { key: "reception_mgmt", label: "Reception Mgmt" },
    ],
  },
  {
    label: "Finance",
    pages: [
      { key: "billing", label: "Billing" },
      { key: "reports", label: "Reports" },
    ],
  },
  {
    label: "System",
    pages: [
      { key: "staff", label: "Staff" },
      { key: "lab_mgmt", label: "Lab Mgmt" },
      { key: "settings", label: "Settings" },
      { key: "permissions", label: "Permissions" },
    ],
  },
];

function buildDefaultPermissions(): PermissionsState {
  const all = (): Record<FunctionKey, boolean> => ({
    view: true,
    create: true,
    edit: true,
    delete: true,
  });
  const view = (): Record<FunctionKey, boolean> => ({
    view: true,
    create: false,
    edit: false,
    delete: false,
  });
  const none = (): Record<FunctionKey, boolean> => ({
    view: false,
    create: false,
    edit: false,
    delete: false,
  });
  const sa: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: all(),
    analytics: all(),
    audit_logs: all(),
    patients: all(),
    appointments: all(),
    laboratory: all(),
    pharmacy: all(),
    leads: all(),
    sales_mgmt: all(),
    reception_mgmt: all(),
    billing: all(),
    reports: all(),
    staff: all(),
    lab_mgmt: all(),
    settings: all(),
    permissions: all(),
  };
  const doctor: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: view(),
    audit_logs: none(),
    patients: { view: true, create: false, edit: true, delete: false },
    appointments: { view: true, create: true, edit: true, delete: false },
    laboratory: view(),
    pharmacy: view(),
    leads: none(),
    sales_mgmt: none(),
    reception_mgmt: none(),
    billing: view(),
    reports: view(),
    staff: none(),
    lab_mgmt: none(),
    settings: none(),
    permissions: none(),
  };
  const receptionist: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: none(),
    audit_logs: none(),
    patients: { view: true, create: true, edit: true, delete: false },
    appointments: { view: true, create: true, edit: true, delete: true },
    laboratory: { view: true, create: true, edit: false, delete: false },
    pharmacy: view(),
    leads: none(),
    sales_mgmt: none(),
    reception_mgmt: view(),
    billing: { view: true, create: true, edit: false, delete: false },
    reports: view(),
    staff: none(),
    lab_mgmt: none(),
    settings: none(),
    permissions: none(),
  };
  const sales: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: view(),
    audit_logs: none(),
    patients: view(),
    appointments: view(),
    laboratory: none(),
    pharmacy: none(),
    leads: { view: true, create: true, edit: true, delete: false },
    sales_mgmt: { view: true, create: true, edit: true, delete: false },
    reception_mgmt: none(),
    billing: none(),
    reports: view(),
    staff: none(),
    lab_mgmt: none(),
    settings: none(),
    permissions: none(),
  };
  const lab: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: none(),
    audit_logs: none(),
    patients: view(),
    appointments: view(),
    laboratory: { view: true, create: true, edit: true, delete: false },
    pharmacy: none(),
    leads: none(),
    sales_mgmt: none(),
    reception_mgmt: none(),
    billing: none(),
    reports: view(),
    staff: none(),
    lab_mgmt: { view: true, create: true, edit: true, delete: false },
    settings: none(),
    permissions: none(),
  };
  const pharmacist: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: none(),
    audit_logs: none(),
    patients: view(),
    appointments: view(),
    laboratory: view(),
    pharmacy: { view: true, create: true, edit: true, delete: false },
    leads: none(),
    sales_mgmt: none(),
    reception_mgmt: none(),
    billing: { view: true, create: true, edit: false, delete: false },
    reports: view(),
    staff: none(),
    lab_mgmt: none(),
    settings: none(),
    permissions: none(),
  };
  const patient: Record<PageKey, Record<FunctionKey, boolean>> = {
    dashboard: view(),
    analytics: none(),
    audit_logs: none(),
    patients: view(),
    appointments: { view: true, create: true, edit: false, delete: false },
    laboratory: view(),
    pharmacy: view(),
    leads: none(),
    sales_mgmt: none(),
    reception_mgmt: none(),
    billing: view(),
    reports: none(),
    staff: none(),
    lab_mgmt: none(),
    settings: none(),
    permissions: none(),
  };
  return {
    super_admin: sa,
    doctor,
    receptionist,
    sales,
    lab_staff: lab,
    pharmacist,
    patient,
  };
}

const DEFAULTS = buildDefaultPermissions();
function deepClone(p: PermissionsState): PermissionsState {
  return JSON.parse(JSON.stringify(p)) as PermissionsState;
}
function isDirty(a: PermissionsState, b: PermissionsState): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function PermCell({
  checked,
  disabled,
  onChange,
  ocid,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
  ocid: string;
}) {
  return (
    <td className="px-1 py-1.5 text-center" data-ocid={ocid}>
      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        aria-checked={checked}
        aria-label={checked ? "Revoke permission" : "Grant permission"}
        className={cn(
          "inline-flex items-center justify-center w-5 h-5 rounded border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:scale-110",
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-background border-input hover:border-primary/60",
        )}
      >
        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
      </button>
    </td>
  );
}

export default function AdminPermissions() {
  const [perms, setPerms] = useState<PermissionsState>(() =>
    deepClone(DEFAULTS),
  );
  const dirty = useMemo(() => isDirty(perms, DEFAULTS), [perms]);

  const toggle = useCallback(
    (role: RoleName, page: PageKey, fn: FunctionKey) => {
      if (role === "super_admin") return;
      setPerms((prev) => {
        const next = deepClone(prev);
        next[role][page][fn] = !next[role][page][fn];
        return next;
      });
    },
    [],
  );

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="Role & Permission Management"
        subtitle="Configure which roles can view, create, edit or delete each module"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPerms(deepClone(DEFAULTS));
                toast.info("Permissions reset to defaults");
              }}
              data-ocid="admin.permissions.reset_button"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset to Defaults
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                toast.success("Permissions saved successfully", {
                  description: "Role access settings have been updated.",
                })
              }
              data-ocid="admin.permissions.save_button"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Changes
            </Button>
          </div>
        }
      />

      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300 text-sm font-medium"
            data-ocid="admin.permissions.unsaved_banner"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            You have unsaved changes — click Save Changes to apply.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th
                  rowSpan={2}
                  className="sticky left-0 z-10 bg-muted/80 border-r border-border px-3 py-3 text-left text-xs font-semibold text-muted-foreground min-w-[140px] align-bottom"
                >
                  Module / Page
                </th>
                {ROLES_CONFIG.map((role) => (
                  <th
                    key={role.id}
                    colSpan={4}
                    className="px-1 py-2 text-center border-r border-border last:border-r-0"
                  >
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide whitespace-nowrap",
                        role.badgeCls,
                      )}
                    >
                      {role.label}
                    </span>
                  </th>
                ))}
              </tr>
              <tr className="bg-muted/40 border-b-2 border-border">
                {ROLES_CONFIG.map((role) =>
                  FUNCTIONS.map((fn) => (
                    <th
                      key={`${role.id}-${fn}`}
                      className={cn(
                        "px-1 py-1.5 text-center font-medium text-muted-foreground capitalize whitespace-nowrap",
                        fn === "delete" && "border-r border-border",
                      )}
                    >
                      {fn.charAt(0).toUpperCase() + fn.slice(1)}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {PAGE_GROUPS.map((group, gi) => (
                <>
                  <tr
                    key={`grp-${group.label}`}
                    className="bg-primary/5 border-y border-border"
                  >
                    <td
                      colSpan={1 + ROLES_CONFIG.length * 4}
                      className="sticky left-0 px-3 py-1.5 text-[11px] font-bold text-primary uppercase tracking-widest"
                    >
                      {group.label}
                    </td>
                  </tr>
                  {group.pages.map((page, pi) => (
                    <motion.tr
                      key={page.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: gi * 0.05 + pi * 0.02 }}
                      className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.permissions.row.${gi + 1}.${pi + 1}`}
                    >
                      <td className="sticky left-0 z-10 bg-card/95 border-r border-border px-3 py-2 font-medium text-foreground whitespace-nowrap">
                        {page.label}
                      </td>
                      {ROLES_CONFIG.map((role) =>
                        FUNCTIONS.map((fn) => (
                          <PermCell
                            key={`${role.id}-${fn}`}
                            checked={perms[role.id][page.key][fn]}
                            disabled={role.id === "super_admin"}
                            onChange={() => toggle(role.id, page.key, fn)}
                            ocid={`admin.permissions.${page.key}.${role.id}.${fn}`}
                          />
                        )),
                      )}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-primary bg-primary text-primary-foreground">
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </span>
            Access granted
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex w-4 h-4 rounded border border-input bg-background" />
            Access denied
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-primary/40 bg-primary/40 opacity-40">
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </span>
            Super Admin (locked)
          </div>
          <span className="ml-auto hidden sm:block">
            {ROLES_CONFIG.length} roles ·{" "}
            {PAGE_GROUPS.reduce((a, g) => a + g.pages.length, 0)} pages · 4
            functions each
          </span>
        </div>
      </motion.div>
    </div>
  );
}
