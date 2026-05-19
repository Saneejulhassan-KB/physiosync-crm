import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import type { UserRole } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  PhoneCall,
  Pill,
  Receipt,
  Settings,
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

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  super_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    { icon: UserCog, label: "Staff Management", href: "/admin/staff" },
    { icon: ClipboardCheck, label: "Audit Logs", href: "/admin/audit-logs" },
  ],
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
    { icon: Building2, label: "Hospital Visits", href: "/sales" },
    { icon: Dumbbell, label: "Gym Outreach", href: "/sales" },
    { icon: PhoneCall, label: "Call Logs", href: "/sales" },
    { icon: MapPin, label: "Visit History", href: "/sales" },
    { icon: FileText, label: "Lead Pipeline", href: "/sales" },
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
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {items.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/admin" &&
              item.href !== "/doctor" &&
              item.href !== "/receptionist" &&
              location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(" ", "_")}_link`}
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
        })}
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
