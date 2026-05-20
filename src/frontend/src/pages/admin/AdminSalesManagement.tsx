import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_SALES_PERFORMANCE } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  Activity,
  Award,
  BarChart2,
  Building2,
  Dumbbell,
  Pencil,
  PhoneCall,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesSubRole = "hospital_visit" | "gym_outreach";

interface SalesRep {
  id: string;
  name: string;
  subRole: SalesSubRole;
  phone: string;
  email: string;
  status: "active" | "inactive";
  leadsThisMonth: number;
  conversions: number;
  callsLogged: number;
  visitsLogged: number;
  rating: number;
}

const SALES_REPS: SalesRep[] = [
  {
    id: "S001",
    name: "Mohammed Ali",
    subRole: "hospital_visit",
    phone: "+971 50 111 9001",
    email: "m.ali@physiosync.ae",
    status: "active",
    leadsThisMonth: 18,
    conversions: 6,
    callsLogged: 42,
    visitsLogged: 12,
    rating: 4.7,
  },
  {
    id: "S002",
    name: "Raj Kumar",
    subRole: "gym_outreach",
    phone: "+971 55 222 9002",
    email: "raj.kumar@physiosync.ae",
    status: "active",
    leadsThisMonth: 24,
    conversions: 9,
    callsLogged: 58,
    visitsLogged: 18,
    rating: 4.9,
  },
  {
    id: "S003",
    name: "Hina Tariq",
    subRole: "hospital_visit",
    phone: "+971 52 333 9003",
    email: "hina.tariq@physiosync.ae",
    status: "active",
    leadsThisMonth: 14,
    conversions: 4,
    callsLogged: 35,
    visitsLogged: 8,
    rating: 4.5,
  },
  {
    id: "S004",
    name: "Lucas Fernandes",
    subRole: "gym_outreach",
    phone: "+971 56 444 9004",
    email: "lucas.f@physiosync.ae",
    status: "inactive",
    leadsThisMonth: 0,
    conversions: 0,
    callsLogged: 0,
    visitsLogged: 0,
    rating: 4.2,
  },
];

const PERFORMANCE_DATA = [
  { month: "Jan", hospital: 12, gym: 8 },
  { month: "Feb", hospital: 15, gym: 11 },
  { month: "Mar", hospital: 10, gym: 14 },
  { month: "Apr", hospital: 18, gym: 16 },
  { month: "May", hospital: 22, gym: 20 },
];

const SUB_ROLE_CONFIG: Record<
  SalesSubRole,
  { label: string; icon: React.ElementType; className: string }
> = {
  hospital_visit: {
    label: "Hospital Visit",
    icon: Building2,
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  gym_outreach: {
    label: "Gym Outreach",
    icon: Dumbbell,
    className: "bg-secondary/10 text-secondary border border-secondary/20",
  },
};

const STATS = [
  { label: "Total Sales Reps", value: "4", icon: Users, color: "text-primary" },
  {
    label: "Leads This Month",
    value: "56",
    icon: TrendingUp,
    color: "text-secondary",
  },
  {
    label: "Total Conversions",
    value: "19",
    icon: Award,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Calls Logged",
    value: "135",
    icon: PhoneCall,
    color: "text-amber-600 dark:text-amber-400",
  },
];

export default function AdminSalesManagement() {
  const [search, setSearch] = useState("");
  const [subRole, setSubRole] = useState<"all" | SalesSubRole>("all");

  const filtered = useMemo(
    () =>
      SALES_REPS.filter((r) => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchRole = subRole === "all" || r.subRole === subRole;
        return matchSearch && matchRole;
      }),
    [search, subRole],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Management"
        subtitle="Oversee hospital visit and gym outreach sales representatives"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                {s.label}
              </span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold font-display text-foreground">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Performance chart */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-4">
          Monthly Leads by Channel
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={PERFORMANCE_DATA} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0 0)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="hospital"
              name="Hospital Visit"
              fill="oklch(0.42 0.18 250)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="gym"
              name="Gym Outreach"
              fill="oklch(0.68 0.11 190)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-role filter */}
      <div className="flex items-center gap-2">
        {(["all", "hospital_visit", "gym_outreach"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setSubRole(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              subRole === r
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40"
            }`}
            data-ocid={`admin.sales.subrole_filter.${r}`}
          >
            {r === "all"
              ? "All Reps"
              : r === "hospital_visit"
                ? "Hospital Visit"
                : "Gym Outreach"}
          </button>
        ))}
        <div className="relative ml-auto w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rep…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="admin.sales.search_input"
          />
        </div>
      </div>

      {/* Performance summary table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="font-semibold text-sm text-foreground">
            Team Performance – This Month
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Rep
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Leads
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Conversions
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Rate
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Visits
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Calls
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SALES_PERFORMANCE.map((rep) => (
                <tr
                  key={rep.staffName}
                  className="border-b border-border/60 hover:bg-muted/20"
                >
                  <td className="px-4 py-3 text-foreground font-medium">
                    {rep.staffName}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground">
                    {rep.leadsGenerated}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground">
                    {rep.conversions}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        rep.conversionRate >= 30
                          ? "bg-green-100 text-green-700"
                          : rep.conversionRate >= 15
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700",
                      )}
                    >
                      {rep.conversionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {rep.visitsMade}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {rep.callsMade}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground font-medium">
                    ₹{rep.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rep detail Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Rep</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => {
              const cfg = SUB_ROLE_CONFIG[r.subRole];
              return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  data-ocid={`admin.sales.rep.item.${i + 1}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {r.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {r.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}
                    >
                      <cfg.icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.status === "active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {r.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {r.leadsThisMonth}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {r.conversions}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {r.callsLogged}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {r.visitsLogged}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{r.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      data-ocid={`admin.sales.edit_button.${i + 1}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
