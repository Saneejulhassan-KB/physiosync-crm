import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  MOCK_REVENUE_DATA,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Extended analytics mock data
const MONTHLY_REVENUE_12 = [
  {
    month: "Jun 25",
    revenue: 24800,
    expenses: 12400,
    pmr: 16200,
    general: 8600,
  },
  {
    month: "Jul 25",
    revenue: 26300,
    expenses: 13100,
    pmr: 17100,
    general: 9200,
  },
  {
    month: "Aug 25",
    revenue: 25100,
    expenses: 12800,
    pmr: 16400,
    general: 8700,
  },
  {
    month: "Sep 25",
    revenue: 27600,
    expenses: 13600,
    pmr: 18000,
    general: 9600,
  },
  {
    month: "Oct 25",
    revenue: 29200,
    expenses: 14200,
    pmr: 18900,
    general: 10300,
  },
  {
    month: "Nov 25",
    revenue: 28400,
    expenses: 14200,
    pmr: 18600,
    general: 9800,
  },
  {
    month: "Dec 25",
    revenue: 31200,
    expenses: 15800,
    pmr: 20300,
    general: 10900,
  },
  {
    month: "Jan 26",
    revenue: 33500,
    expenses: 16200,
    pmr: 21800,
    general: 11700,
  },
  {
    month: "Feb 26",
    revenue: 36800,
    expenses: 17100,
    pmr: 23900,
    general: 12900,
  },
  {
    month: "Mar 26",
    revenue: 38200,
    expenses: 17800,
    pmr: 24800,
    general: 13400,
  },
  {
    month: "Apr 26",
    revenue: 39100,
    expenses: 18200,
    pmr: 25400,
    general: 13700,
  },
  {
    month: "May 26",
    revenue: 41200,
    expenses: 18600,
    pmr: 26800,
    general: 14400,
  },
];

const YOY_DATA = [
  { month: "Jan", y2025: 18200, y2026: 33500 },
  { month: "Feb", y2025: 19400, y2026: 36800 },
  { month: "Mar", y2025: 21100, y2026: 38200 },
  { month: "Apr", y2025: 22600, y2026: 39100 },
  { month: "May", y2025: 23800, y2026: 41200 },
];

const DEPT_REVENUE_PIE = [
  { name: "PMR Department", value: 26800, color: "oklch(0.42 0.18 250)" },
  { name: "General Medical", value: 14400, color: "oklch(0.55 0.22 180)" },
];

const BOOKING_TRENDS = MOCK_REVENUE_DATA.map((d) => ({
  month: d.month,
  bookings: Math.round(d.patients * 1.4),
  cancellations: Math.round(d.patients * 0.12),
  noShows: Math.round(d.patients * 0.06),
}));

const DOCTOR_LOAD = MOCK_DOCTORS.map((d) => ({
  name: d.name.replace("Dr. ", ""),
  appointments: d.patientsCount,
  capacity: 60,
}));

const CANCELLATION_DONUT = [
  { name: "Completed", value: 74, color: "oklch(0.55 0.18 160)" },
  { name: "Cancelled", value: 14, color: "oklch(0.65 0.22 32)" },
  { name: "No Show", value: 7, color: "oklch(0.72 0.18 80)" },
  { name: "Rescheduled", value: 5, color: "oklch(0.42 0.18 250)" },
];

const PATIENT_GROWTH = MOCK_REVENUE_DATA.map((d, i) => ({
  month: d.month,
  newPatients: [14, 18, 22, 19, 24, 21, 28][i] ?? 20,
  retained: d.patients - ([14, 18, 22, 19, 24, 21, 28][i] ?? 20),
  total: d.patients,
}));

const DEMOGRAPHICS = [
  { group: "18-30", male: 18, female: 22 },
  { group: "31-45", male: 28, female: 31 },
  { group: "46-60", male: 24, female: 19 },
  { group: "60+", male: 15, female: 12 },
];

const LEAD_FUNNEL = [
  { name: "Leads Generated", value: 240, fill: "oklch(0.42 0.18 250)" },
  { name: "Contacted", value: 186, fill: "oklch(0.48 0.20 230)" },
  { name: "Appointment Booked", value: 124, fill: "oklch(0.52 0.22 200)" },
  { name: "First Visit", value: 98, fill: "oklch(0.55 0.22 180)" },
  { name: "Converted", value: 74, fill: "oklch(0.58 0.20 160)" },
];

const LEAD_SOURCE = [
  { source: "Social Media", leads: 82, conversions: 28 },
  { source: "Doctor Referral", leads: 64, conversions: 31 },
  { source: "Walk-in", leads: 48, conversions: 24 },
  { source: "Google Ads", leads: 31, conversions: 11 },
  { source: "WhatsApp", leads: 15, conversions: 9 },
];

const PRIMARY = "oklch(0.42 0.18 250)";
const TEAL = "oklch(0.55 0.22 180)";
const AMBER = "oklch(0.72 0.18 80)";
const ROSE = "oklch(0.65 0.22 32)";

function MetricCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-elevation-subtle">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold font-display text-foreground">{value}</p>
      <div
        className={cn(
          "flex items-center gap-1 mt-1 text-xs font-medium",
          positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500",
        )}
      >
        {positive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {change} vs last period
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-elevation-subtle",
        className,
      )}
    >
      <h3 className="font-semibold text-foreground">{title}</h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">{subtitle}</p>
      )}
      {children}
    </motion.div>
  );
}

export default function Analytics() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Dashboard", href: "/admin" },
        { label: "Analytics" },
      ]),
    [setBreadcrumb],
  );

  const [tab, setTab] = useState("revenue");

  return (
    <div className="space-y-6" data-ocid="analytics.page">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Comprehensive performance metrics across revenue, appointments, patients, and leads"
      />

      <Tabs value={tab} onValueChange={setTab} data-ocid="analytics.tabs">
        <TabsList className="h-10">
          {[
            ["revenue", "Revenue"],
            ["appointments", "Appointments"],
            ["patients", "Patients"],
            ["leads", "Leads"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v} data-ocid={`analytics.${v}_tab`}>
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Revenue Tab ─────────────────────────────────────── */}
        <TabsContent value="revenue" className="mt-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Monthly Revenue"
              value="$41,200"
              change="+12.4%"
              positive
              icon={TrendingUp}
            />
            <MetricCard
              label="YTD Revenue"
              value="$284,750"
              change="+38.6%"
              positive
              icon={TrendingUp}
            />
            <MetricCard
              label="Net Profit"
              value="$22,600"
              change="+9.8%"
              positive
              icon={TrendingUp}
            />
            <MetricCard
              label="Expenses"
              value="$18,600"
              change="+4.3%"
              positive={false}
              icon={TrendingUp}
            />
          </div>
          <ChartCard
            title="Monthly Revenue & Expenses"
            subtitle="12-month trend with departmental breakdown"
            delay={0.05}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY_REVENUE_12}>
                <defs>
                  <linearGradient id="revGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ROSE} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0 0 / 0.4)"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={PRIMARY}
                  fill="url(#revGradA)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke={ROSE}
                  fill="url(#expGradA)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard
              title="Year-over-Year Comparison"
              subtitle="2025 vs 2026"
              delay={0.1}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={YOY_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0 0 / 0.4)"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number) => `$${v.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="y2025"
                    name="2025"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="y2026"
                    name="2026"
                    stroke={PRIMARY}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
              title="Department Revenue Split"
              subtitle="Current month"
              delay={0.15}
            >
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={DEPT_REVENUE_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {DEPT_REVENUE_PIE.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => `$${v.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {DEPT_REVENUE_PIE.map((d) => (
                    <div key={d.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: d.color }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {d.name}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-foreground ml-5">
                        ${d.value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        {/* ── Appointments Tab ─────────────────────────────────── */}
        <TabsContent value="appointments" className="mt-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total This Month"
              value="131"
              change="+6.5%"
              positive
              icon={Calendar}
            />
            <MetricCard
              label="Cancellation Rate"
              value="14%"
              change="-2.1%"
              positive
              icon={Calendar}
            />
            <MetricCard
              label="No-Show Rate"
              value="7%"
              change="-0.8%"
              positive
              icon={Calendar}
            />
            <MetricCard
              label="Avg Duration"
              value="48 min"
              change="+2 min"
              positive={false}
              icon={Calendar}
            />
          </div>
          <ChartCard
            title="Booking Trends"
            subtitle="Monthly bookings, cancellations, and no-shows"
            delay={0.05}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={BOOKING_TRENDS}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0 0 / 0.4)"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill={PRIMARY}
                  radius={[3, 3, 0, 0]}
                  stackId="a"
                />
                <Bar
                  dataKey="cancellations"
                  name="Cancellations"
                  fill={ROSE}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="noShows"
                  name="No Shows"
                  fill={AMBER}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard
              title="Doctor Workload"
              subtitle="Appointments handled per doctor"
              delay={0.1}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DOCTOR_LOAD} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0 0 / 0.4)"
                  />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="appointments"
                    name="Appointments"
                    fill={TEAL}
                    radius={[0, 3, 3, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
              title="Appointment Outcomes"
              subtitle="Completion vs cancellation breakdown"
              delay={0.15}
            >
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={CANCELLATION_DONUT}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {CANCELLATION_DONUT.map((e) => (
                        <Cell key={e.name} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {CANCELLATION_DONUT.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: d.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {d.name}
                      </span>
                      <span className="text-xs font-bold text-foreground ml-auto">
                        {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        {/* ── Patients Tab ─────────────────────────────────────── */}
        <TabsContent value="patients" className="mt-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Active Patients"
              value="131"
              change="+8.7%"
              positive
              icon={Users}
            />
            <MetricCard
              label="New This Month"
              value="28"
              change="+16.7%"
              positive
              icon={Users}
            />
            <MetricCard
              label="Retention Rate"
              value="84.2%"
              change="+1.8%"
              positive
              icon={Users}
            />
            <MetricCard
              label="Avg Visit Freq"
              value="3.2/mo"
              change="+0.4"
              positive
              icon={Users}
            />
          </div>
          <ChartCard
            title="Patient Growth"
            subtitle="New vs retained patients over 7 months"
            delay={0.05}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={PATIENT_GROWTH}>
                <defs>
                  <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0 0 / 0.4)"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="retained"
                  name="Retained"
                  stroke={PRIMARY}
                  fill="url(#retGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="newPatients"
                  name="New Patients"
                  stroke={TEAL}
                  fill="url(#newGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Patient Demographics"
            subtitle="Age group and gender distribution"
            delay={0.1}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEMOGRAPHICS}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0 0 / 0.4)"
                />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="male"
                  name="Male"
                  fill={PRIMARY}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="female"
                  name="Female"
                  fill={TEAL}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        {/* ── Leads Tab ─────────────────────────────────────────── */}
        <TabsContent value="leads" className="mt-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Leads"
              value="240"
              change="+22.4%"
              positive
              icon={Target}
            />
            <MetricCard
              label="Conversion Rate"
              value="30.8%"
              change="+3.2%"
              positive
              icon={Target}
            />
            <MetricCard
              label="Avg Cost/Lead"
              value="$18.40"
              change="-5.1%"
              positive
              icon={Target}
            />
            <MetricCard
              label="Revenue/Lead"
              value="$557"
              change="+8.4%"
              positive
              icon={Target}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard
              title="Lead Conversion Funnel"
              subtitle="From lead to converted patient"
              delay={0.05}
            >
              <ResponsiveContainer width="100%" height={280}>
                <FunnelChart>
                  <Tooltip formatter={(v: number) => [v, "Leads"]} />
                  <Funnel dataKey="value" data={LEAD_FUNNEL} isAnimationActive>
                    <LabelList
                      position="center"
                      fill="oklch(0.98 0 0)"
                      fontSize={12}
                      dataKey="name"
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
              title="Lead Source Performance"
              subtitle="Leads generated and conversion by channel"
              delay={0.1}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={LEAD_SOURCE}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0 0 / 0.4)"
                  />
                  <XAxis dataKey="source" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="leads"
                    name="Leads"
                    fill={PRIMARY}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="conversions"
                    name="Conversions"
                    fill={TEAL}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
