import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead, LeadSource, LeadStatus } from "@/lib/mockData";
import { MOCK_LEADS } from "@/lib/mockData";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Link2,
  Pencil,
  Search,
  Share2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PAGE_SIZE = 15;

type SourceConfig = {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  chartColor: string;
};

const SOURCE_CONFIG: Record<LeadSource, SourceConfig> = {
  sales_person: {
    label: "Sales Person",
    icon: UserCheck,
    badgeClass:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30",
    chartColor: "#a855f7",
  },
  social_media_facebook: {
    label: "Facebook",
    icon: () => <span className="font-bold text-[10px] leading-none">FB</span>,
    badgeClass:
      "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30",
    chartColor: "#3b82f6",
  },
  social_media_instagram: {
    label: "Instagram",
    icon: () => <span className="font-bold text-[10px] leading-none">IG</span>,
    badgeClass:
      "bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-500/30",
    chartColor: "#ec4899",
  },
  manual_entry: {
    label: "Manual Entry",
    icon: Pencil,
    badgeClass: "bg-muted text-muted-foreground border border-border",
    chartColor: "#94a3b8",
  },
  walk_in: {
    label: "Walk-in",
    icon: DoorOpen,
    badgeClass:
      "bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30",
    chartColor: "#14b8a6",
  },
  referral: {
    label: "Referral",
    icon: Share2,
    badgeClass:
      "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30",
    chartColor: "#f97316",
  },
  other: {
    label: "Other",
    icon: Link2,
    badgeClass: "bg-muted/60 text-muted-foreground border border-border/60",
    chartColor: "#64748b",
  },
};

const STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string }> =
  {
    new: {
      label: "New",
      badgeClass:
        "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30",
    },
    contacted: {
      label: "Contacted",
      badgeClass:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    },
    converted: {
      label: "Converted",
      badgeClass:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    },
    rejected: {
      label: "Rejected",
      badgeClass:
        "bg-destructive/15 text-destructive border border-destructive/30",
    },
  };

function SourceBadge({ source }: { source: LeadSource }) {
  const cfg = SOURCE_CONFIG[source];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
        cfg.badgeClass
      }`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
        cfg.badgeClass
      }`}
    >
      {cfg.label}
    </span>
  );
}

function LeadDetailPanel({
  lead,
  open,
  onClose,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!lead) return null;
  const dateFormatted = new Date(lead.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        className="w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto"
        data-ocid="admin.leads.dialog"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-xl">Lead Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-5">
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-lg text-foreground">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                Lead Source
              </p>
              <SourceBadge source={lead.source} />
            </div>
            <div className="bg-card border border-border rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                Department
              </p>
              <span className="text-sm font-semibold text-foreground">
                {lead.department}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Assigned To
              </p>
              <p className="text-sm font-semibold text-foreground">
                {lead.assignedTo}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Date Added
              </p>
              <p className="text-sm font-semibold text-foreground">
                {dateFormatted}
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Notes
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {lead.notes}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              Conversion History
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Lead Created",
                  date: dateFormatted,
                  color: "bg-blue-500",
                },
                {
                  label:
                    lead.status === "converted"
                      ? "Converted to Patient"
                      : "Follow-up Scheduled",
                  date: lead.status === "converted" ? dateFormatted : "Pending",
                  color:
                    lead.status === "converted"
                      ? "bg-emerald-500"
                      : "bg-amber-500",
                },
              ].map((step, i) => (
                <div
                  key={step.label || String(i)}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${step.color} shrink-0`}
                  />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-sm text-foreground">
                      {step.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={onClose}
            data-ocid="admin.leads.close_button"
            type="button"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminLeads() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [deptFilter, setDeptFilter] = useState<"all" | "PMR" | "General">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_LEADS.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q);
      const matchSource = sourceFilter === "all" || l.source === sourceFilter;
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchDept = deptFilter === "all" || l.department === deptFilter;
      return matchSearch && matchSource && matchStatus && matchDept;
    });
  }, [search, sourceFilter, statusFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalLeads = MOCK_LEADS.length;
  const newThisWeek = MOCK_LEADS.filter(
    (l) => new Date(l.createdAt) >= new Date("2026-05-14"),
  ).length;
  const converted = MOCK_LEADS.filter((l) => l.status === "converted").length;
  const conversionRate = ((converted / totalLeads) * 100).toFixed(1);

  const pieData = (Object.keys(SOURCE_CONFIG) as LeadSource[])
    .map((src) => ({
      name: SOURCE_CONFIG[src].label,
      value: MOCK_LEADS.filter((l) => l.source === src).length,
      color: SOURCE_CONFIG[src].chartColor,
    }))
    .filter((d) => d.value > 0);

  const stats = [
    { label: "Total Leads", value: totalLeads.toString(), sub: "All time" },
    {
      label: "New This Week",
      value: newThisWeek.toString(),
      sub: "Last 7 days",
    },
    {
      label: "Converted",
      value: converted.toString(),
      sub: `${conversionRate}% rate`,
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      sub: `${converted} of ${totalLeads}`,
    },
  ];

  function openDetail(lead: Lead) {
    setSelectedLead(lead);
    setPanelOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads Management"
        subtitle={`Track all incoming leads across channels — ${totalLeads} total`}
      />

      {/* Summary stats + pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {s.label}
              </p>
              <p className="text-2xl font-bold font-display text-foreground mt-2">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Leads by Source
          </p>
          <div className="flex items-center gap-4 flex-1">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={46}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, _idx) => (
                    <Cell
                      key={entry.color}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val: number, name: string) => [val, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 min-w-0">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {d.name}
                  </span>
                  <span className="ml-auto text-xs font-semibold text-foreground shrink-0">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Source Legend */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Source Legend — click to filter
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((src) => {
            const count = MOCK_LEADS.filter((l) => l.source === src).length;
            const cfg = SOURCE_CONFIG[src];
            const Icon = cfg.icon;
            return (
              <button
                key={src}
                type="button"
                onClick={() =>
                  setSourceFilter(sourceFilter === src ? "all" : src)
                }
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  cfg.badgeClass
                } ${
                  sourceFilter === src
                    ? "ring-2 ring-offset-1 ring-offset-card ring-current shadow-sm scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
                data-ocid={`admin.leads.source_legend.${src}`}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
                <span className="ml-1 font-bold">{count}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Filter bar + Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 bg-background"
                data-ocid="admin.leads.search_input"
              />
            </div>
            <Select
              value={sourceFilter}
              onValueChange={(v) => {
                setSourceFilter(v as "all" | LeadSource);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-44 bg-background"
                data-ocid="admin.leads.source_select"
              >
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((src) => (
                  <SelectItem key={src} value={src}>
                    {SOURCE_CONFIG[src].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as "all" | LeadStatus);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-40 bg-background"
                data-ocid="admin.leads.status_select"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={deptFilter}
              onValueChange={(v) => {
                setDeptFilter(v as "all" | "PMR" | "General");
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-44 bg-background"
                data-ocid="admin.leads.dept_select"
              >
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="PMR">PMR</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs font-medium ml-auto">
              <Users className="w-3 h-3 mr-1" />
              {filtered.length} result{filtered.length !== 1 && "s"}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Lead</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {paginated.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => openDetail(lead)}
                    data-ocid={`admin.leads.item.${i + 1}`}
                  >
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.phone}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {lead.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <SourceBadge source={lead.source} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground font-medium">
                          {lead.department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.assignedTo}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(lead);
                        }}
                        data-ocid={`admin.leads.view_button.${i + 1}`}
                        type="button"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {filtered.length === 0 && (
          <div
            className="py-20 flex flex-col items-center gap-3"
            data-ocid="admin.leads.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="font-semibold text-foreground">No leads found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSourceFilter("all");
                setStatusFilter("all");
                setDeptFilter("all");
              }}
              type="button"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} leads
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                data-ocid="admin.leads.pagination_prev"
                type="button"
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs font-medium text-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                data-ocid="admin.leads.pagination_next"
                type="button"
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <LeadDetailPanel
        lead={selectedLead}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
