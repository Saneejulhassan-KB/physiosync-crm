import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ClipboardList,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { motion } from "motion/react";

const ROLES: Array<{
  role: UserRole;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  redirectTo: string;
}> = [
  {
    role: "super_admin",
    icon: ShieldCheck,
    title: "Super Admin",
    subtitle: "Management Portal",
    description:
      "Full system access with revenue analytics, staff management, and clinic operations dashboard.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30 hover:border-accent/60",
    redirectTo: "/admin",
  },
  {
    role: "doctor",
    icon: Stethoscope,
    title: "Doctor",
    subtitle: "Clinical Dashboard",
    description:
      "Patient histories, prescriptions, therapy planner, lab reports, and treatment workflows.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30 hover:border-primary/60",
    redirectTo: "/doctor",
  },
  {
    role: "receptionist",
    icon: ClipboardList,
    title: "Receptionist",
    subtitle: "Front Desk Portal",
    description:
      "Patient registration, appointment booking, queue management, and billing assistance.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30 hover:border-secondary/60",
    redirectTo: "/receptionist",
  },
];

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole, redirectTo: string) => {
    login(role);
    navigate({ to: redirectTo });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-elevation-medium">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-3xl text-foreground tracking-tight">
              PhysioSync
            </span>
          </div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
            Enterprise Clinic CRM for PMR &amp; General Medical departments.
            Select your role to access your personalized dashboard.
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROLES.map((r, i) => (
            <motion.button
              key={r.role}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(r.role, r.redirectTo)}
              data-ocid={`login.${r.role}_card`}
              className={`relative overflow-hidden rounded-2xl border-2 ${r.borderColor} bg-card p-6 text-left transition-all duration-300 shadow-elevation-subtle hover:shadow-elevation-high group`}
            >
              {/* Gradient accent */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full ${r.bgColor} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl ${r.bgColor} flex items-center justify-center mb-4`}
                >
                  <r.icon className={`w-6 h-6 ${r.color}`} />
                </div>
                <h2 className="text-xl font-bold font-display text-foreground">
                  {r.title}
                </h2>
                <p className={`text-sm font-medium ${r.color} mb-3`}>
                  {r.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.description}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${r.color} bg-opacity-10 px-3 py-1 rounded-full border ${r.borderColor.split(" ")[0]}`}
                  >
                    Demo Login
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform">
                    Sign in →
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          This is a frontend demo. All data is mock/simulated for demonstration
          purposes.
        </motion.p>
      </div>
    </div>
  );
}
