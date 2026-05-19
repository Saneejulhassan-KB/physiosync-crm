import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_APPOINTMENTS,
  MOCK_FINANCIAL,
  MOCK_PATIENTS,
  MOCK_REVENUE_DATA,
} from "@/lib/mockData";
import { useUIStore } from "@/stores/uiStore";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const { setBreadcrumb } = useUIStore();
  useEffect(() => setBreadcrumb([{ label: "Dashboard" }]), [setBreadcrumb]);

  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-19");

  return (
    <div className="space-y-6" data-ocid="admin_dashboard.page">
      <PageHeader
        title="Management Dashboard"
        subtitle="PhysioSync CRM — Revenue, Operations & Analytics Overview"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            title: "Monthly Revenue",
            value: `$${MOCK_FINANCIAL.monthlyRevenue.toLocaleString()}`,
            trend: MOCK_FINANCIAL.revenueGrowth,
            trendLabel: "vs last month",
            iconClassName: "bg-emerald-500/10",
            ocid: "admin_dashboard.revenue_card",
          },
          {
            icon: Users,
            title: "Active Patients",
            value: MOCK_PATIENTS.filter((p) => p.status === "active").length,
            trend: MOCK_FINANCIAL.patientGrowth,
            trendLabel: "vs last month",
            iconClassName: "bg-primary/10",
            ocid: "admin_dashboard.patients_card",
          },
          {
            icon: Calendar,
            title: "Today's Appointments",
            value: todayAppts.length,
            trend: MOCK_FINANCIAL.appointmentGrowth,
            trendLabel: "vs last week",
            iconClassName: "bg-secondary/10",
            ocid: "admin_dashboard.appointments_card",
          },
          {
            icon: DollarSign,
            title: "Pending Payments",
            value: `$${MOCK_FINANCIAL.pendingPayments.toLocaleString()}`,
            iconClassName: "bg-amber-500/10",
            ocid: "admin_dashboard.pending_card",
          },
        ].map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
            iconClassName={stat.iconClassName}
            data-ocid={stat.ocid}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-elevation-subtle"
          data-ocid="admin_dashboard.revenue_chart"
        >
          <h3 className="font-semibold text-foreground mb-1">
            Revenue & Expenses
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.42 0.18 250)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.42 0.18 250)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.58 0.25 32)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.58 0.25 32)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0 0 / 0.5)"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="oklch(0.42 0.18 250)"
                fill="url(#revGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="oklch(0.58 0.25 32)"
                fill="url(#expGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department patient bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 shadow-elevation-subtle"
          data-ocid="admin_dashboard.dept_chart"
        >
          <h3 className="font-semibold text-foreground mb-1">
            Patients by Month
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_REVENUE_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0 0 / 0.5)"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="patients"
                name="Patients"
                fill="oklch(0.42 0.18 250)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Today appointments + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card shadow-elevation-subtle overflow-hidden"
          data-ocid="admin_dashboard.today_appointments"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Today's Appointments
            </h3>
            <span className="text-xs text-muted-foreground">
              {todayAppts.length} total
            </span>
          </div>
          <div className="divide-y divide-border">
            {todayAppts.slice(0, 6).map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-3 px-5 py-3"
                data-ocid={`admin_dashboard.appt.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.time} · {a.type}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5 shadow-elevation-subtle space-y-4"
          data-ocid="admin_dashboard.financial_summary"
        >
          <h3 className="font-semibold text-foreground">Financial Summary</h3>
          {[
            {
              label: "Total Revenue (YTD)",
              value: `$${MOCK_FINANCIAL.totalRevenue.toLocaleString()}`,
              icon: TrendingUp,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Net Profit (Month)",
              value: `$${MOCK_FINANCIAL.netProfit.toLocaleString()}`,
              icon: CheckCircle,
              color: "text-primary",
            },
            {
              label: "Total Expenses",
              value: `$${MOCK_FINANCIAL.expenses.toLocaleString()}`,
              icon: Activity,
              color: "text-muted-foreground",
            },
            {
              label: "Pending Payments",
              value: `$${MOCK_FINANCIAL.pendingPayments.toLocaleString()}`,
              icon: AlertTriangle,
              color: "text-amber-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className={`text-sm font-semibold ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
