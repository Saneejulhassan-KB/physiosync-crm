import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import type { UserRole } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  Bell,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Lock,
  PhoneCall,
  Pill,
  Receipt,
  Settings,
  Target,
  TrendingUp,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const ADMIN_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
      { icon: ClipboardCheck, label: "Audit Logs", href: "/admin/audit-logs" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: UserCog, label: "Staff", href: "/admin/staff" },
      { icon: Users, label: "Patients", href: "/admin/patients" },
      { icon: PhoneCall, label: "Reception", href: "/admin/reception" },
      { icon: BarChart2, label: "Sales Management", href: "/admin/sales-mgmt" },
      {
        icon: FlaskConical,
        label: "Lab & Pharmacy",
        href: "/admin/lab-pharmacy",
      },
    ],
  },
  {
    label: "CRM",
    items: [{ icon: Target, label: "Leads", href: "/admin/leads" }],
  },
  {
    label: "System",
    items: [
      { icon: Lock, label: "Permissions", href: "/admin/permissions" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
];

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  super_admin: [],
  // super_admin uses ADMIN_SECTIONS instead
  doctor: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/doctor" },
    { icon: Users, label: "My Patients", href: "/doctor/patients" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    { icon: Bell, label: "Notifications", href: "/doctor/notifications" },
  ],
  receptionist: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/receptionist" },
    {
      icon: Users,
      label: "Patient Registration",
      href: "/receptionist/registration",
    },
    {
      icon: Calendar,
      label: "Book Appointment",
      href: "/receptionist/appointments",
    },
    {
      icon: ClipboardList,
      label: "Queue Management",
      href: "/receptionist/queue",
    },
    { icon: CreditCard, label: "Billing", href: "/receptionist/billing" },
  ],
  sales: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/sales" },
    {
      icon: Building2,
      label: "Hospital Visits",
      href: "/sales/hospital-visit",
    },
    { icon: Dumbbell, label: "Gym Outreach", href: "/sales/gym-outreach" },
  ],
  patient: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/patient" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FlaskConical, label: "My Reports", href: "/patient/reports" },
    { icon: Pill, label: "Prescriptions", href: "/patient/prescriptions" },
    { icon: Bell, label: "Notifications", href: "/patient/notifications" },
    { icon: HeartPulse, label: "My Progress", href: "/patient/progress" },
    { icon: Receipt, label: "Billing", href: "/patient/billing" },
    { icon: User, label: "My Profile", href: "/patient/profile" },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
  sales: "Sales Executive",
  patient: "Patient",
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-accent/20 text-accent border border-accent/30",
  doctor: "bg-primary/20 text-primary border border-primary/30",
  receptionist: "bg-secondary/20 text-secondary border border-secondary/30",
  sales:
    "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  patient:
    "bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30",
};

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { currentUser } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();

  const role = currentUser?.role ?? "receptionist";
  const items = NAV_ITEMS[role];
  const isAdmin = role === "super_admin";
  const ROOT_HREFS = [
    "/admin",
    "/doctor",
    "/receptionist",
    "/sales",
    "/patient",
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive =
      location.pathname === item.href ||
      (!ROOT_HREFS.includes(item.href) &&
        location.pathname.startsWith(item.href));
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClose}
        data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <div className="absolute left-14 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-elevation-medium z-50">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-display font-bold text-lg text-sidebar-foreground whitespace-nowrap"
            >
              PhysioSync
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {isAdmin ? (
          <div className="space-y-4">
            {ADMIN_SECTIONS.map((section) => (
              <div key={section.label}>
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none"
                    >
                      {section.label}
                    </motion.p>
                  )}
                </AnimatePresence>
                {sidebarCollapsed && (
                  <div className="mx-2 mb-1 border-t border-sidebar-border/50" />
                )}
                <div className="space-y-0.5">
                  {section.items.map(renderNavItem)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">{items.map(renderNavItem)}</div>
        )}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">
              {currentUser?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-sidebar-foreground truncate">
                  {currentUser?.name}
                </p>
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    ROLE_COLORS[role],
                  )}
                >
                  {ROLE_LABELS[role]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        type="button"
        onClick={toggleSidebar}
        data-ocid="sidebar.collapse_button"
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm items-center justify-center hover:bg-muted transition-colors z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
