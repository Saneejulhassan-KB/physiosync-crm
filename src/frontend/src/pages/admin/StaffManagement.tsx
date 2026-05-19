import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_DOCTORS, MOCK_STAFF } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { Department } from "@/types";
import {
  Award,
  Building2,
  ChevronDown,
  Download,
  Edit,
  Filter,
  Mail,
  Phone,
  Plus,
  Search,
  Star,
  TrendingUp,
  UserCheck,
  UserCog,
  UserX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type StaffStatus = "active" | "inactive" | "on_leave";

interface EnrichedStaff {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  phone: string;
  joinDate: string;
  status: StaffStatus;
  appointmentsThisMonth: number;
  revenueGenerated: number;
  satisfactionRating: number;
  schedule: string[];
  specialization?: string;
}

// Enrich MOCK_STAFF with performance data
const ENRICHED_STAFF: EnrichedStaff[] = [
  ...MOCK_STAFF.map((s, i) => ({
    ...s,
    status: s.status as StaffStatus,
    appointmentsThisMonth: [42, 18, 12, 35, 8][i] ?? 20,
    revenueGenerated: [18400, 5200, 3800, 14200, 2800][i] ?? 5000,
    satisfactionRating: [4.8, 4.6, 4.9, 4.7, 4.5][i] ?? 4.5,
    schedule: [
      ["Mon", "Tue", "Wed", "Thu", "Fri"],
      ["Mon", "Wed", "Fri"],
      ["Tue", "Thu", "Sat"],
      ["Mon", "Tue", "Wed", "Thu", "Fri"],
      ["Mon", "Tue", "Wed", "Thu"],
    ][i] ?? ["Mon", "Tue", "Wed"],
  })),
  ...MOCK_DOCTORS.map((d, i) => ({
    id: d.id,
    name: d.name,
    role: "Doctor",
    department: d.department,
    email: d.email,
    phone: d.phone,
    joinDate:
      ["2020-03-01", "2022-01-15", "2019-07-01", "2021-06-01", "2023-02-01"][
        i
      ] ?? "2022-01-01",
    status: "active" as StaffStatus,
    appointmentsThisMonth: d.patientsCount,
    revenueGenerated: d.patientsCount * 380,
    satisfactionRating: d.rating,
    schedule: d.availability,
    specialization: d.specialization,
  })),
];

const STATUS_CONFIG: Record<
  StaffStatus,
  { label: string; className: string; icon: typeof UserCheck }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    icon: UserCheck,
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border border-border",
    icon: UserX,
  },
  on_leave: {
    label: "On Leave",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    icon: UserCog,
  },
};

interface StaffFormData {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
}

function StaffProfileModal({
  staff,
  onClose,
}: { staff: EnrichedStaff; onClose: () => void }) {
  const perfData = [
    {
      name: "Satisfaction",
      value: staff.satisfactionRating * 20,
      fill: "oklch(0.42 0.18 250)",
    },
  ];

  return (
    <DialogContent
      className="max-w-2xl overflow-y-auto max-h-[90vh]"
      data-ocid="staff.profile_dialog"
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-display">
          Staff Profile
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5">
        {/* Header card */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {staff.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {staff.specialization ?? staff.role}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  STATUS_CONFIG[staff.status].className,
                )}
              >
                {STATUS_CONFIG[staff.status].label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                {staff.department} Dept
              </span>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Appts This Month",
              value: staff.appointmentsThisMonth,
              icon: TrendingUp,
              color: "text-primary",
            },
            {
              label: "Revenue Generated",
              value: `$${staff.revenueGenerated.toLocaleString()}`,
              icon: Award,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Satisfaction",
              value: `${staff.satisfactionRating}/5`,
              icon: Star,
              color: "text-amber-500",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl border border-border bg-card text-center"
            >
              <m.icon className={cn("w-5 h-5 mx-auto mb-1", m.color)} />
              <p className={cn("text-lg font-bold", m.color)}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Satisfaction radial */}
        <div className="flex items-center gap-5 p-4 rounded-xl border border-border bg-card">
          <div className="w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={perfData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={4} />
                <Tooltip
                  formatter={(v: number) => [
                    `${(v / 20).toFixed(1)}/5`,
                    "Rating",
                  ]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {staff.satisfactionRating} / 5.0
            </p>
            <p className="text-xs text-muted-foreground">
              Patient Satisfaction Score
            </p>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= Math.round(staff.satisfactionRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contact + Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">
                {staff.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">{staff.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                {staff.department} Department
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Schedule
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span
                  key={day}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-md font-medium",
                    staff.schedule.includes(day)
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "bg-muted text-muted-foreground border border-border",
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Joined{" "}
              {new Date(staff.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          data-ocid="staff.profile_close_button"
        >
          Close
        </Button>
        <Button type="button" data-ocid="staff.profile_edit_button">
          <Edit className="w-4 h-4 mr-2" />
          Edit Staff
        </Button>
      </div>
    </DialogContent>
  );
}

function StaffFormModal({
  staff,
  onClose,
}: { staff?: EnrichedStaff | null; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormData>({
    defaultValues: staff
      ? {
          name: staff.name,
          role: staff.role,
          department: staff.department,
          email: staff.email,
          phone: staff.phone,
          status: staff.status,
        }
      : {},
  });

  const onSubmit = (data: StaffFormData) => {
    console.log("Staff form submit:", data);
    onClose();
  };

  return (
    <DialogContent className="max-w-lg" data-ocid="staff.form_dialog">
      <DialogHeader>
        <DialogTitle className="font-display">
          {staff ? "Edit Staff Member" : "Add New Staff"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              data-ocid="staff.name_input"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              {...register("role", { required: true })}
              data-ocid="staff.role_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dept">Department</Label>
            <Input
              id="dept"
              {...register("department", { required: true })}
              data-ocid="staff.department_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true })}
              data-ocid="staff.email_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              data-ocid="staff.phone_input"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="staff.form_cancel_button"
          >
            Cancel
          </Button>
          <Button type="submit" data-ocid="staff.form_submit_button">
            {staff ? "Save Changes" : "Add Staff"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default function StaffManagement() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Dashboard", href: "/admin" },
        { label: "Staff Management" },
      ]),
    [setBreadcrumb],
  );

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<EnrichedStaff | null>(
    null,
  );
  const [editStaff, setEditStaff] = useState<EnrichedStaff | null | undefined>(
    undefined,
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const roles = useMemo(
    () => Array.from(new Set(ENRICHED_STAFF.map((s) => s.role))),
    [],
  );

  const filtered = useMemo(
    () =>
      ENRICHED_STAFF.filter((s) => {
        const matchSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.role.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "all" || s.department === deptFilter;
        const matchRole = roleFilter === "all" || s.role === roleFilter;
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchSearch && matchDept && matchRole && matchStatus;
      }),
    [search, deptFilter, roleFilter, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: ENRICHED_STAFF.length,
      active: ENRICHED_STAFF.filter((s) => s.status === "active").length,
      onLeave: ENRICHED_STAFF.filter((s) => s.status === "on_leave").length,
      doctors: ENRICHED_STAFF.filter((s) => s.role === "Doctor").length,
    }),
    [],
  );

  return (
    <div className="space-y-6" data-ocid="staff.page">
      <PageHeader
        title="Staff Management"
        subtitle="Manage clinical and administrative staff across all departments"
        actions={
          <Button
            onClick={() => setShowAddModal(true)}
            data-ocid="staff.add_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Staff",
            value: stats.total,
            color: "text-foreground",
          },
          {
            label: "Active",
            value: stats.active,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          { label: "On Leave", value: stats.onLeave, color: "text-amber-600" },
          { label: "Doctors", value: stats.doctors, color: "text-primary" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4 shadow-elevation-subtle"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn("text-3xl font-bold font-display mt-1", s.color)}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="staff.search_input"
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-36" data-ocid="staff.dept_filter">
            <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="PMR">PMR</SelectItem>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36" data-ocid="staff.role_filter">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36" data-ocid="staff.status_filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="staff.export_button"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Staff Member",
                  "Role",
                  "Department",
                  "Appts/Month",
                  "Revenue",
                  "Rating",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filtered.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedStaff(s)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    data-ocid={`staff.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {s.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.role}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {s.department}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {s.appointmentsThisMonth}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      ${s.revenueGenerated.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-medium text-foreground">
                          {s.satisfactionRating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          STATUS_CONFIG[s.status].className,
                        )}
                      >
                        {STATUS_CONFIG[s.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditStaff(s);
                        }}
                        data-ocid={`staff.edit_button.${i + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                    data-ocid="staff.empty_state"
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Profile modal */}
      <Dialog
        open={!!selectedStaff}
        onOpenChange={(open) => !open && setSelectedStaff(null)}
      >
        {selectedStaff && (
          <StaffProfileModal
            staff={selectedStaff}
            onClose={() => setSelectedStaff(null)}
          />
        )}
      </Dialog>

      {/* Edit/Add modal */}
      <Dialog
        open={showAddModal || editStaff !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditStaff(undefined);
          }
        }}
      >
        <StaffFormModal
          staff={editStaff ?? null}
          onClose={() => {
            setShowAddModal(false);
            setEditStaff(undefined);
          }}
        />
      </Dialog>
    </div>
  );
}
