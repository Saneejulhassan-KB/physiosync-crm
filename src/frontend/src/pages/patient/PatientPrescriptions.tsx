import { PATIENT_PRESCRIPTIONS } from "@/lib/salesPatientData";
import type { PatientMedicine, PatientPrescription } from "@/types/patient";
import { Pill, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<PatientPrescription["status"], string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  completed: "bg-muted text-muted-foreground",
  refill_needed:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

export default function PatientPrescriptions() {
  const [refillTarget, setRefillTarget] = useState<{
    prx: PatientPrescription;
    med: PatientMedicine;
  } | null>(null);
  const [refilled, setRefilled] = useState<Set<string>>(new Set());

  const confirmRefill = () => {
    if (!refillTarget) return;
    setRefilled(
      (prev) =>
        new Set([...prev, `${refillTarget.prx.id}-${refillTarget.med.name}`]),
    );
    setRefillTarget(null);
    toast.success(
      `Refill requested for ${refillTarget.med.name}. Your doctor will be notified.`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground">
        Prescriptions
      </h1>

      <div className="space-y-5">
        {PATIENT_PRESCRIPTIONS.map((prx, pi) => (
          <div
            key={prx.id}
            data-ocid={`patient.prescription.item.${pi + 1}`}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/20">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {prx.doctorName}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[prx.status]}`}
                  >
                    {prx.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {prx.diagnosis} · Valid until {prx.validUntil}
                </div>
              </div>
            </div>

            {/* Medicines */}
            <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prx.medicines.map((med, mi) => {
                const key = `${prx.id}-${med.name}`;
                const hasRefilled = refilled.has(key);
                return (
                  <div
                    key={med.name}
                    data-ocid={`patient.medicine.item.${pi + 1}.${mi + 1}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="font-medium text-foreground text-sm mb-1">
                      {med.name}
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        Dosage:{" "}
                        <span className="text-foreground">{med.dosage}</span>
                      </div>
                      <div>
                        Frequency:{" "}
                        <span className="text-foreground">{med.frequency}</span>
                      </div>
                      <div>
                        Duration:{" "}
                        <span className="text-foreground">{med.duration}</span>
                      </div>
                      <div className="italic">{med.instructions}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {med.refillsLeft} refill
                        {med.refillsLeft !== 1 ? "s" : ""} left
                      </span>
                      {prx.status === "active" && (
                        <button
                          type="button"
                          data-ocid={`patient.medicine.refill_button.${pi + 1}.${mi + 1}`}
                          disabled={hasRefilled || med.refillsLeft === 0}
                          onClick={() => setRefillTarget({ prx, med })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {hasRefilled ? "Requested" : "Refill"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Refill Confirmation Dialog */}
      {refillTarget && (
        <div
          data-ocid="patient.refill.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-card rounded-2xl p-6 w-[400px] max-w-[90vw] border border-border shadow-elevation-high">
            <h3 className="text-lg font-bold font-display text-foreground mb-2">
              Request Refill
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Request a refill for{" "}
              <strong className="text-foreground">
                {refillTarget.med.name}
              </strong>
              ?
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              Your prescribing doctor will be notified to approve this refill
              request.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="patient.refill.confirm_button"
                onClick={confirmRefill}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Request Refill
              </button>
              <button
                type="button"
                data-ocid="patient.refill.cancel_button"
                onClick={() => setRefillTarget(null)}
                className="flex-1 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
