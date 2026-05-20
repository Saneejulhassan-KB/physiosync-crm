import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_LAB_REPORT_ENTRIES,
  MOCK_PHARMACY_INVENTORY,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { LabStatus } from "@/types";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  FlaskConical,
  Pencil,
  Pill,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";

interface LabStaff {
  id: string;
  name: string;
  shift: string;
  reportsToday: number;
  pendingReports: number;
  status: "active" | "off_duty";
}
interface PharmacyStaff {
  id: string;
  name: string;
  shift: string;
  prescriptionsFilled: number;
  stockAlerts: number;
  status: "active" | "off_duty";
}
interface LabReportSummary {
  id: string;
  patientName: string;
  testName: string;
  handledBy: string;
  status: LabStatus;
  date: string;
}
interface MedAlert {
  medicine: string;
  currentStock: number;
  reorderLevel: number;
  severity: "critical" | "warning";
}

const LAB_STAFF: LabStaff[] = [
  {
    id: "L001",
    name: "Dr. Anwar Hussain",
    shift: "Morning",
    reportsToday: 14,
    pendingReports: 3,
    status: "active",
  },
  {
    id: "L002",
    name: "Nisha Thomas",
    shift: "Evening",
    reportsToday: 9,
    pendingReports: 5,
    status: "active",
  },
  {
    id: "L003",
    name: "Hassan Al-Balushi",
    shift: "Morning",
    reportsToday: 0,
    pendingReports: 0,
    status: "off_duty",
  },
];

const PHARMACY_STAFF: PharmacyStaff[] = [
  {
    id: "P001",
    name: "Dr. Sana Mirza",
    shift: "Morning",
    prescriptionsFilled: 34,
    stockAlerts: 2,
    status: "active",
  },
  {
    id: "P002",
    name: "Arif Baig",
    shift: "Evening",
    prescriptionsFilled: 18,
    stockAlerts: 2,
    status: "active",
  },
];

const _RECENT_LAB_REPORTS: LabReportSummary[] = [
  {
    id: "LR1",
    patientName: "Ahmed Al-Rashid",
    testName: "Complete Blood Count",
    handledBy: "Dr. Anwar Hussain",
    status: "completed",
    date: "2026-05-20",
  },
  {
    id: "LR2",
    patientName: "Fatima Hassan",
    testName: "MRI Lumbar Spine",
    handledBy: "Nisha Thomas",
    status: "processing",
    date: "2026-05-20",
  },
  {
    id: "LR3",
    patientName: "Mohammed Al-Mansoori",
    testName: "HbA1c",
    handledBy: "Dr. Anwar Hussain",
    status: "critical",
    date: "2026-05-19",
  },
  {
    id: "LR4",
    patientName: "Sara Khalid",
    testName: "X-Ray Knee",
    handledBy: "Nisha Thomas",
    status: "pending",
    date: "2026-05-19",
  },
  {
    id: "LR5",
    patientName: "Ravi Shankar",
    testName: "Lipid Panel",
    handledBy: "Dr. Anwar Hussain",
    status: "completed",
    date: "2026-05-18",
  },
];

const MED_ALERTS: MedAlert[] = [
  {
    medicine: "Diclofenac Sodium 50mg",
    currentStock: 12,
    reorderLevel: 50,
    severity: "critical",
  },
  {
    medicine: "Pregabalin 75mg",
    currentStock: 28,
    reorderLevel: 40,
    severity: "warning",
  },
  {
    medicine: "Baclofen 10mg",
    currentStock: 15,
    reorderLevel: 30,
    severity: "critical",
  },
  {
    medicine: "Ibuprofen 400mg",
    currentStock: 44,
    reorderLevel: 60,
    severity: "warning",
  },
];

const _LAB_STATUS_MAP: Record<LabStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    },
    processing: {
      label: "Processing",
      className:
        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
    },
    completed: {
      label: "Completed",
      className:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    },
    critical: {
      label: "Critical",
      className:
        "bg-destructive/10 text-destructive border border-destructive/20",
    },
  };

const STAFF_STATUS_MAP: Record<string, { label: string; className: string }> = {
  active: {
    label: "On Duty",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  off_duty: {
    label: "Off Duty",
    className: "bg-muted text-muted-foreground border border-border",
  },
};

export default function AdminLabPharmacy() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lab & Pharmacy Management"
        subtitle="Monitor laboratory and pharmacy staff, reports, and inventory alerts"
      />

      <Tabs defaultValue="laboratory" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger
            value="laboratory"
            className="gap-1.5"
            data-ocid="admin.labpharmacy.tab.lab"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Laboratory
          </TabsTrigger>
          <TabsTrigger
            value="pharmacy"
            className="gap-1.5"
            data-ocid="admin.labpharmacy.tab.pharmacy"
          >
            <Pill className="w-3.5 h-3.5" /> Pharmacy
          </TabsTrigger>
        </TabsList>

        {/* Laboratory tab */}
        <TabsContent value="laboratory" className="space-y-5">
          {/* Lab staff */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Lab Staff
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead>Name</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reports Today</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LAB_STAFF.map((s, i) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-muted/20"
                    data-ocid={`admin.lab.staff.item.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {s.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.shift}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAFF_STATUS_MAP[s.status].className}`}
                      >
                        {STAFF_STATUS_MAP[s.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {s.reportsToday}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {s.pendingReports}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Recent reports */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-sm text-foreground">
                Recent Lab Reports
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead>Report ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LAB_REPORT_ENTRIES.map((report, i) => (
                  <TableRow
                    key={report.reportId}
                    className="hover:bg-muted/20"
                    data-ocid={`admin.lab.report.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs text-primary">
                      {report.reportId}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {report.patientName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {report.testType}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {report.requestedBy}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          report.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : report.status === "uploaded"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700",
                        )}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {report.uploadedAt
                        ? new Date(report.uploadedAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        {/* Pharmacy tab */}
        <TabsContent value="pharmacy" className="space-y-5">
          {/* Pharmacy staff */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Pharmacy Staff
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead>Name</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Prescriptions Filled
                  </TableHead>
                  <TableHead className="text-right">Stock Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PHARMACY_STAFF.map((s, i) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-muted/20"
                    data-ocid={`admin.pharmacy.staff.item.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {s.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.shift}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAFF_STATUS_MAP[s.status].className}`}
                      >
                        {STAFF_STATUS_MAP[s.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {s.prescriptionsFilled}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.stockAlerts > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive border border-destructive/20">
                          <AlertTriangle className="w-3 h-3" /> {s.stockAlerts}
                        </span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Stock alerts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <span className="font-semibold text-sm text-foreground">
                Low Stock Alerts
              </span>
              <Badge variant="destructive" className="ml-auto text-xs">
                {MED_ALERTS.length}
              </Badge>
            </div>
            <div className="divide-y divide-border">
              {MED_ALERTS.map((alert, i) => (
                <div
                  key={alert.medicine}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.pharmacy.stock_alert.${i + 1}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === "critical"
                        ? "bg-destructive"
                        : "bg-amber-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.medicine}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {alert.currentStock} units — Reorder at:{" "}
                      {alert.reorderLevel}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.severity === "critical"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {alert.severity === "critical" ? "Critical" : "Warning"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-7"
                    data-ocid={`admin.pharmacy.reorder_button.${i + 1}`}
                  >
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Full inventory table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
              <Pill className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-sm text-foreground">
                Medicine Inventory
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                {MOCK_PHARMACY_INVENTORY.length} items
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Medicine
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Min Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Supplier
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PHARMACY_INVENTORY.map((med) => (
                    <tr
                      key={med.medicineId}
                      className="border-b border-border/60 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">
                        {med.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {med.category}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            med.status === "out_of_stock"
                              ? "text-red-600"
                              : med.status === "low_stock"
                                ? "text-amber-600"
                                : "text-green-600",
                          )}
                        >
                          {med.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {med.minStock}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(med.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {med.supplier}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        ₹{med.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            med.status === "out_of_stock"
                              ? "bg-red-100 text-red-700"
                              : med.status === "low_stock"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700",
                          )}
                        >
                          {med.status
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
