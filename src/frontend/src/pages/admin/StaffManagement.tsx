import { PageHeader } from "@/components/shared/PageHeader";
import { MOCK_STAFF } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { Department } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ChevronDown,
  Pencil,
  Plus,
  Search,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type StaffFormData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  schedule: string;
  startDate: string;
  status: "active" | "inactive";
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  role: yup.string().required("Role is required"),
  department: yup.string().required("Department is required"),
  schedule: yup.string().required("Schedule is required"),
  startDate: yup.string().required("Start date is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required() as yup.StringSchema<"active" | "inactive">,
});

const ROLE_COLORS: Record<string, string> = {
  doctor: "bg-blue-100 text-blue-700",
  receptionist: "bg-teal-100 text-teal-700",
  sales: "bg-purple-100 text-purple-700",
  lab_staff: "bg-orange-100 text-orange-700",
  pharmacist: "bg-green-100 text-green-700",
};

const ROLE_AVATAR_BG: Record<string, string> = {
  doctor: "bg-blue-200 text-blue-800",
  receptionist: "bg-teal-200 text-teal-800",
  sales: "bg-purple-200 text-purple-800",
  lab_staff: "bg-orange-200 text-orange-800",
  pharmacist: "bg-green-200 text-green-800",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function StaffManagement() {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "active",
      department: "PMR",
      schedule: "Morning",
      role: "doctor",
    },
  });

  const filtered = useMemo(
    () =>
      staffList.filter((s) => {
        const matchSearch =
          search === "" ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase());
        const matchRole =
          filterRole === "" ||
          (s.role || "").toLowerCase().replace(" ", "_") === filterRole;
        const matchDept = filterDept === "" || s.department === filterDept;
        return matchSearch && matchRole && matchDept;
      }),
    [staffList, search, filterRole, filterDept],
  );

  const stats = useMemo(
    () => ({
      total: staffList.length,
      active: staffList.filter((s) => s.status === "active").length,
      inactive: staffList.filter((s) => s.status !== "active").length,
      doctors: staffList.filter(
        (s) => (s.role || "").toLowerCase() === "doctor",
      ).length,
    }),
    [staffList],
  );

  function openCreate() {
    setEditingId(null);
    reset({
      status: "active",
      department: "PMR",
      schedule: "Morning",
      role: "doctor",
    });
    setPanelOpen(true);
  }

  function openEdit(staff: (typeof MOCK_STAFF)[0]) {
    setEditingId(staff.id);
    reset({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      role: (staff.role || "doctor").toLowerCase().replace(" ", "_"),
      department: staff.department || "PMR",
      schedule:
        ((staff as unknown as Record<string, unknown>).schedule as string) ||
        "Morning",
      startDate:
        ((staff as unknown as Record<string, unknown>).startDate as string) ||
        "",
      status: (staff.status === "active" ? "active" : "inactive") as
        | "active"
        | "inactive",
    });
    setPanelOpen(true);
  }

  function toggleStatus(id: string) {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s,
      ),
    );
    toast.success("Staff status updated");
  }

  function onSubmit(data: StaffFormData) {
    if (editingId) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, ...data, department: data.department as Department }
            : s,
        ),
      );
      toast.success("Staff member updated successfully");
    } else {
      const newStaff = {
        id: `staff-${Date.now()}`,
        ...data,
        avatar: "",
        joinDate: new Date().toISOString(),
      };
      setStaffList((prev) => [...prev, newStaff as (typeof MOCK_STAFF)[0]]);
      toast.success("New staff member added successfully");
    }
    setPanelOpen(false);
  }

  return (
    <div className="relative">
      <PageHeader
        title="Staff Management"
        subtitle="Create, view, and manage all clinic staff"
        actions={
          <button
            type="button"
            onClick={openCreate}
            data-ocid="staff.add_button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Staff
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Staff",
            value: stats.total,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Active",
            value: stats.active,
            icon: UserCheck,
            color: "text-green-600",
          },
          {
            label: "Inactive",
            value: stats.inactive,
            icon: UserX,
            color: "text-red-500",
          },
          {
            label: "Doctors",
            value: stats.doctors,
            icon: Users,
            color: "text-blue-600",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
          >
            <div className={cn("p-2 rounded-lg bg-muted", s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            data-ocid="staff.search_input"
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            data-ocid="staff.role_select"
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="sales">Sales</option>
            <option value="lab_staff">Lab Staff</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            data-ocid="staff.dept_select"
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Departments</option>
            <option value="PMR">PMR</option>
            <option value="General">General</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Staff
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Department
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Phone
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((s, i) => {
                  const roleKey = (s.role || "doctor")
                    .toLowerCase()
                    .replace(" ", "_");
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                      data-ocid={`staff.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold",
                              ROLE_AVATAR_BG[roleKey] ||
                                "bg-muted text-muted-foreground",
                            )}
                          >
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {s.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            ROLE_COLORS[roleKey] ||
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {s.role || "Staff"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {s.department || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.phone || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            s.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700",
                          )}
                        >
                          {s.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            data-ocid={`staff.edit_button.${i + 1}`}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(s.id)}
                            data-ocid={`staff.toggle.${i + 1}`}
                            className={cn(
                              "p-1.5 rounded-lg hover:bg-muted transition-colors",
                              s.status === "active"
                                ? "text-red-500"
                                : "text-green-600",
                            )}
                            title={
                              s.status === "active" ? "Deactivate" : "Activate"
                            }
                          >
                            {s.status === "active" ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="staff.empty_state"
                  >
                    No staff found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
            data-ocid="staff.dialog"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                {editingId ? "Edit Staff Member" : "Add New Staff"}
              </h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                data-ocid="staff.close_button"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {[
                {
                  label: "Full Name",
                  id: "name" as const,
                  type: "text",
                  placeholder: "Dr. John Smith",
                },
                {
                  label: "Email Address",
                  id: "email" as const,
                  type: "email",
                  placeholder: "john@clinic.com",
                },
                {
                  label: "Phone Number",
                  id: "phone" as const,
                  type: "text",
                  placeholder: "+91 98765 43210",
                },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    {f.label}
                  </label>
                  <input
                    {...register(f.id)}
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    data-ocid={`staff.${f.id}_input`}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {errors[f.id] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[f.id]?.message}
                    </p>
                  )}
                </div>
              ))}
              {[
                {
                  label: "Role",
                  id: "role" as const,
                  options: [
                    ["doctor", "Doctor"],
                    ["receptionist", "Receptionist"],
                    ["sales", "Sales"],
                    ["lab_staff", "Lab Staff"],
                    ["pharmacist", "Pharmacist"],
                  ],
                },
                {
                  label: "Department",
                  id: "department" as const,
                  options: [
                    ["PMR", "PMR Department"],
                    ["General", "General/Other"],
                    ["Both", "Both"],
                  ],
                },
                {
                  label: "Schedule",
                  id: "schedule" as const,
                  options: [
                    ["Morning", "Morning"],
                    ["Evening", "Evening"],
                    ["Night", "Night"],
                  ],
                },
                {
                  label: "Status",
                  id: "status" as const,
                  options: [
                    ["active", "Active"],
                    ["inactive", "Inactive"],
                  ],
                },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    {f.label}
                  </label>
                  <select
                    {...register(f.id)}
                    id={f.id}
                    data-ocid={`staff.${f.id}_select`}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {f.options.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Start Date
                </label>
                <input
                  {...register("startDate")}
                  id="startDate"
                  type="date"
                  data-ocid="staff.startdate_input"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  data-ocid="staff.submit_button"
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Save Changes" : "Add Staff Member"}
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  data-ocid="staff.cancel_button"
                  className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StaffManagement;
