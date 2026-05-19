import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  FOLLOW_UP_REMINDERS,
  HOSPITAL_CALL_LOGS,
  SALES_LEADS,
  VISIT_HISTORY,
} from "@/lib/salesPatientData";
import type { CallOutcome, FollowUpReminder, LeadStage } from "@/types/sales";
import {
  AlertCircle,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const stageColor: Record<LeadStage, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  qualified:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  proposal:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  negotiation:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  converted:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const outcomeColor: Record<CallOutcome, string> = {
  interested:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  callback_requested:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  not_interested:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  no_answer: "bg-muted text-muted-foreground",
  left_voicemail:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  converted: "bg-primary/10 text-primary",
};

const priorityColor = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  low: "bg-muted text-muted-foreground",
};

const visitPhotoColors = [
  "bg-primary/20",
  "bg-accent/20",
  "bg-secondary/20",
  "bg-emerald-500/20",
  "bg-purple-500/20",
  "bg-amber-500/20",
];

export default function HospitalVisitTab() {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(["f5"]));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const markDone = (id: string) => {
    setDoneIds((prev) => new Set([...prev, id]));
    toast.success("Follow-up marked as done");
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Leads Table ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Hospital Leads
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Lead
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Follow-up
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {SALES_LEADS.map((lead, i) => (
                  <tr
                    key={lead.id}
                    data-ocid={`sales.hospital_lead.item.${i + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground truncate max-w-[200px]">
                        {lead.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${stageColor[lead.stage]}`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      ${(lead.value ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {lead.followUpDate ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        data-ocid={`sales.hospital_lead.edit_button.${i + 1}`}
                        onClick={() => toast.info(`Viewing lead: ${lead.name}`)}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 2. Visit History ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Visit History
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Outcome
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {VISIT_HISTORY.map((v, i) => (
                  <tr
                    key={v.id}
                    data-ocid={`sales.visit.item.${i + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {v.visitDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {v.locationName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {v.purpose}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {v.contactPerson}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {v.outcome.slice(0, 30)}
                        {v.outcome.length > 30 ? "…" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {v.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 3. Call Logs ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-primary" />
          Call Logs
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOSPITAL_CALL_LOGS.map((c, i) => (
                  <tr
                    key={c.id}
                    data-ocid={`sales.hospital_call.item.${i + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      <div>{c.date}</div>
                      <div className="text-xs">{c.time}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.contactName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.phone}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${outcomeColor[c.outcome]}`}
                      >
                        {c.outcome.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. Follow-up Reminders ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          Follow-up Reminders
        </h3>
        <div className="space-y-3">
          {FOLLOW_UP_REMINDERS.map((f: FollowUpReminder, i) => {
            const done = doneIds.has(f.id);
            return (
              <div
                key={f.id}
                data-ocid={`sales.followup.item.${i + 1}`}
                className={`flex items-start gap-4 p-4 rounded-xl border border-border bg-card transition-opacity ${
                  done ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[f.priority]}`}
                    >
                      {f.priority}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {f.type}
                    </span>
                  </div>
                  <div className="font-medium text-foreground">
                    {f.leadName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Due: {f.dueDate} at {f.dueTime}
                  </div>
                  {f.notes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {f.notes}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid={`sales.followup.mark_done.${i + 1}`}
                  disabled={done}
                  onClick={() => markDone(f.id)}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {done ? "Done" : "Mark Done"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Photo Gallery ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          Visit Photos
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {visitPhotoColors.map((bg, i) => (
            <button
              key={bg}
              type="button"
              data-ocid={`sales.visit_photo.item.${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              className={`${bg} rounded-xl aspect-video flex flex-col items-center justify-center border border-border hover:scale-[1.03] transition-transform cursor-pointer`}
            >
              <Camera className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                Visit Photo {i + 1}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          data-ocid="sales.photo_lightbox.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setLightboxIndex(null)}
          onKeyUp={(e) => e.key === "Escape" && setLightboxIndex(null)}
          role="presentation"
        >
          <div
            className="relative bg-card rounded-2xl p-6 w-[480px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              data-ocid="sales.photo_lightbox.close_button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div
              className={`${visitPhotoColors[lightboxIndex]} rounded-xl aspect-video flex flex-col items-center justify-center`}
            >
              <Camera className="w-10 h-10 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Visit Photo {lightboxIndex + 1}
              </span>
            </div>
            <p className="mt-3 text-xs text-center text-muted-foreground">
              Actual visit photos will appear here once uploaded via the mobile
              app.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
