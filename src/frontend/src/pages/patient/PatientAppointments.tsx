import { AVAILABLE_SLOTS, PATIENT_APPOINTMENTS } from "@/lib/salesPatientData";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  in_progress:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const NEXT_7_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date("2026-05-19");
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

export default function PatientAppointments() {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState(NEXT_7_DAYS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const confirmCancel = () => {
    if (cancelId) {
      setCancelled((prev) => new Set([...prev, cancelId]));
      setCancelId(null);
      toast.success("Appointment cancelled successfully.");
    }
  };

  const bookAppointment = () => {
    if (!selectedSlot) return toast.warning("Please select a time slot.");
    toast.success("Appointment booked successfully!");
    setSelectedSlot(null);
  };

  const slotsForDay = AVAILABLE_SLOTS.filter((s) => s.date === selectedDay);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground">
        Appointments
      </h1>

      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Upcoming Appointments
        </h2>
        <div className="space-y-3">
          {PATIENT_APPOINTMENTS.filter(
            (a) => a.status === "upcoming" && !cancelled.has(a.id),
          ).map((apt, i) => (
            <div
              key={apt.id}
              data-ocid={`patient.appointment.item.${i + 1}`}
              className="rounded-xl border border-border bg-card p-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-foreground">
                    {apt.doctorName}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[apt.status]}`}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {apt.doctorSpecialization} · {apt.department}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.date} at {apt.time}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {apt.location}
                  </span>
                </div>
              </div>
              <button
                type="button"
                data-ocid={`patient.appointment.cancel_button.${i + 1}`}
                onClick={() => setCancelId(apt.id)}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          ))}
          {PATIENT_APPOINTMENTS.filter(
            (a) => a.status === "upcoming" && !cancelled.has(a.id),
          ).length === 0 && (
            <div
              data-ocid="patient.appointment.empty_state"
              className="text-center py-8 text-muted-foreground"
            >
              No upcoming appointments.
            </div>
          )}
        </div>
      </section>

      {/* Book New Appointment */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Book New Appointment
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          {/* Day selector */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Select Date
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {NEXT_7_DAYS.map((day) => {
                const d = new Date(day);
                const label = d.toLocaleDateString("en-US", {
                  weekday: "short",
                });
                const num = d.getDate();
                return (
                  <button
                    key={day}
                    type="button"
                    data-ocid={`patient.booking.day.${num}`}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl border text-sm font-medium transition-all shrink-0 ${
                      selectedDay === day
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs opacity-70">{label}</span>
                    <span className="text-lg font-bold">{num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slot grid */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Available Slots
            </p>
            {slotsForDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No slots available for this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slotsForDay.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    data-ocid={`patient.booking.slot.${slot.id}`}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3 rounded-xl border text-left text-sm transition-all ${
                      !slot.isAvailable
                        ? "opacity-40 cursor-not-allowed border-border bg-muted/30"
                        : selectedSlot === slot.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <div className="font-semibold">{slot.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {slot.doctorName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {slot.doctorSpecialization}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            data-ocid="patient.booking.submit_button"
            onClick={bookAppointment}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      </section>

      {/* Previous Appointments */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Past Appointments
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {PATIENT_APPOINTMENTS.filter(
                  (a) => a.status !== "upcoming",
                ).map((apt, _i) => (
                  <tr
                    key={apt.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {apt.doctorName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {apt.type}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {apt.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[apt.status]}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cancel Confirmation Dialog */}
      {cancelId && (
        <div
          data-ocid="patient.cancel_appointment.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-card rounded-2xl p-6 w-[400px] max-w-[90vw] border border-border shadow-elevation-high">
            <h3 className="text-lg font-bold font-display text-foreground mb-2">
              Cancel Appointment?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="patient.cancel_appointment.confirm_button"
                onClick={confirmCancel}
                className="flex-1 py-2 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Yes, Cancel
              </button>
              <button
                type="button"
                data-ocid="patient.cancel_appointment.cancel_button"
                onClick={() => setCancelId(null)}
                className="flex-1 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
