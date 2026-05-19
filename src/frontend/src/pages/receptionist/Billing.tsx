import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { MOCK_INVOICES } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import type { Invoice } from "@/types";
import {
  AlertTriangle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const WEEKLY_REVENUE = [
  { day: "Mon", amount: 3420 },
  { day: "Tue", amount: 2890 },
  { day: "Wed", amount: 4100 },
  { day: "Thu", amount: 3750 },
  { day: "Fri", amount: 5200 },
  { day: "Sat", amount: 1800 },
  { day: "Sun", amount: 950 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function InvoiceDetail({
  invoice,
  onClose,
  onPay,
}: { invoice: Invoice; onClose: () => void; onPay: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
      data-ocid="billing.dialog"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl shadow-elevation-high w-full max-w-md"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">
              Invoice #{invoice.id.toUpperCase()}
            </h3>
            <p className="text-xs text-muted-foreground">
              {invoice.patientName} · {invoice.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="billing.close_button"
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-5">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground pb-2 font-medium">
                  Description
                </th>
                <th className="text-right text-xs text-muted-foreground pb-2 font-medium">
                  Qty
                </th>
                <th className="text-right text-xs text-muted-foreground pb-2 font-medium">
                  Unit
                </th>
                <th className="text-right text-xs text-muted-foreground pb-2 font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoice.items.map((item, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: invoice line items
                <tr key={`line-${i}`}>
                  <td className="py-2 text-foreground">{item.description}</td>
                  <td className="py-2 text-right text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right text-muted-foreground">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="py-2 text-right font-medium text-foreground">
                    {fmt(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">
                {fmt(invoice.total)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {fmt(invoice.paid)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-foreground">Balance</span>
              <span
                className={
                  invoice.total - invoice.paid > 0
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              >
                {fmt(invoice.total - invoice.paid)}
              </span>
            </div>
          </div>
          {invoice.status !== "paid" && (
            <Button
              className="w-full mt-4"
              onClick={() => {
                onPay(invoice.id);
                onClose();
              }}
              data-ocid="billing.confirm_button"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Billing() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Receptionist", href: "/receptionist" },
        { label: "Billing" },
      ]),
    [setBreadcrumb],
  );

  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const handlePay = (id: string) => {
    setInvoices((inv) =>
      inv.map((i) =>
        i.id === id ? { ...i, status: "paid" as const, paid: i.total } : i,
      ),
    );
    toast.success("Invoice marked as paid!");
  };

  const todayCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.paid, 0);
  const pendingAmount = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + (i.total - i.paid), 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  const summaryCards = [
    {
      label: "Today's Collections",
      value: fmt(todayCollected),
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      detail: `${invoices.filter((i) => i.status === "paid").length} paid invoices`,
    },
    {
      label: "Pending Amount",
      value: fmt(pendingAmount),
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      detail: `${invoices.filter((i) => i.status !== "paid").length} outstanding`,
    },
    {
      label: "Overdue Count",
      value: overdueCount.toString(),
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
      detail: "Need immediate attention",
    },
    {
      label: "Weekly Revenue",
      value: fmt(WEEKLY_REVENUE.reduce((s, d) => s + d.amount, 0)),
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      detail: "vs last week +12%",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="billing.page">
      <PageHeader
        title="Billing Dashboard"
        subtitle="Invoice management and payment tracking"
      />

      {/* Summary cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="billing.summary"
      >
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 shadow-elevation-subtle"
            data-ocid={`billing.stat.${i + 1}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  card.color.split(" ")[0],
                )}
              >
                <card.icon
                  className={cn("w-5 h-5", card.color.split(" ")[1])}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-xl font-bold font-display text-foreground mt-0.5">
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl shadow-elevation-subtle overflow-hidden"
          data-ocid="billing.invoices_table"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">All Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Patient", "Date", "Services", "Amount", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`billing.invoice.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">
                        {inv.patientName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {inv.date}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {inv.items.map((it) => it.description).join(", ")}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right font-mono text-foreground">
                      {fmt(inv.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setSelected(inv)}
                          data-ocid={`billing.view_button.${i + 1}`}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                        {inv.status !== "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handlePay(inv.id)}
                            data-ocid={`billing.pay_button.${i + 1}`}
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Weekly revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-5 shadow-elevation-subtle"
          data-ocid="billing.revenue_chart"
        >
          <h3 className="font-semibold text-foreground mb-1">Weekly Revenue</h3>
          <p className="text-xs text-muted-foreground mb-4">
            May 13 – 19, 2026
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_REVENUE} barSize={24}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [fmt(v), "Revenue"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {WEEKLY_REVENUE.map((entry, i) => (
                  <Cell
                    key={entry.day}
                    fill={
                      entry.day === "Fri"
                        ? "oklch(var(--primary))"
                        : "oklch(var(--primary) / 0.4)"
                    }
                    data-ocid={`billing.chart_point.${i + 1}`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Best Day</span>
              <span className="font-semibold text-foreground">
                Friday · {fmt(5200)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Week Total</span>
              <span className="font-bold text-primary">
                {fmt(WEEKLY_REVENUE.reduce((s, d) => s + d.amount, 0))}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <InvoiceDetail
            invoice={selected}
            onClose={() => setSelected(null)}
            onPay={handlePay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
