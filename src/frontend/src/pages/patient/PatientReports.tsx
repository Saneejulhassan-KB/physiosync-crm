import { PATIENT_REPORTS } from "@/lib/salesPatientData";
import type { PatientReport } from "@/types/patient";
import { Download, Eye, FileText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterTab = "All" | "Lab" | "Imaging" | "Therapy";

const CATEGORY_MAP: Record<FilterTab, string[]> = {
  All: [],
  Lab: ["Hematology", "Biochemistry", "Microbiology"],
  Imaging: ["Radiology"],
  Therapy: ["Neurology", "Physiotherapy"],
};

const STATUS_COLORS: Record<PatientReport["status"], string> = {
  ready:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  pending: "bg-muted text-muted-foreground",
};

export default function PatientReports() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [previewReport, setPreviewReport] = useState<PatientReport | null>(
    null,
  );

  const filtered =
    activeTab === "All"
      ? PATIENT_REPORTS
      : PATIENT_REPORTS.filter((r) =>
          CATEGORY_MAP[activeTab].includes(r.category),
        );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground">
        Medical Reports
      </h1>

      {/* Filter Tabs */}
      <div className="flex gap-1 border border-border rounded-xl bg-card p-1 w-fit">
        {(["All", "Lab", "Imaging", "Therapy"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`patient.reports.tab.${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Report
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Ordered By
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  data-ocid={`patient.report.item.${i + 1}`}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">
                        {r.testName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.category}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.orderedBy}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        data-ocid={`patient.report.preview_button.${i + 1}`}
                        disabled={r.status !== "ready"}
                        onClick={() => setPreviewReport(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        type="button"
                        data-ocid={`patient.report.download_button.${i + 1}`}
                        disabled={r.status !== "ready"}
                        onClick={() =>
                          toast.success(`Downloading ${r.testName}...`)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No reports found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div
          data-ocid="patient.report.preview_modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreviewReport(null)}
          onKeyUp={(e) => e.key === "Escape" && setPreviewReport(null)}
          role="presentation"
        >
          <div
            className="bg-card rounded-2xl p-6 w-[520px] max-w-[90vw] border border-border shadow-elevation-high"
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-display text-foreground">
                {previewReport.testName}
              </h3>
              <button
                type="button"
                data-ocid="patient.report.preview_modal.close_button"
                onClick={() => setPreviewReport(null)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Category:</span>
                <span className="font-medium text-foreground">
                  {previewReport.category}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Ordered by:</span>
                <span className="font-medium text-foreground">
                  {previewReport.orderedBy}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Date:</span>
                <span className="font-medium text-foreground">
                  {previewReport.date}
                </span>
              </div>
              {previewReport.fileSize && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28">File size:</span>
                  <span className="font-medium text-foreground">
                    {previewReport.fileSize}
                  </span>
                </div>
              )}
            </div>
            {previewReport.summary && (
              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                  Summary
                </p>
                <p className="text-sm text-foreground">
                  {previewReport.summary}
                </p>
              </div>
            )}
            <div className="mt-4 h-32 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">PDF viewer placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
