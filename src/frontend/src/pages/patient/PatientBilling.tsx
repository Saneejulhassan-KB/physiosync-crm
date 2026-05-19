import { PATIENT_INVOICES } from "@/lib/salesPatientData";
import type { PatientInvoice } from "@/types/patient";
import { Download, Receipt } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<PatientInvoice["status"], string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const totalPaid = PATIENT_INVOICES.filter((i) => i.status === "paid").reduce(
  (s, i) => s + i.amount,
  0,
);
const totalPending = PATIENT_INVOICES.filter(
  (i) => i.status === "pending",
).reduce((s, i) => s + i.amount, 0);
const lastPayment = PATIENT_INVOICES.filter((i) => i.status === "paid").sort(
  (a, b) => b.date.localeCompare(a.date),
)[0];

export default function PatientBilling() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground">
        Billing & Invoices
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          data-ocid="patient.billing.stat.paid"
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div
          data-ocid="patient.billing.stat.pending"
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-3xl font-bold font-display text-amber-600 dark:text-amber-400 mt-1">
            ${totalPending.toLocaleString()}
          </p>
        </div>
        <div
          data-ocid="patient.billing.stat.last_payment"
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">Last Payment</p>
          <p className="text-3xl font-bold font-display text-foreground mt-1">
            {lastPayment?.date ?? "—"}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Invoice History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Invoice #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {PATIENT_INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  data-ocid={`patient.invoice.item.${i + 1}`}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {inv.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inv.date}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inv.description}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      data-ocid={`patient.invoice.download_button.${i + 1}`}
                      onClick={() =>
                        toast.success(`Downloading ${inv.invoiceNumber}...`)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
